'use client'

import React, { useState } from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const socialLinks = [
    {
        icon: Facebook,
        label: "Facebook",
        href: "https://facebook.com/prankholidays",
    },
    {
        icon: Instagram,
        label: "Instagram",
        href: "https://instagram.com/prankholidays",
    },
    {
        icon: Youtube,
        label: "Youtube",
        href: "https://youtube.com/@prankholidays",
    },
];

const ContactPage = () => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        message: "",
    });
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setTimeout(() => {
            setLoading(false);
            console.log(form);
            setSuccess(true);
            setForm({ name: "", phone: "", email: "", message: "" });
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-main)' }}>
            {/* Hero Section */}
            <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/contact-banner.jpg')] bg-cover bg-center bg-no-repeat" />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
                        Let's <span className="text-[#ffc72c]">Connect</span> &<br className="hidden md:inline" /> Plan Your Next <span className="text-[#1a4d8f]">Adventure</span>
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
                        Have a question, want to collaborate, or just want to say hi? <br className="hidden md:inline" />
                        Fill out the form below and our team will get back to you faster than you can say <span className="italic text-[#1a4d8f]">"Bon Voyage!"</span>
                    </p>
                </div>
            </div>

            {/* Contact Form & Details */}
            <section className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Details */}
                <Card className="bg-[#f9fafb] shadow-lg border-[#e3061320] flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-[#e30613]">Contact Details</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between h-full">
                        <ul className="space-y-6 w-full text-[1.15rem] md:text-xl font-semibold text-neutral-800">
                            <li className="flex items-start gap-4">
                                <span className="mt-1"><MapPin className="w-6 h-6 text-[#e30613]" /></span>
                                <span>811, 8th Floor, Meghdoot Building 94,<br />Nehru Place, New Delhi-110019</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Phone className="w-6 h-6 text-[#e30613]" />
                                <span>+91-11-45725977</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Phone className="w-6 h-6 text-[#e30613]" />
                                <span>+91-9717308208</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Mail className="w-6 h-6 text-[#e30613]" />
                                <span>care@prankholidays.com</span>
                            </li>
                        </ul>
                        <div className="flex gap-4 mt-8">
                            {socialLinks.map(({ icon: Icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full border border-[#e30613] text-[#e30613] hover:bg-[#e30613] hover:text-white transition-colors"
                                    aria-label={label}
                                >
                                    <Icon className="w-6 h-6" />
                                </a>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                {/* Form */}
                <Card className="shadow-lg border-[#e3061320]">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-[#e30613]">Send us a Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                            <div className="flex flex-col col-span-1 md:col-span-1">
                                <label className="block mb-1 font-semibold text-[#1a4d8f]">Name</label>
                                <Input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Your Name" required />
                            </div>
                            <div className="flex flex-col col-span-1 md:col-span-1">
                                <label className="block mb-1 font-semibold text-[#1a4d8f]">Phone</label>
                                <Input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="Your Phone Number" />
                            </div>
                            <div className="flex flex-col col-span-1 md:col-span-2">
                                <label className="block mb-1 font-semibold text-[#1a4d8f]">Email</label>
                                <Input name="email" value={form.email} onChange={handleChange} type="email" placeholder="you@email.com" required />
                            </div>
                            <div className="flex flex-col col-span-1 md:col-span-2">
                                <label className="block mb-1 font-semibold text-[#1a4d8f]">Message</label>
                                <Textarea name="message" value={form.message} onChange={handleChange} rows={7} className="min-h-[140px]" placeholder="Type your message..." required />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <Button type="submit" className="w-full text-lg font-bold" disabled={loading}>
                                    {loading ? "Sending..." : "Send Message"}
                                </Button>
                            </div>
                        </form>
                        {success && (
                          <div className="col-span-1 md:col-span-2 mt-6">
                            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-md text-center font-semibold">
                              Your message has been sent successfully!
                            </div>
                          </div>
                        )}
                    </CardContent>
                </Card>
            </section>

            {/* Google Map */}
            <section className=" mx-auto p-0">
                <div className="rounded-xl overflow-hidden shadow-lg border border-[#e3061320]">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.708984311857!2d77.24876667552991!3d28.548465687893337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3c3fb00d44d%3A0xe45a69a29790e68b!2sPRANK%20Holidays%20Private%20Ltd!5e0!3m2!1sen!2sin!4v1747915210093!5m2!1sen!2sin" width="100%"
                        height="600"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Map"
                    ></iframe>

                </div>
            </section>
        </div>
    );
};

export default ContactPage;

