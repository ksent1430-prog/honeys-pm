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
import { Wrench, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

const maintenanceRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  propertyAddress: z.string().min(5, "Please provide your property address"),
  urgency: z.string().min(1, "Please select urgency level"),
  issueType: z.string().min(1, "Please select the type of issue"),
  description: z.string().min(10, "Please describe the issue"),
  permissionToEnter: z.boolean().default(false),
});

type MaintenanceRequestValues = z.infer<typeof maintenanceRequestSchema>;

export default function RequestMaintenancePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MaintenanceRequestValues>({
    resolver: zodResolver(maintenanceRequestSchema),
    defaultValues: {
      permissionToEnter: false,
    }
  });

  const onSubmit = async (data: MaintenanceRequestValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          type: "maintenance-request",
        }),
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
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Maintenance Request
          </h1>
          <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl mx-auto leading-relaxed">
            Tenants: Use this form to report non-emergency maintenance issues.
          </p>
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-2xl mx-auto flex gap-4 text-left">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-amber-900">Emergency?</p>
              <p className="text-amber-800 text-sm">
                If this is a life-threatening emergency or involves active flooding or fire, call 911 immediately. 
                For urgent after-hours maintenance, call our emergency line at (555) 911-1234.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border shadow-sm">
            {isSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Request Submitted!</h3>
                <p className="text-muted-foreground mb-8">
                  We've received your maintenance request. A member of our team will contact you to coordinate the repair.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline">
                  Submit Another Request
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
                    <Label htmlFor="issueType">Issue Category</Label>
                    <Select onValueChange={(value) => setValue("issueType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="hvac">Heating / Cooling</SelectItem>
                        <SelectItem value="appliance">Appliance</SelectItem>
                        <SelectItem value="structural">Structural / Exterior</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.issueType && <p className="text-xs text-red-500">{errors.issueType.message}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyAddress">Property Address</Label>
                    <Input id="propertyAddress" placeholder="123 Main St, Apt 4B" {...register("propertyAddress")} />
                    {errors.propertyAddress && <p className="text-xs text-red-500">{errors.propertyAddress.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select onValueChange={(value) => setValue("urgency", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Standard Maintenance)</SelectItem>
                        <SelectItem value="medium">Medium (Needs attention soon)</SelectItem>
                        <SelectItem value="high">High (Urgent - but non-emergency)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.urgency && <p className="text-xs text-red-500">{errors.urgency.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Issue Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Please describe the issue in detail..." 
                    rows={5} 
                    {...register("description")}
                  />
                  {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>

                <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border">
                  <input 
                    type="checkbox" 
                    id="permission" 
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    {...register("permissionToEnter")}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="permission" className="text-sm font-medium leading-none">
                      Permission to Enter
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      By checking this box, you authorize Honey's Property Management or their contractors to enter the premises to address the reported issue even if you are not present.
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Maintenance Request"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
