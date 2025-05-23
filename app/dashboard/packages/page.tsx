"use client";

import React, { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

// Mock package type and data
type Package = {
  id: number;
  title: string;
  image: string;
  type: string;
};

const initialPackages: Package[] = [
  { id: 1, title: "Goa Beach Fun", image: "/mock/goa.jpg", type: "Beach" },
  { id: 2, title: "Manali Adventure", image: "/mock/manali.jpg", type: "Mountain" },
  { id: 3, title: "Jaipur Heritage", image: "/mock/jaipur.jpg", type: "Heritage" },
  { id: 4, title: "Goa Beach Fun", image: "/mock/goa.jpg", type: "Beach" },
  { id: 5, title: "Manali Adventure", image: "/mock/manali.jpg", type: "Mountain" },
  { id: 6, title: "Jaipur Heritage", image: "/mock/jaipur.jpg", type: "Heritage" },
];

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPackage, setEditPackage] = useState<Package | null>(null);
  const [form, setForm] = useState({ title: "", image: "", type: "Beach" });
  const [deletePackage, setDeletePackage] = useState<Package | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered packages
  const filteredPackages = useMemo(
    () =>
      packages.filter(
        (p) =>
          (typeFilter === "all" || p.type.toLowerCase() === typeFilter) &&
          (p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.type.toLowerCase().includes(search.toLowerCase()))
      ),
    [packages, search, typeFilter]
  );

  // Handlers
  const openAddModal = () => {
    setEditPackage(null);
    setForm({ title: "", image: "", type: "Beach" });
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEditModal = (pkg: Package) => {
    setEditPackage(pkg);
    setForm({ title: pkg.title, image: pkg.image, type: pkg.type });
    setImageFile(null);
    setImagePreview(pkg.image || null);
    setModalOpen(true);
  };

  const handleDelete = () => {
    if (!deletePackage) return;
    setLoading(true);
    setTimeout(() => {
      setPackages((prev) => prev.filter((p) => p.id !== deletePackage.id));
      setLoading(false);
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
    setLoading(true);
    setTimeout(() => {
      const imageToUse = imagePreview || form.image;
      if (editPackage) {
        setPackages((prev) =>
          prev.map((p) =>
            p.id === editPackage.id ? { ...p, ...form, image: imageToUse } : p
          )
        );
        toast.success("Package updated!");
      } else {
        setPackages((prev) => [
          ...prev,
          { id: Date.now(), ...form, image: imageToUse },
        ]);
        toast.success("Package added!");
      }
      setModalOpen(false);
      setLoading(false);
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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="beach">Beach</SelectItem>
                <SelectItem value="mountain">Mountain</SelectItem>
                <SelectItem value="heritage">Heritage</SelectItem>
              </SelectContent>
            </Select>
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
                  <Image src={pkg.image} alt={pkg.title} fill className="object-cover" />
                ) : (
                  <ImageIcon className="w-16 h-16 text-gray-300" />
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-main)' }}>{pkg.title}</div>
                  <div className="text-xs text-gray-500 mb-2">{pkg.type}</div>
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
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
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
            <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beach">Beach</SelectItem>
                <SelectItem value="Mountain">Mountain</SelectItem>
                <SelectItem value="Heritage">Heritage</SelectItem>
              </SelectContent>
            </Select>
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
      <Dialog open={!!deletePackage} onOpenChange={(open) => !open && setDeletePackage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete <span className="font-semibold text-[#e63946]">{deletePackage?.title}</span>? This action cannot be undone.</div>
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