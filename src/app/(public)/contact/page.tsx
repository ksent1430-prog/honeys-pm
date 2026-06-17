"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          type: "contact",
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        reset();
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <section className="py-20 bg-slate-50 border-b">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Contact Us
          </h1>
          <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl mx-auto leading-relaxed">
            Have questions? We're here to help. Reach out to our team today.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
              <div className="space-y-8">
                <ContactInfoItem 
                  icon={<Mail className="w-6 h-6 text-primary" />}
                  title="Email Us"
                  content="hello@opsflow.pm"
                  description="We typically respond within 24 hours."
                />
                <ContactInfoItem 
                  icon={<Phone className="w-6 h-6 text-primary" />}
                  title="Call Us"
                  content="+1 (555) 123-4567"
                  description="Mon-Fri, 9am - 5pm EST"
                />
                <ContactInfoItem 
                  icon={<MapPin className="w-6 h-6 text-primary" />}
                  title="Visit Our Office"
                  content="123 Property Lane, Suite 100"
                  description="Springfield, ST 12345"
                />
              </div>

              <div className="mt-12 p-8 bg-slate-50 rounded-2xl border">
                <h3 className="font-bold mb-4">Emergency Maintenance?</h3>
                <p className="text-muted-foreground mb-6">
                  If you are a tenant with an urgent maintenance emergency (e.g., flooding, no heat), please call our emergency line directly.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="tel:+15559111234">+1 (555) 911-1234</a>
                </Button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border shadow-sm">
              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-8">
                    Thank you for reaching out. A member of our team will be in touch shortly.
                  </p>
                  <Button onClick={() => setIsSuccess(false)} variant="outline">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" {...register("name")} />
                      {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
                      {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="(555) 000-0000" {...register("phone")} />
                      {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select onValueChange={(value) => setValue("subject", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="property-management">Property Management</SelectItem>
                          <SelectItem value="maintenance">Maintenance Request</SelectItem>
                          <SelectItem value="inspections">Inspections</SelectItem>
                          <SelectItem value="cleaning">Cleaning Services</SelectItem>
                          <SelectItem value="pest-control">Pest Control</SelectItem>
                          <SelectItem value="other">Other Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="How can we help you?" 
                      rows={5} 
                      {...register("message")}
                    />
                    {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactInfoItem({ icon, title, content, description }: { icon: React.ReactNode, title: string, content: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="font-medium text-slate-900">{content}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
