"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { fetchJoins, selectJoins, selectLoading, selectError, updateJoin, deleteJoin, addJoin } from "@/lib/redux/features/joinSlice";
import { AppDispatch } from "@/lib/redux/store";


export default function JoinsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const joins = useSelector(selectJoins);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editJoin, setEditJoin] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", age: "", from: "", status: "New" });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [joinToDelete, setJoinToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchJoins());
  }, [dispatch]);

  // Filtered joins
  const filteredJoins = useMemo(
    () =>
      joins?.filter(
        (j) =>
          (statusFilter === "all" || j.status?.toLowerCase() === statusFilter) &&
          (j.name.toLowerCase().includes(search.toLowerCase()) ||
            j.email.toLowerCase().includes(search.toLowerCase()) ||
            j.phone.toLowerCase().includes(search.toLowerCase()) ||
              j.status?.toLowerCase().includes(search.toLowerCase()))
      ),
    [joins, search, statusFilter]
  );

  // Handlers
  const openAddModal = () => {
    setEditJoin(null);
    setForm({ name: "", email: "", phone: "", age: "", from: "", status: "New" });
    setModalOpen(true);
  };

  const openEditModal = (join: any) => {
    setEditJoin(join);
    setForm({ name: join.name, email: join.email, phone: join.phone, age: join.age, from: join.from, status: join.status });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!joinToDelete) return;
    setIsDeleting(true);
    await dispatch(deleteJoin(joinToDelete));
    setIsDeleting(false); 
    dispatch(fetchJoins());
    toast.success("Join deleted!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(true);
    if (editJoin) {
      const join = { ...form, id: editJoin.id, createdOn: editJoin.createdOn, updatedOn: new Date().toISOString() };
      await dispatch(updateJoin(editJoin.id, join));
      toast.success("Join updated!");
    } else {
      const newJoin = { ...form, id: Math.random().toString(36).substr(2, 9), createdOn: new Date().toISOString(), updatedOn: new Date().toISOString() };
      await dispatch(addJoin(newJoin));
      toast.success("Join added!");
    }
    setModalOpen(false);
    setIsEditing(false);
    setIsDeleting(false);
    dispatch(fetchJoins());
  };

  if(error) {
    return (
      <div className="mx-auto p-0 flex flex-col gap-8">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Joins</h2>
        <p>Error loading joins. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto p-0 flex flex-col gap-8">
      {/* Lead List Heading and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-1 flex-wrap">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Lead List</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center justify-end">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Input
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openAddModal} className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Add Lead
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white shadow p-4 mt-2">
        <Table>
          <TableHeader >
            <TableRow>
              <TableHead className="text-lg font-semibold">Name</TableHead>
              <TableHead className="text-lg font-semibold">Email</TableHead>
              <TableHead className="text-lg font-semibold">Phone</TableHead>
              <TableHead className="text-lg font-semibold">Status</TableHead>
              <TableHead className="text-lg font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody >
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {filteredJoins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400">
                  No joins found.
                </TableCell>
              </TableRow>
            ) : (
              filteredJoins.map((join) => (
                <TableRow key={join.id}>
                  <TableCell>{join.name}</TableCell>
                  <TableCell>{join.email}</TableCell>
                  <TableCell>{join.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        join.status === "New"
                          ? "default"
                          : join.status === "Contacted"
                          ? "default"
                          : join.status === "Converted"
                          ? "default"
                          : "default"
                      }
                      className={
                        join.status === "New"
                          ? "bg-[#ffe066] text-[#b8860b]"
                          : join.status === "Contacted"
                          ? "bg-[#a2d2ff] text-[#1864ab]"
                          : join.status === "Converted"
                          ? "bg-[#43aa8b] text-white"
                          : ""
                      }
                    >
                      {join.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(join)}
                      aria-label="Edit"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setJoinToDelete(join.id || null)}
                      aria-label="Delete"
                      disabled={isDeleting}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editJoin ? "Edit Join" : "Add Join"}</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              required
            />
            <Input
              placeholder="Age"
              value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              required
            />
            <Input
              placeholder="From"
              value={form.from}
              onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
              required
            />
            <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button type="submit" disabled={isEditing} className="gap-2">
                {isEditing && <Loader2 className="w-4 h-4 animate-spin" />}
                {editJoin ? "Update" : "Add"}
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
      <Dialog open={!!joinToDelete} onOpenChange={(open) => !open && setJoinToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Join</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete <span className="font-semibold text-[#e63946]">{joinToDelete}</span>? This action cannot be undone.</div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />} Delete
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={isDeleting}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}