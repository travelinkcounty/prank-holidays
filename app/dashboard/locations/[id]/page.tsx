"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocationById, selectSelectedLocation, Location} from "@/lib/redux/features/locationSlice";
import { AppDispatch } from "@/lib/redux/store";
import { Switch } from "@/components/ui/switch";
import { fetchSubLocationById, selectSubLocations, selectSubError, selectSubLoading, deleteSubLocation, updateSubLocation, addSubLocation, fetchSubLocations, fetchFeaturedSubLocations} from "@/lib/redux/features/subLocationSlice";
import { useParams } from "next/navigation";

export default function LocationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useSelector(selectSelectedLocation);
  const subLocations = useSelector(selectSubLocations);
  const subError = useSelector(selectSubError);
  const subLoading = useSelector(selectSubLoading);

  const { id } = useParams();

  const locationId = id as string;

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editLocation, setEditLocation] = useState<Location | null>(null);
  const [form, setForm] = useState({ name: "", type: "domestic", image: "", featured: false });
  const [deleteLocation, setDeleteLocation] = useState<Location | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (locationId) {
      dispatch(fetchLocationById(locationId));
    }
  }, [dispatch, locationId]);

  useEffect(() => {
    if (location?.uid) {
      dispatch(fetchFeaturedSubLocations(location.uid));
    }
  }, [dispatch, location]);

  // Filtered locations
  const filteredLocations = useMemo(
    () =>
      subLocations.filter(
        (l) =>
          (typeFilter === "all" || l.type.toLowerCase() === typeFilter) &&
          (l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.type.toLowerCase().includes(search.toLowerCase()))
      ),
    [subLocations, search, typeFilter]
  );

  // Handlers
  const openAddModal = () => {
    setEditLocation(null);
    setForm({ name: "", type: "domestic", image: "", featured: false });
    setImageFiles([]);
    setImagePreviews([]);
    setModalOpen(true);
  };

  const openEditModal = (location: Location) => {
    setEditLocation(location);
    setForm({ ...location, featured: location.featured || false });
    setImageFiles([]);
    setImagePreviews(
      Array.isArray(location.image)
        ? location.image.filter(Boolean)
        : location.image ? [location.image] : []
    );
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteLocation) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteSubLocation(deleteLocation.id));
      setDeleteLocation(null);
      toast.success("Location deleted!");
    } catch (error) {
      toast.error("Failed to delete location");
    } finally {
      setIsDeleting(false);
      if (location?.uid) {
        dispatch(fetchFeaturedSubLocations(location.uid));
      }
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
    formData.append("featured", form.featured.toString());
    formData.append("type", location?.type || "");
    formData.append("locationId", location?.uid || "");
    // Add existing image URLs that are still in previews (for edit)
    if (editLocation) {
      imagePreviews
        .filter(src => !imageFiles.some(file => URL.createObjectURL(file) === src))
        .forEach(url => formData.append("existingImages", url));
    }
    // Add new files
    imageFiles.forEach(file => formData.append("image", file));
    try {
      if (editLocation) {
        await dispatch(updateSubLocation(formData, editLocation.id));
        toast.success("Location updated!");
      } else {
        await dispatch(addSubLocation(formData));
        toast.success("Location added!");
      }
      setModalOpen(false);
      setImageFiles([]);
      setImagePreviews([]);
    } catch (error) {
      toast.error(editLocation ? "Failed to update location" : "Failed to add location");
    } finally {
      setIsEditing(false);
      if (location?.uid) {
        dispatch(fetchFeaturedSubLocations(location.uid));
      }
    }
  };

  if (subError) {
    return (
      <div className="mx-auto p-0 flex flex-col gap-8">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Locations</h2>
        <p>Error loading locations. Please try again later.</p>
      </div>
    )
  }
  return (
    <div className="mx-auto p-0 flex flex-col gap-8">
      {/* Location List Heading and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-1 flex-wrap">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Sub Locations</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center justify-end">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Input
                placeholder="Search sub locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <Button onClick={openAddModal} className="gap-2 w-full sm:w-auto cursor-pointer" disabled={!location}>
            <Plus className="w-4 h-4" /> New Location
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {subLoading && (
          <div className="col-span-full text-center text-gray-400 py-12">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        )}
        {filteredLocations.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12">No locations found.</div>
        ) : (
          filteredLocations.map((location) => {
            // Always use the first valid image
            const validImages = Array.isArray(location.image)
              ? location.image.filter(Boolean)
              : location.image ? [location.image] : [];
            return (
              <div key={location.id} className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden">
                <div className="flex items-center justify-center h-48 bg-gray-100">
                  {validImages.length > 0 ? (
                    <img src={validImages[0]} alt={location.name} className="w-full h-48 object-cover rounded-lg" />
                  ) : (
                    <MapPin className="w-12 h-12 text-[#457b9d]" />
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-main)' }}>{location.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{location.type}</div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(location)}
                      aria-label="Edit"
                      className="cursor-pointer"
                      disabled={!location}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteLocation(location)}
                      aria-label="Delete"
                      disabled={subLoading}
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
          { !location ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="w-8 h-8 animate-spin text-[#e63946]" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>{editLocation ? "Edit Location" : "Add Location"}</DialogTitle>
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
                <label className="block text-sm font-medium">Featured</label>
                <Switch
                  checked={form.featured}
                  onCheckedChange={(checked) => setForm((f) => ({ ...f, featured: checked }))}
                />
              </div>
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
                  {editLocation ? "Update" : "Add"}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!(deleteLocation && deleteLocation.id)} onOpenChange={(open) => !open && setDeleteLocation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Location</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete <span className="font-semibold text-[#e63946]">{deleteLocation?.name}</span>? This action cannot be undone.</div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={subLoading}
              className="gap-2 cursor-pointer"
            >
              {subLoading && <Loader2 className="w-4 h-4 animate-spin" />} Delete
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={subLoading}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}   
