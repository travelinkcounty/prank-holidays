'use client'

import React, { useState, useEffect } from "react";
import { User, Users, BadgeCheck, Edit, LogOut, History as HistoryIcon, Link, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { fetchPlans, selectPlans } from "@/lib/redux/features/planSlice";
import { fetchPackages, selectPackages } from "@/lib/redux/features/packageSlice";
import { fetchLocations, selectLocations } from "@/lib/redux/features/locationSlice";
import { fetchHistoryByUserId, selectHistories } from "@/lib/redux/features/historySlice";
import { fetchMembershipByUserId, selectMemberships } from "@/lib/redux/features/membershipSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/lib/redux/features/authSlice";
import { fetchUserById, selectUser } from "@/lib/redux/features/authSlice";

const navLinks = [
    { label: "Profile", icon: <User className="w-5 h-5 mr-2" />, key: "profile" },
    { label: "Membership", icon: <BadgeCheck className="w-5 h-5 mr-2" />, key: "membership" },
    { label: "History", icon: <HistoryIcon className="w-5 h-5 mr-2" />, key: "history" },
    { label: "Logout", icon: <LogOut className="w-5 h-5 mr-2" />, key: "logout", danger: true },
];

const Profile = () => {
    const dispatch = useDispatch<AppDispatch>();
    const history = useSelector(selectHistories);
    const membership = useSelector(selectMemberships);
    const plans = useSelector(selectPlans);
    const packages = useSelector(selectPackages);
    const location = useSelector(selectLocations);
    const userData = useSelector(selectUser);
    const [active, setActive] = useState("profile");
    const router = useRouter();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
      name: "",
      address: "",
      phone: "",
      password: "",
      gender: "",
      nationality: "",
      dob: "",
      maritalStatus: ""
    });
    const [editLoading, setEditLoading] = useState(false);
    const [showMobileNav, setShowMobileNav] = useState(true);
    const [expandedMembershipIdx, setExpandedMembershipIdx] = useState<number | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("user");
            if (stored) {
                dispatch(fetchUserById(JSON.parse(stored).uid));
            }
        }
    }, []);

    useEffect(() => {
        const userId = userData?.uid;
        if (userId) {
            dispatch(fetchHistoryByUserId(userId));
            dispatch(fetchMembershipByUserId(userId));
        }
    }, [dispatch, userData?.uid]);

    useEffect(() => {
        dispatch(fetchLocations());
        dispatch(fetchPlans());
        dispatch(fetchPackages());
    }, [dispatch]);

    function formatFirestoreTimestamp(ts: any) {
        if (!ts) return '';
        if (ts instanceof Date) return ts.toLocaleString();
        if (typeof ts === 'object' && '_seconds' in ts) {
          return new Date(ts._seconds * 1000).toLocaleString();
        }
        if (typeof ts === 'string') return new Date(ts).toLocaleString();
        return '';
      }


    const getPlanName = (plan_ref: any) => {
        // If plan_ref is an object with _path.segments, get the plan ID from segments
        if (plan_ref && typeof plan_ref === 'object' && plan_ref._path?.segments) {
            const planId = plan_ref._path.segments[plan_ref._path.segments.length - 1];
            const plan = plans?.find((plan: any) => plan.uid === planId);
            return plan?.name || "Unknown Plan";
        }
        // If plan_ref is a string, use it directly
        const plan = plans?.find((plan: any) => plan.id === plan_ref);
        return plan?.name || "Unknown Plan";
    }

    const getPackageName = (package_ref: any) => {
        // If package_ref is an object with _path.segments, get the package ID from segments
        if (package_ref && typeof package_ref === 'object' && package_ref._path?.segments) {
            const packageId = package_ref._path.segments[package_ref._path.segments.length - 1];
            const pkg = packages?.find((pkg: any) => pkg.uid === packageId);
            return pkg?.name || "Unknown Package";
        }
        // If package_ref is a string, use it directly
        const pkg = packages?.find((pkg: any) => pkg.uid === package_ref);
        return pkg?.name || "Unknown Package";
    }

    const openEditModal = () => {
      setEditForm({
        name: userData?.name || "",
        address: userData?.address || "",
        phone: userData?.phone || "",
        password: "",
        gender: userData?.gender || "",
        nationality: userData?.nationality || "",
        dob: userData?.dob || "",
        maritalStatus: userData?.maritalStatus || ""
      });
      setEditModalOpen(true);
    };

    // Add back button handler
    const handleBack = () => {
        setShowMobileNav(true);
        setActive("profile");
    };

    // Section renderers
    const renderSection = () => {
        if (active === "profile") {
            return (
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-[#ffe066]/40 w-full max-w-4xl md:ml-0 flex flex-col gap-6">
                    <div className="flex items-start justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div
                                className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#ffe066] shadow-md bg-gray-100 flex items-center justify-center"
                            >
                                <span className="text-2xl font-semibold text-black">
                                    {userData?.name?.[0]?.toLowerCase() || "?"}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-[#e30613]">{userData?.name}</span>
                                <span className="text-gray-600 text-base">{userData?.email}</span>
                            </div>
                        </div>
                        <button className="p-2 rounded-full hover:bg-gray-100" onClick={openEditModal}><Edit className="w-5 h-5 text-gray-400" /></button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-gray-600 text-base">
                            <Users className="w-5 h-5" />{userData?.tlcId}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-base">
                            <span className="font-bold">Phone:</span> {userData?.phone}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-base">
                            <span className="font-bold">Address:</span> {userData?.address}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-base">
                            <span className="font-bold">Gender:</span> {userData?.gender || "N/A"}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-base">
                            <span className="font-bold">Nationality:</span> {userData?.nationality || "N/A"}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-base">
                            <span className="font-bold">Date of Birth:</span> {userData?.dob || "N/A"}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-base">
                            <span className="font-bold">Marital Status:</span> {userData?.maritalStatus || "N/A"}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-base">
                            <span className="font-bold">Status:</span> {userData?.status}
                        </div>
                    </div>
                </div>
            );
        }
        if (active === "membership") {
            return (
                <div className="bg-white rounded-2xl shadow p-8 md:p-10 border border-[#ffe066]/30 w-full max-w-4xl md:ml-0 flex flex-col gap-6">
                    <div className="flex items-center flex-col md:flex-row justify-between mb-2">
                        <h3 className="text-2xl font-bold text-[#e30613] flex items-center gap-2"><BadgeCheck className="w-6 h-6 text-[#ffe066]" /> Membership Details</h3>
                        {membership.length === 0 ? null : (
                          <button className="px-6 py-1 mt-6 md:mt-0 bg-gradient-to-r from-[#ffe066] to-[#ffd700] text-[#e30613] font-bold rounded-full shadow-lg hover:from-[#e30613] hover:to-[#cc0000] hover:text-white transition-all duration-300 text-xl w-fit transform hover:scale-105">
                              Renew Membership
                          </button>
                        )}
                    </div>
                    {membership.length === 0 ? (
                      <div className="text-gray-500 text-lg">No active membership found.</div>
                    ) : (
                      membership.map((item, idx) => {
                        // Calculate used/remaining from usage array
                        const usage = item.usage || [];
                        const sumUsage = usage.reduce((acc, u) => ({ days: acc.days + (u.days || 0), nights: acc.nights + (u.nights || 0) }), { days: 0, nights: 0 });
                        const remDays = Math.max(item.totalDays - sumUsage.days, 0);
                        const remNights = Math.max(item.totalNights - sumUsage.nights, 0);
                        const expanded = expandedMembershipIdx === idx;
                        return (
                          <div key={idx} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-[#ffe066]/20 hover:shadow-xl transition-all duration-300 mb-4">
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center gap-2 text-xl cursor-pointer" onClick={() => setExpandedMembershipIdx(expanded ? null : idx)}>
                                {expanded ? <ChevronDown className="w-5 h-5 text-[#e30613]" /> : <ChevronRight className="w-5 h-5 text-[#e30613]" />}
                                <span className="font-bold text-[#e30613]">Plan:</span>
                                <span className="text-[#23272b]">{getPlanName(item.plan_ref)}</span>
                                <span className="ml-4 text-xs text-[#1a4d8f]">(Click to {expanded ? 'hide' : 'view'} usage history)</span>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                  <div className="text-sm text-gray-500 mb-1">Total Days</div>
                                  <div className="text-xl font-bold text-[#23272b]">{item.totalDays}</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                  <div className="text-sm text-gray-500 mb-1">Used Days</div>
                                  <div className="text-xl font-bold text-[#23272b]">{sumUsage.days}</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                  <div className="text-sm text-gray-500 mb-1">Total Nights</div>
                                  <div className="text-xl font-bold text-[#23272b]">{item.totalNights}</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                  <div className="text-sm text-gray-500 mb-1">Used Nights</div>
                                  <div className="text-xl font-bold text-[#23272b]">{sumUsage.nights}</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm col-span-2">
                                  <div className="text-sm text-gray-500 mb-1">Remaining</div>
                                  <div className="text-lg font-bold text-[#2ecc71]">{remDays} Days, {remNights} Nights</div>
                                </div>
                              </div>
                              {expanded && (
                                <div className="mt-4 bg-[#f8f9fa] rounded-xl p-4">
                                  <div className="font-semibold mb-2">Usage History</div>
                                  {usage.length === 0 ? (
                                    <div className="text-gray-500">No usage entries yet.</div>
                                  ) : (
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr>
                                          <th className="text-left">Location</th>
                                          <th className="text-left">Date</th>
                                          <th className="text-center">Days</th>
                                          <th className="text-center">Nights</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {usage.map((u, uidx) => (
                                          <tr key={uidx}>
                                            <td>{u.location}</td>
                                            <td>{u.date}</td>
                                            <td className="text-center">{u.days}</td>
                                            <td className="text-center">{u.nights}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                </div>
            );
        }
        if (active === "history") {
            return (
                <div className="bg-white rounded-2xl shadow p-8 md:p-10 border border-[#ffe066]/30 w-full max-w-4xl md:ml-0 flex flex-col gap-6">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-2xl font-bold text-[#e30613] flex items-center gap-2"><HistoryIcon className="w-6 h-6 text-[#ffe066]" /> Membership History</h3>
                    </div>
                    {history.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-[#1a4d8f] text-lg">
                                        <th className="pr-8">Package</th>
                                        <th className="pr-8">Date</th>
                                        <th className="pr-8">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item, idx) => (
                                        <tr key={idx} className="bg-[#f8fafc] rounded-xl">
                                            <td className="font-bold text-[#e30613] pr-8 py-2">{getPackageName(item.package_ref)}</td>
                                            <td className="pr-8 py-2">{formatFirestoreTimestamp(item.createdOn)}</td>
                                            <td className="pr-8 py-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'inactive' ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'}`}>{item.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-gray-500 text-lg">No previous memberships found.</div>
                    )}
                </div>
            );
        }
        if (active === "logout") {
            // Navigate to /logout
            router.push("/logout");
        }
        return null;
    };

    return (
        <div className="min-h-screen max-w-7xl mx-auto py-0 md:py-10 px-0 md:px-6 flex flex-col md:flex-row" style={{ fontFamily: 'var(--font-main)' }}>
            {/* Mobile Profile Info - Only visible on mobile when showMobileNav is true */}
            <div className="md:hidden">
                {showMobileNav ? (
                    <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-b-3xl p-6">
                        <div className="flex flex-col items-center gap-4 w-full">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#ffe066] shadow-md bg-gray-100 flex items-center justify-center">
                                <span className="text-2xl font-semibold text-black">
                                    {userData?.name?.[0]?.toLowerCase() || "?"}
                                </span>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-[#e30613] leading-tight">{userData?.name}</div>
                                <div className="text-sm text-gray-500">{userData?.email}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.label}
                                        className={`flex items-center justify-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${link.danger ? 'bg-red-50 text-red-600' : 'bg-[#ffe066]/20 text-[#1a4d8f]'}`}
                                        onClick={() => {
                                            if (link.key === 'logout') {
                                                router.push('/logout');
                                            } else {
                                                setActive(link.key);
                                                setShowMobileNav(false);
                                            }
                                        }}
                                    >
                                        {link.icon}
                                        <span>{link.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-b-3xl p-4 mb-4">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-[#1a4d8f] font-semibold"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back
                        </button>
                    </div>
                )}
            </div>

            {/* Desktop Sidebar - Hidden on mobile */}
            <aside className="hidden md:flex w-72 bg-white/70 backdrop-blur-md shadow-xl rounded-3xl mr-4 flex-col items-center px-6 py-8 mb-0">
                <div className="flex flex-col items-center gap-6 w-full">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#ffe066] shadow-md bg-gray-100 flex items-center justify-center">
                        <span className="text-2xl font-semibold text-black">
                            {userData?.name?.[0]?.toLowerCase() || "?"}
                        </span>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-[#e30613] leading-tight">{userData?.name}</div>
                        <div className="text-sm text-gray-500">{userData?.email}</div>
                    </div>
                </div>
                <nav className="mt-8 w-full">
                    <ul className="flex flex-col gap-3 w-full">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <button
                                    className={`w-full cursor-pointer flex items-center px-4 py-2 rounded-xl font-semibold transition-colors duration-200 hover:bg-[#ffe066]/40 hover:text-[#e30613] ${link.danger ? 'text-red-600 hover:bg-red-50' : 'text-[#1a4d8f]'} ${active === link.key ? 'bg-[#ffe066]/60 text-[#e30613]' : ''}`}
                                    onClick={() => {
                                        if (link.key === 'logout') {
                                            router.push('/logout');
                                        } else {
                                            setActive(link.key);
                                        }
                                    }}
                                >
                                    {link.icon}{link.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content - Only show on mobile when showMobileNav is false */}
            <main className={`flex-1 flex flex-col items-stretch pb-10 w-full ${showMobileNav ? 'hidden md:flex' : 'flex'}`}>
                <div className="w-full">
                    {renderSection()}
                </div>
            </main>

            {/* Edit Profile Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
              <DialogContent>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setEditLoading(true);
                    if (!userData || !userData.uid) {
                      setEditLoading(false);
                      return;
                    }
                    const payload: any = {
                      uid: userData.uid,
                      name: editForm.name,
                      address: editForm.address,
                      phone: editForm.phone,
                      gender: editForm.gender,
                      nationality: editForm.nationality,
                      dob: editForm.dob,
                      maritalStatus: editForm.maritalStatus,
                    };
                    if (editForm.password) payload.password = editForm.password;
                    await dispatch(updateUser(payload));
                    setEditLoading(false);
                    setEditModalOpen(false);
                  }}
                  className="space-y-4"
                >
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input
                      value={editForm.name}
                      onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <Input
                      value={editForm.address}
                      onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <Input
                      value={editForm.phone}
                      onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={editForm.gender}
                      onChange={e => setEditForm(f => ({ ...f, gender: e.target.value }))}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nationality</label>
                    <Input
                      value={editForm.nationality}
                      onChange={e => setEditForm(f => ({ ...f, nationality: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date of Birth</label>
                    <Input
                      type="date"
                      value={editForm.dob}
                      onChange={e => setEditForm(f => ({ ...f, dob: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Marital Status</label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={editForm.maritalStatus}
                      onChange={e => setEditForm(f => ({ ...f, maritalStatus: e.target.value }))}
                    >
                      <option value="">Select status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password (leave blank to keep unchanged)</label>
                    <Input
                      type="password"
                      value={editForm.password}
                      onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="••••••••"
                    />
                  </div>
                  <DialogFooter>
                    <button
                      type="submit"
                      className="bg-[#e30613] text-white px-4 py-2 rounded font-bold flex items-center gap-2"
                      disabled={editLoading}
                    >
                      {editLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      Save
                    </button>
                    <DialogClose asChild>
                      <button type="button" className="px-4 py-2 rounded font-bold">Cancel</button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
        </div>
    );
};

export default Profile;