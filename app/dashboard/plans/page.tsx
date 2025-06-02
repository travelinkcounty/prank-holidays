"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search, FileText } from "lucide-react";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlans, selectPlans, selectError, selectLoading, updatePlan, deletePlan as deletePlanAction, addPlan, Plan} from "@/lib/redux/features/planSlice";
import { AppDispatch } from "@/lib/redux/store";

export default function PlansPage() {
  const dispatch = useDispatch<AppDispatch>();
  const plans = useSelector(selectPlans);
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: 0, image: "", locationId: "", features: [] as string[] });
  const [deletePlan, setDeletePlan] = useState<Plan | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  // Filtered plans
  const filteredPlans = useMemo(
    () =>
      (Array.isArray(plans) ? plans : []).filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      ),
    [plans, search]
  );

  // Handlers
  const openAddModal = () => {
    setEditPlan(null);
    setForm({ name: "", description: "", price: 0, image: "", locationId: "", features: [] });
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEditModal = (plan: Plan) => {
    setEditPlan(plan);
    setForm({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      image: plan.image || "",
      locationId: plan.locationId,
      features: plan.features || []
    });
    setImageFile(null);
    setImagePreview(plan.image || null);
    setModalOpen(true);
  };

  const handleDelete = () => {
    if (!deletePlan) return;
    setIsDeleting(true);
    setTimeout(() => {
      dispatch(deletePlanAction(deletePlan.id || ""));
      setIsDeleting(false);
      setDeletePlan(null);
      toast.success("Plan deleted!");
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
    setIsEditing(true);
    setTimeout(() => {
      const imageToUse = imagePreview || form.image || "";
      const planData: Plan = {
        name: form.name,
        description: form.description,
        price: form.price,
        image: imageToUse,
        locationId: form.locationId,
        features: form.features || [],
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString()
      };
      if (editPlan) {
        dispatch(updatePlan(planData, editPlan.id || ""));
        toast.success("Plan updated!");
      } else {
        dispatch(addPlan(planData));
        toast.success("Plan added!");
      }
      setModalOpen(false);
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
    }, 1000);
  };

  return (
    <div className="mx-auto p-0 flex flex-col gap-8">
      {/* Plan List Heading and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-1 flex-wrap">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Plans</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center justify-end">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Input
                placeholder="Search plans..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <Button onClick={openAddModal} className="gap-2 w-full sm:w-auto cursor-pointer">
            <Plus className="w-4 h-4" /> Add Plan
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredPlans.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12">No plans found.</div>
        ) : (
          loading ? <Loader2 className="w-4 h-4 animate-spin" /> :
          filteredPlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden">
              <div className="flex items-center justify-center h-32 bg-gray-100">
                {plan.image ? (
                  <img src={plan.image} alt={plan.name} className="w-full h-32 object-cover rounded-lg" />
                ) : (
                  <FileText className="w-12 h-12 text-[#e63946]" />
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-main)' }}>{plan.name}</div>
                  <div className="text-sm text-gray-700 mb-2 line-clamp-2">{plan.description}</div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditModal(plan)}
                    aria-label="Edit"
                    className="cursor-pointer"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeletePlan(plan)}
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
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editPlan ? "Edit Plan" : "Add Plan"}</DialogTitle>
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
              <Button type="submit" disabled={isEditing} className="gap-2 cursor-pointer">
                {isEditing && <Loader2 className="w-4 h-4 animate-spin" />}
                {editPlan ? "Update" : "Add"}
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
      <Dialog open={!!deletePlan} onOpenChange={(open) => !open && setDeletePlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Plan</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete <span className="font-semibold text-[#e63946]">{deletePlan?.name}</span>? This action cannot be undone.</div>
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