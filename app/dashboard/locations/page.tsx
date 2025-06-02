"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations, selectLocations, selectError, selectLoading, updateLocation, deleteLocation as deleteLocationAction, addLocation, Location} from "@/lib/redux/features/locationSlice";
import { AppDispatch } from "@/lib/redux/store";

export default function LocationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const locations = useSelector(selectLocations);
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);
  
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editLocation, setEditLocation] = useState<Location | null>(null);
  const [form, setForm] = useState({ name: "", description: "", type: "Beach", image: "" });
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteLocation, setDeleteLocation] = useState<Location | null>(null);
  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  // Filtered locations
  const filteredLocations = useMemo(
    () =>
      locations.filter(
        (l) =>
          (typeFilter === "all" || l.type.toLowerCase() === typeFilter) &&
          (l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.type.toLowerCase().includes(search.toLowerCase()) ||
            l.description.toLowerCase().includes(search.toLowerCase()))
      ),
    [locations, search, typeFilter]
  );

  // Handlers
  const openAddModal = () => {
    setEditLocation(null);
    setForm({ name: "", description: "", type: "Beach", image: "" });
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEditModal = (location: Location) => {
    setEditLocation(location);
    setForm({ ...location });
    setImageFile(null);
    setImagePreview(location.image || null);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!locationToDelete) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteLocationAction(locationToDelete.id));
      setLocationToDelete(null);
      toast.success("Location deleted!");
    } catch (error) {
      toast.error("Failed to delete location");
    } finally {
      setIsDeleting(false);
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
    formData.append("type", form.type);
    if (imageFile) {
      formData.append("image", imageFile);  
    }
    
    try {
      if (editLocation) {
        await dispatch(updateLocation(formData, editLocation.id));
        toast.success("Location updated!");
      } else {
        await dispatch(addLocation(formData));
        toast.success("Location added!");
      }
      setModalOpen(false);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      toast.error(editLocation ? "Failed to update location" : "Failed to add location");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="mx-auto p-0 flex flex-col gap-8">
      {/* Location List Heading and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-1 flex-wrap">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Locations</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center justify-end">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Input
                placeholder="Search locations..."
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
                <SelectItem value="Domestic">Domestic</SelectItem>
                <SelectItem value="International">International</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openAddModal} className="gap-2 w-full sm:w-auto cursor-pointer">
            <Plus className="w-4 h-4" /> Add Location
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredLocations.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12">No locations found.</div>
        ) : (
          filteredLocations.map((location) => (
            <div key={location.id} className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden">
              <div className="flex items-center justify-center h-32 bg-gray-100">
                {location.image ? (
                  <img src={location.image} alt={location.name} className="w-full h-32 object-cover rounded-lg" />
                ) : (
                  <MapPin className="w-12 h-12 text-[#457b9d]" />
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-main)' }}>{location.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{location.type}</div>
                  <div className="text-sm text-gray-700 mb-2 line-clamp-2">{location.description}</div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditModal(location)}
                    aria-label="Edit"
                    className="cursor-pointer"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setLocationToDelete(location)}
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
              <DialogTitle>{editLocation ? "Edit Location" : "Add Location"}</DialogTitle>
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
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e63946]/10 file:text-[#e63946] cursor-pointer"
              />
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
