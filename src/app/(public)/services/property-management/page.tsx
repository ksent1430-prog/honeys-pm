"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Shield, Users, BarChart3, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone is required"),
  propertyCount: z.string().optional(),
  message: z.string().optional(),
});

type LeadValues = z.infer<typeof leadSchema>;

export default function PropertyManagementPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadValues>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: "owner-consultation" }),
      });
      if (response.ok) {
        setIsSuccess(true);
        reset();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <section className="py-20 bg-slate-50 border-b">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Full-Service Property Management
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Maximize your rental income and minimize your stress. We handle everything from tenant screening to maintenance and reporting.
              </p>
              <div className="space-y-4 mb-10">
                <FeatureItem title="98% Average Occupancy Rate" />
                <FeatureItem title="Vetted, High-Quality Tenants" />
                <FeatureItem title="Transparent Financial Reporting" />
                <FeatureItem title="24/7 Emergency Response" />
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl border shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Request a Free Consultation</h2>
              {isSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Consultation Requested!</h3>
                  <p className="text-muted-foreground">We'll contact you within one business day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...register("email")} />
                      {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" {...register("phone")} />
                      {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="propertyCount">Number of Properties</Label>
                    <Input id="propertyCount" placeholder="e.g. 5" {...register("propertyCount")} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Get Free Proposal"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Management Process</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've refined our operations to provide the most efficient and reliable management service in the region.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          <ProcessStep icon={<Users />} title="Tenant Placement" description="Rigorous screening including credit, criminal, and eviction history." />
          <ProcessStep icon={<Shield />} title="Compliance" description="We ensure your properties meet all local and federal housing laws." />
          <ProcessStep icon={<Clock />} title="Maintenance" description="Proactive upkeep and rapid response to repair requests." />
          <ProcessStep icon={<BarChart3 />} title="Reporting" description="Real-time access to financial statements and performance metrics." />
        </div>
      </section>
    </div>
  );
}

function FeatureItem({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="w-5 h-5 text-primary" />
      <span className="font-semibold text-lg">{title}</span>
    </div>
  );
}

function ProcessStep({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
