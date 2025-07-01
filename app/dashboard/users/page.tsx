"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { selectUsers, selectIsLoading, selectError, fetchUsers, addUser, updateUser, deleteUserByUid } from "@/lib/redux/features/authSlice";
import { AppDispatch } from "@/lib/redux/store";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>()
  const users = useSelector(selectUsers)
  const isLoading = useSelector(selectIsLoading)
  const error = useSelector(selectError)

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    phone: "",
    address: "",
    status: "",
    gender: "",
    nationality: "",
    dob: "",
    maritalStatus: ""
  });
  const [deleteUserObj, setDeleteUserObj] = useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  // Filtered users
  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u: any) =>
          (u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.role?.toLowerCase().includes(search.toLowerCase()))
      ),
    [users, search]
  );

  // Handlers
  const openAddModal = () => {
    setEditUser(null);
    setForm({
      name: "",
      email: "",
      role: "",
      password: "",
      phone: "",
      address: "",
      status: "",
      gender: "",
      nationality: "",
      dob: "",
      maritalStatus: ""
    });
    setModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setEditUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      password: "",
      phone: user.phone || "",
      address: user.address || "",
      status: user.status || "",
      gender: user.gender || "",
      nationality: user.nationality || "",
      dob: user.dob || "",
      maritalStatus: user.maritalStatus || ""
    });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteUserObj) return;
    setLoading(true);
    try {
      await dispatch(deleteUserByUid(deleteUserObj.uid));
      dispatch(fetchUsers());
      toast.success("User deleted!");
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
      setDeleteUserObj(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editUser) {
        const payload: any = { uid: editUser.uid, ...form };
        if (!form.password) delete payload.password;
        await dispatch(updateUser(payload));
        dispatch(fetchUsers());
        toast.success("User updated!");
      } else {
        await dispatch(addUser({
          email: form.email,
          password: form.password,
          name: form.name,
          role: form.role,
          phone: form.phone,
          address: form.address,
          status: form.status,
          gender: form.gender,
          nationality: form.nationality,
          dob: form.dob,
          maritalStatus: form.maritalStatus
        }));
        dispatch(fetchUsers());
        toast.success("User added!");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(editUser ? "Failed to update user" : "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="mx-auto p-0 flex flex-col gap-8">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Users</h2>
        <p>Error loading users. Please try again later.</p>
      </div>
    )
  }


  return (
    <div className="mx-auto p-0 gap-8">
      {/* User List Heading and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-1 flex-wrap">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>User List</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center justify-end">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <Button onClick={openAddModal} className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Add User
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white shadow p-4 mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-lg font-semibold">ID</TableHead>
              <TableHead className="text-lg font-semibold">Name</TableHead>
              <TableHead className="text-lg font-semibold">Email</TableHead>
              <TableHead className="text-lg font-semibold">Role</TableHead>
              <TableHead className="text-lg font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-400 py-12">
                  <Loader2 className="w-10 h-10 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-400">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>{user.tlcId}</TableCell>
                  <TableCell>{user.name || user.email}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(user)}
                      aria-label="Edit"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteUserObj(user)}
                      aria-label="Delete"
                      disabled={loading}
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
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DialogHeader className="col-span-1 md:col-span-2">
              <DialogTitle>{editUser ? "Edit User" : "Add User"}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#1a4d8f]">Name</label>
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#1a4d8f]">Email</label>
              <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#1a4d8f]">Password{editUser ? " (leave blank to keep unchanged)" : ""}</label>
              <Input
                placeholder="Password"
                type="password"
                value={form.password || ""}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required={!editUser}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#1a4d8f]">Phone</label>
              <Input
                placeholder="Phone"
                type="tel"
                value={form.phone || ""}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#1a4d8f]">Address</label>
              <Input
                placeholder="Address"
                value={form.address || ""}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#1a4d8f]">Status</label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm((f) => ({ ...f, status: value }))}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#1a4d8f]">Role</label>
              <Select
                value={form.role}
                onValueChange={(value) => setForm((f) => ({ ...f, role: value }))}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#1a4d8f]">Gender</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.gender}
                onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#1a4d8f]">Nationality</label>
              <Input
                placeholder="Nationality"
                value={form.nationality}
                onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#1a4d8f]">Date of Birth</label>
              <Input
                type="date"
                value={form.dob}
                onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#1a4d8f]">Marital Status</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.maritalStatus}
                onChange={e => setForm(f => ({ ...f, maritalStatus: e.target.value }))}
              >
                <option value="">Select status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <DialogFooter className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editUser ? "Update" : "Add"}
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
      <Dialog open={!!deleteUserObj} onOpenChange={(open) => !open && setDeleteUserObj(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete <span className="font-semibold text-[#e63946]">{deleteUserObj?.name || deleteUserObj?.email}</span>? This action cannot be undone.</div>
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

