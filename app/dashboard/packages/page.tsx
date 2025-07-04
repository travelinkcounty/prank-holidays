"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { fetchPackages, selectPackages, selectError, selectLoading, updatePackage, deletePackage as deletePackageAction, addPackage, Package, setPackages} from "@/lib/redux/features/packageSlice";
import { AppDispatch } from "@/lib/redux/store";
import { selectLocations, fetchLocations } from "@/lib/redux/features/locationSlice";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import Image from "next/image";

export default function PackagesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const packages = useSelector(selectPackages);
  const locations = useSelector(selectLocations);
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editPackage, setEditPackage] = useState<Package | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", image: "", nights: "", days: "", locationId: "" });
  const [deletePackage, setDeletePackage] = useState<Package | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchPackages());
    dispatch(fetchLocations());
  }, [dispatch]);

  // Filtered packages
  const filteredPackages = useMemo(
    () =>
      (Array.isArray(packages) ? packages : []).filter(
        (p) =>
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase()) ||
          locations.find((l) => l.id === p.locationId)?.name?.toLowerCase().includes(search.toLowerCase())
      ),
    [packages, search, locations]
  );

  // Handlers
  const openAddModal = () => {
    setEditPackage(null);
    setForm({ name: "", description: "", price: "", image: "", nights: "", days: "", locationId: "" });
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEditModal = (pkg: Package) => {
    setEditPackage(pkg);
    setForm({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      image: pkg.image,
      days: pkg.days,
      nights: pkg.nights,
      locationId: pkg.locationId
    });
    setImageFile(null);
    setImagePreview(pkg.image || null);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletePackage) return;
    setIsDeleting(true);
    try {
      await dispatch(deletePackageAction(deletePackage.id));
      setDeletePackage(null);
      toast.success("Package deleted!");
    } catch (error) {
      toast.error("Failed to delete package");
    } finally {
      setIsDeleting(false);
      dispatch(fetchPackages());
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("days", form.days);
    formData.append("nights", form.nights);
    formData.append("locationId", form.locationId);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    try {
      if (editPackage) {
        await dispatch(updatePackage(formData, editPackage.id));
        toast.success("Package updated!");
      } else {
        await dispatch(addPackage(formData));
        toast.success("Package added!");
      }
      setModalOpen(false);
      setEditPackage(null);
      setForm({ name: "", description: "", price: "", image: "", nights: "", days: "", locationId: "" });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      toast.error(editPackage ? "Failed to update package" : "Failed to add package");
    } finally {
      setIsEditing(false);
      dispatch(fetchPackages());
    }
  };

  if (error) {
    return (
      <div className="mx-auto p-0 flex flex-col gap-8">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Packages</h2>
        <p>Error loading packages. Please try again later.</p>
      </div>
    )
  }
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
        {loading && (
          <div className="col-span-full text-center text-gray-400 py-12">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        )}
        {filteredPackages.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12">No packages found.</div>
        ) : (
          filteredPackages.map((pkg) => {
            const locationObj = locations.find((l) => l.id === pkg.locationId);
            return (
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
                    <div className="flex gap-2 mb-2">
                      <span className="inline-block bg-[#ffc72c] text-[#1a4d8f] px-2 py-1 rounded text-xs font-bold">{pkg.days} Days</span>
                      <span className="inline-block bg-[#1a4d8f] text-white px-2 py-1 rounded text-xs font-bold">{pkg.nights} Nights</span>
                    </div>
                    <div className="text-xs text-gray-500 font-semibold mb-1">Location: {locationObj ? locationObj.name : pkg.locationId}</div>
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
                      disabled={isDeleting}
                      className="text-destructive cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editPackage ? "Edit Package" : "Add Package"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col col-span-1 md:col-span-2">
              <label className="block mb-1 font-semibold text-[#1a4d8f]">Name</label>
              <Input
                placeholder="Name"
                value={form.name || ""}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col col-span-1 md:col-span-2">
              <label className="block mb-1 font-semibold text-[#1a4d8f]">Description</label>
              <Textarea
                placeholder="Description"
                value={form.description || ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                rows={4}
              />
            </div>
            <div className="flex flex-col col-span-1">
              <label className="block mb-1 font-semibold text-[#1a4d8f]">Price</label>
              <Input
                placeholder="Price"
                type="text"
                value={form.price || ""}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col col-span-1">
              <label className="block mb-1 font-semibold text-[#1a4d8f]">Days (e.g. 3D)</label>
              <Input
                placeholder="Days in Format: 3D"
                value={form.days || ""}
                onChange={(e) => setForm((f) => ({ ...f, days: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col col-span-1">
              <label className="block mb-1 font-semibold text-[#1a4d8f]">Nights (e.g. 3N)</label>
              <Input
                placeholder="Nights in Format: 3N"
                value={form.nights || ""}
                onChange={(e) => setForm((f) => ({ ...f, nights: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col col-span-1">
              <label className="block mb-1 font-semibold text-[#1a4d8f]">Location</label>
              <Select
                value={form.locationId}
                onValueChange={(value) => setForm((f) => ({ ...f, locationId: value }))}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
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
            <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
              <Button type="submit" disabled={isEditing} className="gap-2 cursor-pointer">
                {isEditing && <Loader2 className="w-4 h-4 animate-spin" />}
                {editPackage ? "Update" : "Add"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
            </div>
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
              disabled={isDeleting}
              className="gap-2 cursor-pointer"
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