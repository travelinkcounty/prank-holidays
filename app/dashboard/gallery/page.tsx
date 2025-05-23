"use client";

import React, { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

// Mock image type and data
type GalleryImage = {
  id: number;
  title: string;
  url: string;
  category: string;
};

const initialImages: GalleryImage[] = [
  { id: 1, title: "Goa Beach Sunset", url: "/mock/goa.jpg", category: "Beach" },
  { id: 2, title: "Manali Snow", url: "/mock/manali.jpg", category: "Mountain" },
  { id: 3, title: "Jaipur Palace", url: "/mock/jaipur.jpg", category: "Heritage" },
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editImage, setEditImage] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState({ title: "", url: "", category: "Beach" });
  const [deleteImage, setDeleteImage] = useState<GalleryImage | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered images
  const filteredImages = useMemo(
    () =>
      images.filter(
        (img) =>
          (categoryFilter === "all" || img.category.toLowerCase() === categoryFilter) &&
          (img.title.toLowerCase().includes(search.toLowerCase()) ||
            img.category.toLowerCase().includes(search.toLowerCase()))
      ),
    [images, search, categoryFilter]
  );

  // Handlers
  const openAddModal = () => {
    setEditImage(null);
    setForm({ title: "", url: "", category: "Beach" });
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEditModal = (img: GalleryImage) => {
    setEditImage(img);
    setForm({ title: img.title, url: img.url, category: img.category });
    setImageFile(null);
    setImagePreview(img.url || null);
    setModalOpen(true);
  };

  const handleDelete = () => {
    if (!deleteImage) return;
    setLoading(true);
    setTimeout(() => {
      setImages((prev) => prev.filter((img) => img.id !== deleteImage.id));
      setLoading(false);
      setDeleteImage(null);
      toast.success("Image deleted!");
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
      const urlToUse = imagePreview || form.url;
      if (editImage) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === editImage.id ? { ...img, ...form, url: urlToUse } : img
          )
        );
        toast.success("Image updated!");
      } else {
        setImages((prev) => [
          ...prev,
          { id: Date.now(), ...form, url: urlToUse },
        ]);
        toast.success("Image added!");
      }
      setModalOpen(false);
      setLoading(false);
      setImageFile(null);
      setImagePreview(null);
    }, 1000);
  };

  return (
    <div className="mx-auto p-0 flex flex-col gap-8">
      {/* Gallery Heading and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-1 flex-wrap">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Gallery</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center justify-end">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Input
                placeholder="Search images..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="beach">Beach</SelectItem>
                <SelectItem value="mountain">Mountain</SelectItem>
                <SelectItem value="heritage">Heritage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openAddModal} className="gap-2 w-full sm:w-auto cursor-pointer">
            <Plus className="w-4 h-4" /> Add Image
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredImages.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12">No images found.</div>
        ) : (
          filteredImages.map((img) => (
            <div key={img.id} className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden">
              <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                {img.url ? (
                  <Image src={img.url} alt={img.title} fill className="object-cover" />
                ) : (
                  <ImageIcon className="w-16 h-16 text-gray-300" />
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-main)' }}>{img.title}</div>
                  <div className="text-xs text-gray-500 mb-2">{img.category}</div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditModal(img)}
                    aria-label="Edit"
                    className="cursor-pointer"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteImage(img)}
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
              <DialogTitle>{editImage ? "Edit Image" : "Add Image"}</DialogTitle>
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
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
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
                {editImage ? "Update" : "Add"}
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
      <Dialog open={!!deleteImage} onOpenChange={(open) => !open && setDeleteImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete <span className="font-semibold text-[#e63946]">{deleteImage?.title}</span>? This action cannot be undone.</div>
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
