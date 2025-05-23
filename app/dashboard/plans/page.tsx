"use client";

import React, { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search, FileText } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock plan type and data
type Plan = {
  id: number;
  name: string;
  description: string;
  type: string;
  image?: string;
};

const initialPlans: Plan[] = [
  { id: 1, name: "Silver Plan", description: "Basic travel plan for budget trips.", type: "Basic", image: "" },
  { id: 2, name: "Gold Plan", description: "Premium plan with extra perks.", type: "Premium", image: "" },
  { id: 3, name: "Family Plan", description: "Special plan for families.", type: "Family", image: "" },
];

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState({ name: "", description: "", type: "Basic", image: "" });
  const [deletePlan, setDeletePlan] = useState<Plan | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered plans
  const filteredPlans = useMemo(
    () =>
      plans.filter(
        (p) =>
          (typeFilter === "all" || p.type.toLowerCase() === typeFilter) &&
          (p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.type.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase()))
      ),
    [plans, search, typeFilter]
  );

  // Handlers
  const openAddModal = () => {
    setEditPlan(null);
    setForm({ name: "", description: "", type: "Basic", image: "" });
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEditModal = (plan: Plan) => {
    setEditPlan(plan);
    setForm({ name: plan.name, description: plan.description, type: plan.type, image: plan.image || "" });
    setImageFile(null);
    setImagePreview(plan.image || null);
    setModalOpen(true);
  };

  const handleDelete = () => {
    if (!deletePlan) return;
    setLoading(true);
    setTimeout(() => {
      setPlans((prev) => prev.filter((p) => p.id !== deletePlan.id));
      setLoading(false);
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
    setLoading(true);
    setTimeout(() => {
      const imageToUse = imagePreview || form.image || "";
      if (editPlan) {
        setPlans((prev) =>
          prev.map((p) =>
            p.id === editPlan.id ? { ...p, ...form, image: imageToUse } : p
          )
        );
        toast.success("Plan updated!");
      } else {
        setPlans((prev) => [
          ...prev,
          { id: Date.now(), ...form, image: imageToUse },
        ]);
        toast.success("Plan added!");
      }
      setModalOpen(false);
      setLoading(false);
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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
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
                  <div className="text-xs text-gray-500 mb-2">{plan.type}</div>
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
            <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Family">Family</SelectItem>
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
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e63946]/10 file:text-[#e63946]"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading} className="gap-2 cursor-pointer">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
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