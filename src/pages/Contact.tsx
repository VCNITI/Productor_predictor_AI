import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, ArrowUpRight, Send, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

// --- LOGIC SECTION (UNCHANGED) ---
const formSchema = z.object({
  firstName: z.string().min(2, "First name is too short").max(50),
  lastName: z.string().min(2, "Last name is too short").max(50),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(5, "Subject is too short"),
  message: z
    .string()
    .min(10, "Message is too short")
    .max(500, "Message is too long"),
});

const Contact = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values) => {
    const toastId = toast.loading("Sending your message...");
    try {
      const apiUrl = import.meta.env.VITE_API_URL.replace(/\/$/, "");
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to send message. Please try again later.");
      }

      toast.success("Message sent successfully!", { id: toastId });
      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred.",
        { id: toastId }
      );
    }
  };
// --- END LOGIC SECTION ---

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 font-sans selection:bg-purple-100">
      <Header />

      <main className="flex-1 pt-10 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
            
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
                
                {/* --- LEFT COLUMN: Typography & Bento Grid Info --- */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    className="lg:col-span-5 flex flex-col h-full"
                >
                    <motion.div variants={fadeIn} className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 rounded-full bg-[#a852e5] animate-pulse" />
                            <span className="text-sm font-bold tracking-widest text-gray-500 uppercase">Contact Us</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tighter leading-none mb-6">
                            Let's start a <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a852e5] to-purple-600">Conversation.</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Have a project in mind? Looking for bulk material pricing? Our team matches you with the right solutions instantly.
                        </p>
                    </motion.div>

                    {/* Bento Grid Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        
                        {/* Card 1: Email (Dark Theme) */}
                        <motion.div variants={fadeIn} className="md:col-span-2 bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 group-hover:opacity-30 transition-opacity" />
                            <div className="relative z-10">
                                <Mail className="w-8 h-8 text-[#a852e5] mb-4" />
                                <h3 className="text-lg font-bold">Email Us</h3>
                                <p className="text-gray-400 text-sm mb-4">Response within 2 hours</p>
                                <a href="mailto:info@vcniti.com" className="text-2xl font-bold flex items-center gap-2 hover:text-[#a852e5] transition-colors">
                                    info@vcniti.com <ArrowUpRight className="w-5 h-5" />
                                </a>
                            </div>
                        </motion.div>

                        {/* Card 2: Phone */}
                        <motion.div variants={fadeIn} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <Phone className="w-8 h-8 text-gray-900 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900">Call Us</h3>
                            <p className="text-gray-500 text-sm mb-4">Mon-Sat, 9am - 6pm</p>
                            <a href="tel:9740059699" className="text-lg font-bold text-[#a852e5] hover:underline">
                                9740059699
                            </a>
                        </motion.div>

                        {/* Card 3: Location */}
                        <motion.div variants={fadeIn} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <MapPin className="w-8 h-8 text-gray-900 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900">Visit HQ</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Bhive, Church St, Ashok Nagar, Bengaluru
                            </p>
                        </motion.div>
                    </div>
                </motion.div>


                {/* --- RIGHT COLUMN: The Form --- */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="lg:col-span-7"
                >
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-purple-900/5 border border-gray-100 p-8 md:p-10 relative overflow-hidden">
                        
                        {/* Decor */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#a852e5] to-purple-400" />

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <MessageSquare className="w-6 h-6 text-[#a852e5]" />
                                Send a Message
                            </h2>
                            <p className="text-gray-500 mt-1">Fill out the form below and we will get back to you.</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                
                                {/* Name Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-gray-500 tracking-wider">First Name</FormLabel>
                                            <FormControl>
                                            <Input className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#a852e5] focus:border-transparent transition-all" placeholder="John" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-gray-500 tracking-wider">Last Name</FormLabel>
                                            <FormControl>
                                            <Input className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#a852e5] focus:border-transparent transition-all" placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Contact Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-gray-500 tracking-wider">Email</FormLabel>
                                            <FormControl>
                                            <Input className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#a852e5] focus:border-transparent transition-all" placeholder="name@company.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-gray-500 tracking-wider">Phone (Optional)</FormLabel>
                                            <FormControl>
                                            <Input className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#a852e5] focus:border-transparent transition-all" placeholder="+91..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="company"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-gray-500 tracking-wider">Company</FormLabel>
                                            <FormControl>
                                            <Input className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#a852e5] focus:border-transparent transition-all" placeholder="Your Company Ltd" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-gray-500 tracking-wider">Subject</FormLabel>
                                            <FormControl>
                                            <Input className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#a852e5] focus:border-transparent transition-all" placeholder="Enquiry about..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-gray-500 tracking-wider">Message</FormLabel>
                                        <FormControl>
                                        <Textarea 
                                            className="min-h-[150px] bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#a852e5] focus:border-transparent transition-all resize-none" 
                                            placeholder="Tell us about your project requirements..." 
                                            {...field} 
                                        />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full bg-[#a852e5] hover:bg-[#903dd0] text-white h-14 rounded-xl text-lg font-semibold shadow-lg shadow-purple-500/20 transition-all mt-4"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? (
                                    "Sending..."
                                    ) : (
                                    <span className="flex items-center gap-2">Send Message <Send className="w-4 h-4" /></span>
                                    )}
                                </Button>
                                
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Your data is secure. We never share your info with third parties.
                                </p>
                            </form>
                        </Form>
                    </div>
                </motion.div>

            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;