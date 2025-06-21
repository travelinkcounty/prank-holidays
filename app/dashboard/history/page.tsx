"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Trash2, Edit, Search, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { fetchHistories, selectHistories, selectLoading, selectError, addHistory, updateHistory, deleteHistory } from "@/lib/redux/features/historySlice";
import { selectUsers, fetchUsers } from "@/lib/redux/features/authSlice";
import { selectPackages, fetchPackages } from "@/lib/redux/features/packageSlice";
import type { History } from "@/lib/redux/features/historySlice";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function HistoryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const histories = useSelector(selectHistories);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const users = useSelector(selectUsers);
  const packages = useSelector(selectPackages);

  const [search, setSearch] = useState("");
  const [editHistory, setEditHistory] = useState<History | null>(null);
  const [deleteHistoryModal, setDeleteHistoryModal] = useState<History | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>("add");
  const [form, setForm] = useState({
    userId: '',
    package_ref: '',
    status: 'active',
  });

  React.useEffect(() => {
    dispatch(fetchHistories());
    dispatch(fetchUsers());
    dispatch(fetchPackages());
  }, [dispatch]);

  // Helpers
  const getUser = (id: string) => users.find((u) => u.uid === id);
  const getPackage = (packageRef: any) => {
    // If it's a string (uid), use it directly
    if (typeof packageRef === 'string') {
      return packages.find((p) => p.uid === packageRef);
    }
    // If it's a Firestore reference, get the ID from segments
    if (packageRef?._path?.segments) {
      const packageId = packageRef._path.segments[1];
      return packages.find((p) => p.uid === packageId);
    }
    // If it has packageId field
    if (packageRef?.packageId) {
      return packages.find((p) => p.uid === packageRef.packageId);
    }
    return null;
  };

  // Filtered histories
  const filteredHistories = React.useMemo(() => {
    return histories.filter((h) => {
      const user = getUser(h.userId);
      const pkg = getPackage(h.package_ref);
      const matchesSearch =
        (user?.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (pkg?.name?.toLowerCase() || "").includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [histories, users, packages, search]);

  // Helper to format Firestore Timestamp or string/Date
  function formatFirestoreTimestamp(ts: any) {
    if (!ts) return '';
    if (ts instanceof Date) return ts.toLocaleString();
    if (typeof ts === 'object' && '_seconds' in ts) {
      return new Date(ts._seconds * 1000).toLocaleString();
    }
    if (typeof ts === 'string') return new Date(ts).toLocaleString();
    return '';
  }

  // Handlers
  const openAddModal = () => {
    setModalMode('add');
    setForm({ userId: '', package_ref: '', status: 'active' });
    setModalOpen(true);
  };
  const openEditModal = (history: History) => {
    setModalMode('edit');
    // Extract package_ref ID whether it's a reference object or direct ID
    const packageRefId = typeof history.package_ref === 'string' 
      ? history.package_ref 
      : (history.package_ref as { _path?: { segments: string[] } })?._path?.segments?.[1] || '';

    setForm({
      userId: history.userId,
      package_ref: packageRefId,
      status: history.status || 'active',
    });
    setEditHistory(history);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditHistory(null);
  };


  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Create package_ref in Firestore reference format
    const packageRef = {
      _firestore: {
        projectId: "prank-holidays"
      },
      _path: {
        segments: [
          "packages",
          form.package_ref
        ]
      },
      _converter: {}
    };

    if (modalMode === 'add') {
      await dispatch(addHistory({
        userId: form.userId,
        package_ref: packageRef,
        status: form.status,
      }));
      dispatch(fetchHistories());
      toast.success('History added!');
    } else if (modalMode === 'edit' && editHistory) {
      await dispatch(updateHistory({
        userId: form.userId,
        package_ref: packageRef,
        status: form.status,
      }, editHistory.id));
      dispatch(fetchHistories());
      toast.success('History updated!');
    }
    closeModal();
  };
  const handleDelete = () => {
    if (!deleteHistoryModal) return;
    dispatch(deleteHistory(deleteHistoryModal.id));
    dispatch(fetchHistories());
    setDeleteHistoryModal(null);
    toast.success("History deleted!");
  };

  if (error) {
    return (
      <div className="mx-auto p-0 flex flex-col gap-8">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Histories</h2>
        <p>Error loading histories. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto p-0 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-1 flex-wrap">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Histories</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center justify-end">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Input
                placeholder="Search histories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <Button onClick={openAddModal} className="bg-[#43aa8b] text-white font-bold">
            <PlusCircle className="w-4 h-4 mr-1" /> Add History
          </Button>
        </div>
      </div>
      <div className="rounded-2xl bg-white shadow p-4 mt-2 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#f8f9fa]">
              <th className="text-lg font-bold text-[#e63946] px-4 py-3 text-left">User</th>
              <th className="text-lg font-bold text-[#e63946] px-4 py-3 text-left">Package</th>
              <th className="text-lg font-bold text-[#e63946] px-4 py-3 text-center">Status</th>
              <th className="text-lg font-bold text-[#e63946] px-4 py-3 text-center">Created</th>
              <th className="text-lg font-bold text-[#e63946] px-4 py-3 text-center">Updated</th>
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
            {filteredHistories.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-8">No histories found.</td>
              </tr>
            ) : (
              filteredHistories.map((h) => {
                const user = getUser(h.userId);
                const pkg = getPackage(h.package_ref);
                return (
                  <tr key={h.id} className="border-b last:border-none hover:bg-[#f1f3f5]">
                    <td className="px-4 py-3 font-medium">{user?.name || user?.email}</td>
                    <td className="px-4 py-3">{pkg?.name}</td>
                    <td className="px-4 py-3 text-center">{h.status}</td>
                    <td className="px-4 py-3 text-center">{formatFirestoreTimestamp(h.createdOn)}</td>
                    <td className="px-4 py-3 text-center">{formatFirestoreTimestamp(h.updatedOn)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" variant="ghost" onClick={() => openEditModal(h)} aria-label="Edit">
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setDeleteHistoryModal(h)} aria-label="Delete" className="text-destructive">
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
      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteHistoryModal} onOpenChange={(open) => !open && setDeleteHistoryModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete History</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this history? This action cannot be undone.</div>
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
      {/* Add/Edit History Modal */}
      <Dialog open={modalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleModalSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{modalMode === 'add' ? 'Add History' : 'Edit History'}</DialogTitle>
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
                <label className="block text-sm font-medium mb-1">Package</label>
                <Select name="package_ref" value={form.package_ref} onValueChange={(value: string) => setForm(f => ({ ...f, package_ref: value }))} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((p) => (
                      <SelectItem key={p.uid} value={p.uid}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select name="status" value={form.status} onValueChange={(value: string) => setForm(f => ({ ...f, status: value }))} required>
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