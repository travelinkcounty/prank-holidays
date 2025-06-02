"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { fetchPackages, selectPackages, selectError, selectLoading, updatePackage, deletePackage as deletePackageAction, addPackage, Package, setPackages} from "@/lib/redux/features/packageSlice";
import { AppDispatch } from "@/lib/redux/store";
import Image from "next/image";

export default function PackagesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const packages = useSelector(selectPackages);
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editPackage, setEditPackage] = useState<Package | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: 0, image: "", days: "", locationId: "" });
  const [deletePackage, setDeletePackage] = useState<Package | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  // Filtered packages
  const filteredPackages = useMemo(
    () =>
      (Array.isArray(packages) ? packages : []).filter(
        (p) =>
          (p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase()) ||
            p.days?.toLowerCase().includes(search.toLowerCase()))
      ),
    [packages, search]
  );

  // Handlers
  const openAddModal = () => {
    setEditPackage(null);
    setForm({ name: "", description: "", price: 0, image: "", days: "", locationId: "" });
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEditModal = (pkg: Package) => {
    setEditPackage(pkg);
    setForm({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      image: pkg.image,
      days: pkg.days,
      locationId: pkg.locationId
    });
    setImageFile(null);
    setImagePreview(pkg.image || null);
    setModalOpen(true);
  };

  const handleDelete = () => {
    if (!deletePackage) return;
    setIsDeleting(true);
    setTimeout(() => {
      setPackages((prev: Package[]) => prev.filter((p: Package) => p.id !== deletePackage.id));
      setIsDeleting(false);
      setDeletePackage(null);
      toast.success("Package deleted!");
    }, 800);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (true);
    setTimeout(() => {
      const imageToUse = imagePreview || form.image;
      if (editPackage) {
        setPackages((prev: Package[]) =>
          prev.map((p: Package) =>
            p.id === editPackage.id ? { ...p, ...form, image: imageToUse } : p
          )
        );
        toast.success("Package updated!");
      } else {
        setPackages((prev: Package[]) => [
          ...prev,
          { id: Date.now().toString(), ...form, image: imageToUse },
        ]);
        toast.success("Package added!");
      }
      setModalOpen(false);
      setImageFile(null);
      setImagePreview(null);
    }, 1000);
  };

  return (
    <div className="mx-auto p-0 flex flex-col gap-8">
      {/* Package List Heading and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-1 flex-wrap">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Packages</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center justify-end">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Input
                placeholder="Search packages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <Button onClick={openAddModal} className="gap-2 w-full sm:w-auto cursor-pointer">
            <Plus className="w-4 h-4" /> Add Package
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredPackages.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12">No packages found.</div>
        ) : (
          filteredPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden">
              <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                {pkg.image ? (
                  <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                ) : (
                  <ImageIcon className="w-16 h-16 text-gray-300" />
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-main)' }}>{pkg.name}</div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditModal(pkg)}
                    aria-label="Edit"
                    className="cursor-pointer"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeletePackage(pkg)}
                    aria-label="Delete"
                    disabled={loading}
                    className="text-destructive cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editPackage ? "Edit Package" : "Add Package"}</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              required
            />
            <Input
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
              required
            />
            <Input
              placeholder="Days"
              value={form.days}
              onChange={(e) => setForm((f) => ({ ...f, days: e.target.value }))}
              required
            />
            <Input
              placeholder="Location ID"
              value={form.locationId}
              onChange={(e) => setForm((f) => ({ ...f, locationId: e.target.value }))}
              required
            />
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium">Image</label>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-2 border" />
              ) : null}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e63946]/10 file:text-[#e63946]"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading} className="gap-2 cursor-pointer">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editPackage ? "Update" : "Add"}
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
      <Dialog open={!!(deletePackage && deletePackage.id)} onOpenChange={(open) => !open && setDeletePackage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete <span className="font-semibold text-[#e63946]">{deletePackage?.name}</span>? This action cannot be undone.</div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="gap-2 cursor-pointer"
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