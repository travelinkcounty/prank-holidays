"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addJoin } from '@/lib/redux/features/joinSlice';
import { AppDispatch } from '@/lib/redux/store';


const Popup = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [form, setForm] = useState({ name: '', email: '', phone: '', age: '', from: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showContact, setShowContact] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setSuccess(false);
        try {
            // Simulate API call
            const join = {
                name: form.name,
                email: form.email,
                phone: form.phone,
                age: form.age,
                from: form.from,
                status: 'new'
            };  
            await dispatch(addJoin(join));
            await new Promise(res => setTimeout(res, 1500));
            setSuccess(true);
            setForm({ name: '', email: '', phone: '', age: '', from: '' });
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-close modal after showing contact details
    useEffect(() => {
        if (success) {
            setShowContact(true);
            const timer = setTimeout(() => {
                setShowContact(false);
                setSuccess(false);
                onOpenChange(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-[90vw] md:max-w-2xl md:max-w-4xl lg:max-w-5xl p-0 overflow-hidden rounded-2xl shadow-2xl border-0">
                <div className="flex flex-col md:flex-row w-full h-full md:min-h-[520px]">
                    {/* Left: Image */}
                    <div className="hidden md:block md:w-1/2 h-full bg-[#ffe066] relative border-r border-[#ffe066]">
                        <img
                            src="/images/popup.jpg"
                            alt="Popup Visual"
                            className="object-cover w-full h-full md:rounded-l-2xl md:rounded-tr-none"
                            style={{ height: '100%', width: '100%' }}
                        />
                    </div>
                    {/* Right: Form */}
                    <div className="w-full md:w-1/2 h-full bg-white p-6 md:p-8 flex flex-col justify-center shadow-none">
                        <DialogHeader className="mb-2">
                            <DialogTitle className="text-3xl font-extrabold text-[#e30613] mb-1">Join Travelink County</DialogTitle>
                            <DialogDescription className="text-gray-500 text-lg mb-4">Fill the form and we'll get back to you soon!</DialogDescription>
                        </DialogHeader>
                        {showContact ? (
                            <div className="flex flex-col items-center justify-center gap-4 py-8">
                                <CheckCircle2 className="w-16 h-16 text-green-500" />
                                <div className="text-2xl font-semibold text-green-700 text-center mb-2">Thank you! We received your details.</div>
                                <div className="text-base text-gray-700 text-center mt-2">
                                    <div><b>Contact us:</b></div>
                                    <div>+91 - 9717308208</div>
                                    <div>+91 - 9220413324</div>
                                    <div>Toll Free: 1800 890 5660</div>
                                    <div>Landline: +91-45725977</div>
                                    <div>info@travelinkcounty.com</div>
                                </div>
                            </div>
                        ) : success ? (
                            <div className="flex flex-col items-center justify-center gap-4 py-12">
                                <CheckCircle2 className="w-16 h-16 text-green-500" />
                                <div className="text-2xl font-semibold text-green-700 text-center">Thank you! We received your details.</div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <Input
                                    name="name"
                                    placeholder="Name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="h-12 text-lg"
                                />
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="h-12 text-lg"
                                />
                                <Input
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    className="h-12 text-lg"
                                />
                                <Input
                                    name="age"
                                    type="number"
                                    placeholder="Age"
                                    value={form.age}
                                    onChange={handleChange}
                                    required
                                    className="h-12 text-lg"
                                />
                                <Input
                                    name="from"
                                    placeholder="Where are you from?"
                                    value={form.from}
                                    onChange={handleChange}
                                    required
                                    className="h-12 text-lg"
                                />
                                {error && <div className="text-red-600 text-base font-semibold">{error}</div>}
                                <Button
                                    type="submit"
                                    className="bg-[#e30613] text-white font-bold flex items-center justify-center gap-2 mt-2 h-12 text-lg rounded-xl shadow-md hover:bg-[#c40010]"
                                    disabled={loading}
                                >
                                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                    Submit
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Popup;