"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Edit, Trash2, Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Mock data types
interface User {
  id: number;
  name: string;
}
interface Plan {
  id: number;
  name: string;
  days: number;
  nights: number;
}
interface Membership {
  id: number;
  userId: number;
  planId: number;
  usedDays: number;
  usedNights: number;
}

const users: User[] = [
  { id: 1, name: "Amit Sharma" },
  { id: 2, name: "Priya Singh" },
  { id: 3, name: "Rahul Verma" },
];

const plans: Plan[] = [
  { id: 1, name: "Goa 6D/4N", days: 6, nights: 4 },
  { id: 2, name: "Manali 4D/3N", days: 4, nights: 3 },
  { id: 3, name: "Jaipur 3D/2N", days: 3, nights: 2 },
];

const initialMemberships: Membership[] = [
  {
    id: 1,
    userId: 1,
    planId: 1,
    usedDays: 3,
    usedNights: 2,
  },
  {
    id: 2,
    userId: 2,
    planId: 2,
    usedDays: 1,
    usedNights: 1,
  },
  {
    id: 3,
    userId: 3,
    planId: 3,
    usedDays: 0,
    usedNights: 0,
  },
];

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>(initialMemberships);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [editMembership, setEditMembership] = useState<Membership | null>(null);
  const [usageModal, setUsageModal] = useState<Membership | null>(null);
  const [deleteMembership, setDeleteMembership] = useState<Membership | null>(null);
  const [usageForm, setUsageForm] = useState({ usedDays: 0, usedNights: 0 });

  // Helper to get user/plan by id
  const getUser = (id: number) => users.find((u) => u.id === id);
  const getPlan = (id: number) => plans.find((p) => p.id === id);

  // Filtered memberships
  const filteredMemberships = useMemo(() => {
    return memberships.filter((m) => {
      const user = getUser(m.userId);
      const plan = getPlan(m.planId);
      const matchesSearch =
        user?.name.toLowerCase().includes(search.toLowerCase()) ||
        plan?.name.toLowerCase().includes(search.toLowerCase());
      const matchesPlan = planFilter === "all" || m.planId === Number(planFilter);
      return matchesSearch && matchesPlan;
    });
  }, [memberships, search, planFilter]);

  // Handlers
  const openUsageModal = (membership: Membership) => {
    setUsageModal(membership);
    setUsageForm({ usedDays: membership.usedDays, usedNights: membership.usedNights });
  };

  const handleUpdateUsage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usageModal) return;
    setLoading(true);
    setTimeout(() => {
      setMemberships((prev) =>
        prev.map((m) =>
          m.id === usageModal.id
            ? { ...m, usedDays: usageForm.usedDays, usedNights: usageForm.usedNights }
            : m
        )
      );
      setLoading(false);
      setUsageModal(null);
      toast.success("Usage updated!");
    }, 800);
  };

  const handleDelete = () => {
    if (!deleteMembership) return;
    setLoading(true);
    setTimeout(() => {
      setMemberships((prev) => prev.filter((m) => m.id !== deleteMembership.id));
      setLoading(false);
      setDeleteMembership(null);
      toast.success("Membership deleted!");
    }, 800);
  };

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
            {filteredMemberships.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-8">No memberships found.</td>
              </tr>
            ) : (
              filteredMemberships.map((m) => {
                const user = getUser(m.userId);
                const plan = getPlan(m.planId);
                const totalDays = plan?.days || 0;
                const totalNights = plan?.nights || 0;
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
                        <Button size="sm" variant="ghost" onClick={() => setDeleteMembership(m)} aria-label="Delete" className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
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
                  max={usageModal ? getPlan(usageModal.planId)?.days : 0}
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
                  max={usageModal ? getPlan(usageModal.planId)?.nights : 0}
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
      <Dialog open={!!deleteMembership} onOpenChange={(open) => !open && setDeleteMembership(null)}>
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
    </div>
  );
}