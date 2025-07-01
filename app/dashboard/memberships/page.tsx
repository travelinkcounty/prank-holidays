"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Trash2, Search, RefreshCw, Edit, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { fetchMemberships, selectMemberships, selectLoading, selectError, addMembership, updateMembership, deleteMembership } from "@/lib/redux/features/membershipSlice";
import { selectUsers, fetchUsers } from "@/lib/redux/features/authSlice";
import { fetchPlans, selectPlans } from "@/lib/redux/features/planSlice";
import type { Membership } from "@/lib/redux/features/membershipSlice";

export default function MembershipsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const memberships = useSelector(selectMemberships);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const users = useSelector(selectUsers);
  const plans = useSelector(selectPlans);

  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [editMembership, setEditMembership] = useState<Membership | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>("add");
  const [form, setForm] = useState({
    userId: '',
    tlcId: '',
    plan_ref: '',
    usedDays: '0',
    usedNights: '0',
    status: 'active',
  });

  // Helper to sum usage
  const sumUsage = (usageArr: any[]) => usageArr.reduce((acc, u) => ({ days: acc.days + (u.days || 0), nights: acc.nights + (u.nights || 0) }), { days: 0, nights: 0 });

  // Add Usage Modal State
  const [addUsageModal, setAddUsageModal] = useState<{ membership: Membership | null, open: boolean }>({ membership: null, open: false });
  const [usageForm, setUsageForm] = useState({ location: '', date: '', days: '', nights: '' });
  const [usageError, setUsageError] = useState('');
  const [addUsageLoading, setAddUsageLoading] = useState(false);
  const [addEditLoading, setAddEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [deleteMembershipModal, setDeleteMembershipModal] = useState<Membership | null>(null);

  // State to track expanded membership row
  const [expandedMembershipId, setExpandedMembershipId] = useState<string | null>(null);

  React.useEffect(() => {
    dispatch(fetchMemberships());
    dispatch(fetchUsers());
    dispatch(fetchPlans());
  }, [dispatch]);

  // Helper to get user/plan by id
  const getUser = (id: string) => users.find((u) => u.uid === id);
  
  const getPlan = (planRef: any) => {
    // If planRef is a string, use it directly
    if (typeof planRef === 'string') {
      return plans.find((p) => p.uid === planRef);
    }
    
    // If planRef is an object with _path.segments, extract the plan ID
    if (planRef && typeof planRef === 'object' && planRef._path?.segments) {
      const planId = planRef._path.segments[1];
      return plans.find((p) => p.uid === planId);
    }
    
    // If planRef has a planId property (legacy format)
    if (planRef && typeof planRef === 'object' && planRef.planId) {
      return plans.find((p) => p.uid === planRef.planId);
    }
    
    return null;
  };

  // Filtered memberships
  const filteredMemberships = React.useMemo(() => {
    return memberships.filter((m) => {
      const user = getUser(m.userId);
      const plan = getPlan(m.plan_ref);
      const matchesSearch =
        (user?.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (plan?.name?.toLowerCase() || "").includes(search.toLowerCase());
      const matchesPlan = planFilter === "all" || m.plan_ref === planFilter;
      return matchesSearch && matchesPlan;
    });
  }, [memberships, users, plans, search, planFilter]);

  // Handlers
  const openAddModal = () => {
    setModalMode('add');
    setForm({ userId: '', plan_ref: '', usedDays: '0', usedNights: '0', status: 'active', tlcId: '' });
    setModalOpen(true);
  };

  const openEditModal = (membership: Membership) => {
    setModalMode('edit');
    setForm({
      userId: membership.userId,
      plan_ref: membership.plan_ref,
      usedDays: membership.usedDays.toString(),
      usedNights: membership.usedNights.toString(),
      status: membership.status || 'active',
      tlcId: membership.tlcId || '',
    });
    setEditMembership(membership);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditMembership(null);
  };

  const handleFormNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddEditLoading(true);
    try {
      const plan = getPlan(form.plan_ref);
      const totalDays = plan?.days ? parseInt(plan.days, 10) : 0;
      const totalNights = plan?.nights ? parseInt(plan.nights, 10) : 0;

      // Backend expects just the plan ID, not the full Firestore reference object
      if (modalMode === 'add') {
        await dispatch(addMembership({
          userId: form.userId,
          tlcId: form.tlcId,
          plan_ref: form.plan_ref, // Send just the ID, the backend will create the reference
          usedDays: Number(form.usedDays),
          usedNights: Number(form.usedNights),
          totalDays,
          totalNights,
          status: form.status,
          usage: [],
        }));
        toast.success('Membership added!');
      } else if (modalMode === 'edit' && editMembership) {
        await dispatch(updateMembership({
          userId: form.userId,
          tlcId: form.tlcId,
          plan_ref: form.plan_ref, // Send just the ID, the backend will create the reference
          usedDays: Number(form.usedDays),
          usedNights: Number(form.usedNights),
          totalDays,
          totalNights,
          status: form.status,
        }, editMembership.id));
        toast.success('Membership updated!');
      }
      dispatch(fetchMemberships());
      closeModal();
    } finally {
      setAddEditLoading(false);
    }
  };

  // Add Usage Handler
  const handleAddUsage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!addUsageModal.membership) return;
    setAddUsageLoading(true);
    try {
      const { days, nights } = usageForm;
      const plan = getPlan(addUsageModal.membership.plan_ref);
      const totalDays = plan?.days ? parseInt(plan.days, 10) : 0;
      const totalNights = plan?.nights ? parseInt(plan.nights, 10) : 0;
      const currentUsage = sumUsage(addUsageModal.membership.usage || []);
      const newDays = currentUsage.days + Number(days);
      const newNights = currentUsage.nights + Number(nights);
      if (newDays > totalDays || newNights > totalNights) {
        setUsageError('Total used days/nights cannot exceed plan limit.');
        setAddUsageLoading(false);
        return;
      }
      const newUsageArr = [
        ...(addUsageModal.membership.usage || []),
        { location: usageForm.location, date: usageForm.date, days: Number(days), nights: Number(nights) }
      ];
      await dispatch(updateMembership({ usage: newUsageArr }, addUsageModal.membership.id));
      setAddUsageModal({ membership: null, open: false });
      setUsageForm({ location: '', date: '', days: '', nights: '' });
      setUsageError('');
      toast.success('Usage added!');
      dispatch(fetchMemberships());
    } catch (err) {
      setUsageError('Something went wrong. Please try again.');
    } finally {
      setAddUsageLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteMembershipModal) return;
    setDeleteLoading(true);
    try {
      await dispatch(deleteMembership(deleteMembershipModal.id));
      toast.success("Membership deleted!");
      setDeleteMembershipModal(null);
      dispatch(fetchMemberships());
    } finally {
      setDeleteLoading(false);
    }
  };

  if (error) {
    return (
      <div className="mx-auto p-0 flex flex-col gap-8">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Memberships</h2>
        <p>Error loading memberships. Please try again later.</p>
      </div>
    )
  }
  return (
    <div className="mx-auto p-0 flex flex-col gap-8">
      {/* Heading and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-1 flex-wrap">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Memberships</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center justify-end">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Input
                placeholder="Search memberships..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                {plans.map((plan) => (
                  <SelectItem key={plan.uid} value={String(plan.uid)}>{plan.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={openAddModal} className="bg-[#43aa8b] text-white font-bold"> + Add Membership </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow p-4 mt-2 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#f8f9fa]">
              <th className="w-8"></th>
              <th className="text-lg font-bold text-[#e63946] px-4 py-3 text-left">ID</th>
              <th className="text-lg font-bold text-[#e63946] px-4 py-3 text-left">User</th>
              <th className="text-lg font-bold text-[#e63946] px-4 py-3 text-left">Plan</th>
              <th className="text-lg font-bold text-[#e63946] px-4 py-3 text-center">Total</th>
              <th className="text-lg font-bold text-[#e63946] px-4 py-3 text-center">Used</th>
              <th className="text-lg font-bold text-[#e63946] px-4 py-3 text-center">Remaining</th>
              <th className="text-lg font-bold text-[#e63946] px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-8">
                  <Loader2 className="w-10 h-10 animate-spin" />
                </td>
              </tr>
            )}
            {filteredMemberships.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-8">No memberships found.</td>
              </tr>
            ) : (
              <>
                {filteredMemberships.map((m) => {
                  const user = getUser(m.userId);
                  const plan = getPlan(m.plan_ref);
                  const totalDays = plan?.days ? parseInt(plan.days, 10) : 0;
                  const totalNights = plan?.nights ? parseInt(plan.nights, 10) : 0;
                  const usage = m.usage || [];
                  const used = sumUsage(usage);
                  const remDays = Math.max(totalDays - used.days, 0);
                  const remNights = Math.max(totalNights - used.nights, 0);
                  const isExpanded = expandedMembershipId === m.id;
                  return (
                    <React.Fragment key={m.id}>
                      <tr className="border-b last:border-none hover:bg-[#f1f3f5]">
                        <td className="px-2 py-3 text-center align-middle cursor-pointer" onClick={() => setExpandedMembershipId(isExpanded ? null : m.id)}>
                          {isExpanded ? <ChevronDown className="w-5 h-5 mx-auto" /> : <ChevronRight className="w-5 h-5 mx-auto" />}
                        </td>
                        <td className="px-4 py-3 font-medium cursor-pointer" onClick={() => setExpandedMembershipId(isExpanded ? null : m.id)}>
                          {m.tlcId}
                        </td>
                        <td className="px-4 py-3 font-medium cursor-pointer" onClick={() => setExpandedMembershipId(isExpanded ? null : m.id)}>
                          {user?.name}
                        </td>
                        <td className="px-4 py-3">{plan?.name}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[#e9c46a] text-black mr-1">{totalDays}D</Badge>
                          <Badge className="bg-[#457b9d] text-white">{totalNights}N</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[#f4a261] text-black mr-1">{used.days}D</Badge>
                          <Badge className="bg-[#264653] text-white">{used.nights}N</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={`${remDays === 0 ? 'bg-red-500' : 'bg-[#2ecc71]'} text-white mr-1`}>{remDays}D</Badge>
                          <Badge className={`${remNights === 0 ? 'bg-red-500' : 'bg-[#2d6a4f]'} text-white`}>{remNights}N</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <Button size="sm" variant="ghost" onClick={() => setAddUsageModal({ membership: m, open: true })} aria-label="Add Usage">
                              <RefreshCw className="w-4 h-4 mr-1" /> Add Usage
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setDeleteMembershipModal(m)} aria-label="Delete" className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => openEditModal(m)} aria-label="Edit">
                              <Edit className="w-4 h-4 mr-1" /> Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="bg-[#f8f9fa] rounded-xl p-4 mt-2">
                            <div className="font-semibold mb-2">Usage History</div>
                            {usage.length === 0 ? (
                              <div className="text-gray-500">No usage entries yet.</div>
                            ) : (
                              <table className="w-full text-sm">
                                <thead>
                                  <tr>
                                    <th className="text-left">Location</th>
                                    <th className="text-left">Date</th>
                                    <th className="text-center">Days</th>
                                    <th className="text-center">Nights</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {usage.map((u, idx) => (
                                    <tr key={idx}>
                                      <td>{u.location}</td>
                                      <td>{u.date}</td>
                                      <td className="text-center">{u.days}</td>
                                      <td className="text-center">{u.nights}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Usage Modal */}
      <Dialog open={addUsageModal.open} onOpenChange={(open) => !open && setAddUsageModal({ membership: null, open: false })}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleAddUsage} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add Usage</DialogTitle>
            </DialogHeader>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input
                  type="text"
                  value={usageForm.location}
                  onChange={e => setUsageForm(f => ({ ...f, location: e.target.value }))}
                  required
                  disabled={addUsageLoading}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Date</label>
                <Input
                  type="date"
                  value={usageForm.date}
                  onChange={e => setUsageForm(f => ({ ...f, date: e.target.value }))}
                  required
                  disabled={addUsageLoading}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Days</label>
                <Input
                  type="number"
                  min="0"
                  value={usageForm.days}
                  onChange={e => setUsageForm(f => ({ ...f, days: e.target.value }))}
                  required
                  disabled={addUsageLoading}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Nights</label>
                <Input
                  type="number"
                  min="0"
                  value={usageForm.nights}
                  onChange={e => setUsageForm(f => ({ ...f, nights: e.target.value }))}
                  required
                  disabled={addUsageLoading}
                />
              </div>
            </div>
            {usageError && <div className="text-red-500 text-sm">{usageError}</div>}
            <DialogFooter>
              <Button type="submit" disabled={addUsageLoading} className="gap-2">
                {addUsageLoading && <Loader2 className="w-4 h-4 animate-spin" />} Add Usage
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={addUsageLoading}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteMembershipModal} onOpenChange={(open) => !open && setDeleteMembershipModal(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Delete Membership</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this membership? This action cannot be undone.</div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="gap-2"
            >
              {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />} Delete
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={deleteLoading}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Membership Modal */}
      <Dialog open={modalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleModalSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{modalMode === 'add' ? 'Add Membership' : 'Edit Membership'}</DialogTitle>
            </DialogHeader>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">User</label>
                <Select name="userId" value={form.userId} onValueChange={(value: string) => {
                  const selectedUser = users.find(u => u.uid === value);
                  setForm(f => ({ ...f, userId: value, tlcId: selectedUser?.tlcId || '' }));
                }} required disabled={addEditLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.uid} value={u.uid}>{u.name || u.email}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Plan</label>
                <Select name="plan_ref" value={form.plan_ref} onValueChange={(value: string) => setForm(f => ({ ...f, plan_ref: value }))} required disabled={addEditLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((p) => (
                      <SelectItem key={p.uid} value={p.uid}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Used Days</label>
                <Input 
                  type="number" 
                  name="usedDays" 
                  min="0" 
                  value={form.usedDays} 
                  onChange={handleFormNumberChange} 
                  required 
                  disabled={addEditLoading}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Used Nights</label>
                <Input 
                  type="number" 
                  name="usedNights" 
                  min="0" 
                  value={form.usedNights} 
                  onChange={handleFormNumberChange} 
                  required 
                  disabled={addEditLoading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select name="status" value={form.status} onValueChange={value => setForm(f => ({ ...f, status: value }))} disabled={addEditLoading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">TLC ID</label>
                <Input
                  type="text"
                  name="tlcId"
                  value={form.tlcId}
                  readOnly
                  disabled
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={addEditLoading} className="gap-2">
                {addEditLoading && <Loader2 className="w-4 h-4 animate-spin" />} {modalMode === 'add' ? 'Add' : 'Update'}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={addEditLoading}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}