'use client'

import React, { useState, useEffect } from "react";
import { User, Users, BadgeCheck, Edit, LogOut, History as HistoryIcon, Link, Loader2 } from "lucide-react";
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
    const [editForm, setEditForm] = useState({ name: "", address: "", phone: "", password: "" });
    const [editLoading, setEditLoading] = useState(false);

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


    const getPlanName = (plan_ref: string) => {
        const plan = plans?.find((plan: any) => plan.uid === plan_ref);
        return plan?.name || "Unknown Plan";
    }

    const getPackageName = (package_ref: string) => {
        const pkg = packages?.find((pkg: any) => pkg.uid === package_ref);
        return pkg?.name || "Unknown Package";
    }

    const openEditModal = () => {
      setEditForm({
        name: userData?.name || "",
        address: userData?.address || "",
        phone: userData?.phone || "",
        password: ""
      });
      setEditModalOpen(true);
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
                            <Users className="w-5 h-5" />{userData?.phone}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-base">
                            <span className="font-bold">Address:</span> {userData?.address}
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
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-[#e30613] flex items-center gap-2"><BadgeCheck className="w-6 h-6 text-[#ffe066]" /> Membership Details</h3>
                        <button className="px-6 py-1 bg-gradient-to-r from-[#ffe066] to-[#ffd700] text-[#e30613] font-bold rounded-full shadow-lg hover:from-[#e30613] hover:to-[#cc0000] hover:text-white transition-all duration-300 text-xl w-fit transform hover:scale-105">
                            Renew Membership
                        </button>
                    </div>
                    {membership.length > 0 && (
                        membership.map((item, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-[#ffe066]/20 hover:shadow-xl transition-all duration-300">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2 text-xl">
                                        <span className="font-bold text-[#e30613]">Plan:</span>
                                        <span className="text-[#23272b]">{getPlanName(item.plan_ref)}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-lg shadow-sm">
                                            <div className="text-sm text-gray-500 mb-1">Total Days</div>
                                            <div className="text-xl font-bold text-[#23272b]">{item.totalDays}</div>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm">
                                            <div className="text-sm text-gray-500 mb-1">Used Days</div>
                                            <div className="text-xl font-bold text-[#23272b]">{item.usedDays}</div>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm">
                                            <div className="text-sm text-gray-500 mb-1">Total Nights</div>
                                            <div className="text-xl font-bold text-[#23272b]">{item.totalNights}</div>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm">
                                            <div className="text-sm text-gray-500 mb-1">Used Nights</div>
                                            <div className="text-xl font-bold text-[#23272b]">{item.usedNights}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
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
                                        <th className="pr-8">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item, idx) => (
                                        <tr key={idx} className="bg-[#f8fafc] rounded-xl">
                                            <td className="font-bold text-[#e30613] pr-8 py-2">{getPackageName(item.package_ref)}</td>
                                            <td className="pr-8 py-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Expired' ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'}`}>{item.status}</span>
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
            {/* Sidebar */}
            <aside className="w-full h-fit md:w-72 bg-white/70 backdrop-blur-md shadow-xl rounded-b-3xl md:rounded-3xl md:mr-4 flex flex-row md:flex-col items-center px-6 py-4 md:py-8 mb-4 md:mb-0 z-10">
                <div className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-6 w-full">
                    <div
                        className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#ffe066] shadow-md bg-gray-100 flex items-center justify-center"
                    >
                        <span className="text-2xl font-semibold text-black">
                            {userData?.name?.[0]?.toLowerCase() || "?"}
                        </span>
                    </div>
                    <div className="flex-1 md:text-center">
                        <div className="text-lg md:text-xl font-bold text-[#e30613] leading-tight">{userData?.name}</div>
                        <div className="text-xs md:text-sm text-gray-500">{userData?.email}</div>
                    </div>
                </div>
                <nav className="mt-0 md:mt-8 w-full">
                    <ul className="flex flex-row md:flex-col gap-2 md:gap-3 w-full justify-center md:justify-start">
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

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-stretch pb-10 w-full">
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
                    const payload: { uid: string; name: string; address: string; phone: string; password?: string } = {
                      uid: userData.uid,
                      name: editForm.name,
                      address: editForm.address,
                      phone: editForm.phone,
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