"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotels, selectHotels, selectError, selectLoading, updateHotel, deleteHotel as deleteHotelAction, addHotel, Hotel } from "@/lib/redux/features/hotelSlice";
import { fetchLocations, selectLocations} from "@/lib/redux/features/locationSlice";
import { AppDispatch } from "@/lib/redux/store";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";


export default function HotelsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const hotels = useSelector(selectHotels);
  const locations = useSelector(selectLocations);
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editHotel, setEditHotel] = useState<Hotel | null>(null);
  const [form, setForm] = useState({ name: "", location: "", address: "", description: "", image: "", featured: false });
  const [deleteHotel, setDeleteHotel] = useState<Hotel | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchHotels());
    dispatch(fetchLocations());
  }, [dispatch]);

  // Filtered hotels
  const filteredHotels = useMemo(
    () =>
      hotels.filter(
        (h) =>
          (typeFilter === "all" || h.location.toLowerCase() === typeFilter) &&
          (h.name.toLowerCase().includes(search.toLowerCase()) ||
            h.location.toLowerCase().includes(search.toLowerCase()) ||
            h.address.toLowerCase().includes(search.toLowerCase()))
      ),
    [hotels, search, typeFilter]
  );

  // Handlers
  const openAddModal = () => {
    setEditHotel(null);
    setForm({ name: "", location: "", address: "", description: "", image: "", featured: false });
    setImageFiles([]);
    setImagePreviews([]);
    setModalOpen(true);
  };

  const openEditModal = (hotel: Hotel) => {
    setEditHotel(hotel);
    setForm({ ...hotel, featured: hotel.featured || false });
    setImageFiles([]);
    setImagePreviews(
      Array.isArray(hotel.image)
        ? hotel.image.filter(Boolean)
        : hotel.image ? [hotel.image] : []
    );
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteHotel) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteHotelAction(deleteHotel.id));
      setDeleteHotel(null);
      toast.success("Hotel deleted!");
    } catch (error) {
      toast.error("Failed to delete hotel");
    } finally {
      setIsDeleting(false);
      dispatch(fetchHotels());
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Only add up to 5 images total
    const newFiles = files.slice(0, 5 - imageFiles.length);
    setImageFiles(prev => [...prev, ...newFiles].slice(0, 5));
    setImagePreviews(prev => [
      ...prev,
      ...newFiles.map(file => URL.createObjectURL(file))
    ].slice(0, 5));
    // Optionally reset the input value so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (idx: number) => {
    setImageFiles(files => files.filter((_, i) => i !== idx));
    setImagePreviews(previews => previews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("location", form.location);
    formData.append("address", form.address);
    formData.append("featured", form.featured.toString());

    // Add existing image URLs that are still in previews (for edit)
    if (editHotel) {
      imagePreviews
        .filter(src => !imageFiles.some(file => URL.createObjectURL(file) === src))
        .forEach(url => formData.append("existingImages", url));
    }
    // Add new files
    imageFiles.forEach(file => formData.append("image", file));
    try {
      if (editHotel) {
        await dispatch(updateHotel(formData, editHotel.id));
        toast.success("Hotel updated!");
      } else {
        await dispatch(addHotel(formData));
        toast.success("Hotel added!");
      }
      setModalOpen(false);
      setImageFiles([]);
      setImagePreviews([]);
    } catch (error) {
      toast.error(editHotel ? "Failed to update hotel" : "Failed to add hotel");
    } finally {
      setIsEditing(false);
      dispatch(fetchHotels());
    }
  };

  if (error) {
    return (
      <div className="mx-auto p-0 flex flex-col gap-8">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Hotels</h2>
        <p>Error loading hotels. Please try again later.</p>
      </div>
    )
  }
  return (
    <div className="mx-auto p-0 flex flex-col gap-8">
      {/* Hotel List Heading and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-1 flex-wrap">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Hotels</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center justify-end">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Input
                placeholder="Search hotels..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <Button onClick={openAddModal} className="gap-2 w-full sm:w-auto cursor-pointer">
            <Plus className="w-4 h-4" /> Add Hotel
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
        {filteredHotels.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12">No hotels found.</div>
        ) : (
          filteredHotels.map((hotel) => {
            // Always use the first valid image
            const validImages = Array.isArray(hotel.image)
              ? hotel.image.filter(Boolean)
              : hotel.image ? [hotel.image] : [];
            return (
              <div key={hotel.id} className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden">
                <div className="flex items-center justify-center h-48 bg-gray-100">
                  {validImages.length > 0 ? (
                    <img src={validImages[0]} alt={hotel.name} className="w-full h-48 object-cover rounded-lg" />
                  ) : (
                    <MapPin className="w-12 h-12 text-[#457b9d]" />
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-main)' }}>{hotel.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{locations.find(l => l.uid === hotel.location)?.name}</div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(hotel)}
                      aria-label="Edit"
                      className="cursor-pointer"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteHotel(hotel)}
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
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editHotel ? "Edit Hotel" : "Add Hotel"}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium">Name</label>
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium">Description</label>
              <Textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                />
              </div>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium">Address</label>
              <Textarea
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium">Featured</label>
                <Switch
                  checked={form.featured}
                  onCheckedChange={(checked) => setForm((f) => ({ ...f, featured: checked }))}
                />
              </div>
              <Select value={form.location} onValueChange={(v) => setForm((f) => ({ ...f, location: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Hotel Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.uid} value={location.uid}>{location.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium">Images (max 5)</label>
                {imagePreviews.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-2">
                    {imagePreviews.filter(Boolean).map((src, idx) => (
                      <div key={idx} className="relative group w-24 h-24 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                        <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs opacity-80 group-hover:opacity-100"
                          onClick={() => handleRemoveImage(idx)}
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e63946]/10 file:text-[#e63946] cursor-pointer"
                  disabled={imagePreviews.length >= 5}
                />
                {imagePreviews.length >= 5 && (
                  <span className="text-xs text-red-500">Maximum 5 images allowed.</span>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isEditing} className="gap-2 cursor-pointer">
                  {isEditing && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editHotel ? "Update" : "Add"}
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
      <Dialog open={!!(deleteHotel && deleteHotel.id)} onOpenChange={(open) => !open && setDeleteHotel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Hotel</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete <span className="font-semibold text-[#e63946]">{deleteHotel?.name}</span>? This action cannot be undone.</div>
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
