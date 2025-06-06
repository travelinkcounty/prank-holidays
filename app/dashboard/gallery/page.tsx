"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { fetchGallery, selectGallery, selectError, selectIsLoading, GalleryItem, deleteGallery, addGallery, updateGallery } from "@/lib/redux/features/gallerySlice";
import { AppDispatch } from "@/lib/redux/store";


export default function GalleryPage() {

  const dispatch = useDispatch<AppDispatch>();
  const galleryImages = useSelector(selectGallery);
  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editImage, setEditImage] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState({ title: "", image: "" });
  const [deleteImage, setDeleteImage] = useState<GalleryItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  // Filtered images
  const filteredImages = useMemo(
    () =>
      (Array.isArray(galleryImages) ? galleryImages : []).filter(
        (img) =>
          img.title.toLowerCase().includes(search.toLowerCase())
      ),
    [galleryImages, search]
  );

  // Handlers
  const openAddModal = () => {
    setEditImage(null);
    setForm({ title: "", image: "" });
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEditModal = (img: GalleryItem) => {
    setEditImage(img);
    setForm({ title: img.title, image: img.image });
    setImageFile(null);
    setImagePreview(img.image || null);
    setModalOpen(true);
  };

  const handleDelete = () => {
    if (!deleteImage) return;
    setLoading(true);
    setTimeout(async () => {
      await dispatch(deleteGallery(deleteImage.id));
      await dispatch(fetchGallery());
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
    setTimeout(async () => {
      const formData = new FormData();
      formData.append("title", form.title);
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (editImage && editImage.image) {
        formData.append("image", editImage.image);
      }
      formData.append("createdOn", new Date().toISOString());
      formData.append("updatedOn", new Date().toISOString());
      if (editImage) {
        await dispatch(updateGallery(formData, editImage.id));
        await dispatch(fetchGallery());
        toast.success("Image updated!");
      } else {
        await dispatch(addGallery(formData));
        await dispatch(fetchGallery());
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
                {img.image ? (
                  <Image src={img.image} alt={img.title} fill className="object-cover" />
                ) : (
                  <ImageIcon className="w-16 h-16 text-gray-300" />
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-main)' }}>{img.title}</div>
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
              {(imagePreview || form.image) ? (
                <img
                  src={imagePreview || form.image}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg mb-2 border"
                />
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
