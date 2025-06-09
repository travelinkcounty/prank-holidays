"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Trash2, Search, RefreshCw, Edit } from "lucide-react";
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
  const [usageModal, setUsageModal] = useState<Membership | null>(null);
  const [deleteMembershipModal, setDeleteMembershipModal] = useState<Membership | null>(null);
  const [usageForm, setUsageForm] = useState({ usedDays: 0, usedNights: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>("add");
  const [form, setForm] = useState({
    userId: '',
    plan_ref: '',
    usedDays: 0,
    usedNights: 0,
    status: 'active',
  });

  React.useEffect(() => {
    dispatch(fetchMemberships());
    dispatch(fetchUsers());
    dispatch(fetchPlans());
  }, [dispatch]);

  // Helper to get user/plan by id
  const getUser = (id: string) => users.find((u) => u.uid === id);
  const getPlan = (id: string) => plans.find((p) => p.uid === id);

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
  const openUsageModal = (membership: Membership) => {
    setUsageModal(membership);
    setUsageForm({ usedDays: membership.usedDays, usedNights: membership.usedNights });
  };

  const handleUpdateUsage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usageModal) return;
    dispatch(updateMembership({
      usedDays: usageForm.usedDays,
      usedNights: usageForm.usedNights
    }, usageModal.id));
    setUsageModal(null);
    toast.success("Usage updated!");
  };

  const handleDelete = () => {
    if (!deleteMembershipModal) return;
    dispatch(deleteMembership(deleteMembershipModal.id));
    setDeleteMembershipModal(null);
    toast.success("Membership deleted!");
  };

  const openAddModal = () => {
    setModalMode('add');
    setForm({ userId: '', plan_ref: '', usedDays: 0, usedNights: 0, status: 'active' });
    setModalOpen(true);
  };

  const openEditModal = (membership: Membership) => {
    setModalMode('edit');
    setForm({
      userId: membership.userId,
      plan_ref: membership.plan_ref,
      usedDays: membership.usedDays,
      usedNights: membership.usedNights,
      status: membership.status || 'active',
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
    setForm((f) => ({ ...f, [name]: Number(value) }));
  };

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const plan = getPlan(form.plan_ref);
    const totalDays = plan?.days ? parseInt(plan.days, 10) : 0;
    const totalNights = plan?.nights ? parseInt(plan.nights, 10) : 0;
    if (modalMode === 'add') {
      await dispatch(addMembership({
        userId: form.userId,
        plan_ref: form.plan_ref,
        usedDays: form.usedDays,
        usedNights: form.usedNights,
        totalDays,
        totalNights,
        status: form.status,
      }));
      dispatch(fetchMemberships());
      toast.success('Membership added!');
    } else if (modalMode === 'edit' && editMembership) {
      await dispatch(updateMembership({
        userId: form.userId,
        plan_ref: form.plan_ref,
        usedDays: form.usedDays,
        usedNights: form.usedNights,
        totalDays,
        totalNights,
        status: form.status,
      }, editMembership.id));
      dispatch(fetchMemberships());
      toast.success('Membership updated!');
    }
    closeModal();
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
                  <SelectItem key={plan.id} value={String(plan.id)}>{plan.name}</SelectItem>
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
              filteredMemberships.map((m) => {
                const user = getUser(m.userId);
                const plan = getPlan(m.plan_ref);
                const totalDays = plan?.days ? parseInt(plan.days, 10) : 0;
                const totalNights = plan?.nights ? parseInt(plan.nights, 10) : 0;
                const usedDays = m.usedDays;
                const usedNights = m.usedNights;
                const remDays = Math.max(totalDays - usedDays, 0);
                const remNights = Math.max(totalNights - usedNights, 0);
                return (
                  <tr key={m.id} className="border-b last:border-none hover:bg-[#f1f3f5]">
                    <td className="px-4 py-3 font-medium">{user?.name}</td>
                    <td className="px-4 py-3">{plan?.name}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge className="bg-[#e9c46a] text-black mr-1">{totalDays}D</Badge>
                      <Badge className="bg-[#457b9d] text-white">{totalNights}N</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge className="bg-[#f4a261] text-black mr-1">{usedDays}D</Badge>
                      <Badge className="bg-[#264653] text-white">{usedNights}N</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge className="bg-[#2ecc71] text-white mr-1">{remDays}D</Badge>
                      <Badge className="bg-[#2d6a4f] text-white">{remNights}N</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" variant="ghost" onClick={() => openUsageModal(m)} aria-label="Update Usage">
                          <RefreshCw className="w-4 h-4 mr-1" /> Update Usage
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Update Usage Modal */}
      <Dialog open={!!usageModal} onOpenChange={(open) => !open && setUsageModal(null)}>
        <DialogContent>
          <form onSubmit={handleUpdateUsage} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Update Usage</DialogTitle>
            </DialogHeader>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Used Days</label>
                <Input
                  type="number"
                  min={0}
                  max={usageModal ? getPlan(usageModal.plan_ref || '')?.days : 0}
                  value={usageForm.usedDays}
                  onChange={e => setUsageForm(f => ({ ...f, usedDays: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Used Nights</label>
                <Input
                  type="number"
                  min={0}
                  max={usageModal ? getPlan(usageModal.plan_ref || '')?.nights : 0}
                  value={usageForm.usedNights}
                  onChange={e => setUsageForm(f => ({ ...f, usedNights: Number(e.target.value) }))}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />} Update
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteMembershipModal} onOpenChange={(open) => !open && setDeleteMembershipModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Membership</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this membership? This action cannot be undone.</div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} Delete
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Membership Modal */}
      <Dialog open={modalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <form onSubmit={handleModalSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{modalMode === 'add' ? 'Add Membership' : 'Edit Membership'}</DialogTitle>
            </DialogHeader>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">User</label>
                <Select name="userId" value={form.userId} onValueChange={(value: string) => setForm(f => ({ ...f, userId: value }))} required>
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
                <Select name="plan_ref" value={form.plan_ref} onValueChange={(value: string) => setForm(f => ({ ...f, plan_ref: value }))} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((p) => (
                      <SelectItem key={p.id} value={p.uid}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Used Days</label>
                <Input type="number" name="usedDays" min={0} max={getPlan(String(form.plan_ref || ''))?.days ? (getPlan(String(form.plan_ref || ''))?.days, 10) : 0} value={form.usedDays} onChange={handleFormNumberChange} required />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Used Nights</label>
                <Input type="number" name="usedNights" min={0} max={getPlan(String(form.plan_ref || ''))?.nights ? (getPlan(String(form.plan_ref || ''))?.nights, 10) : 0} value={form.usedNights} onChange={handleFormNumberChange} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select name="status" value={form.status} onValueChange={value => setForm(f => ({ ...f, status: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />} {modalMode === 'add' ? 'Add' : 'Update'}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
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