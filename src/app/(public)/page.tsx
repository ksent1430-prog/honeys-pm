'use client';

import { SignUpButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, HomeIcon, Settings, ShieldCheck, Wrench, Sparkles, Bug } from "lucide-react";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-50 to-white">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl mb-6 max-w-4xl">
          Property Management, <span className="text-primary">Simplified</span>.
        </h1>
        <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed">
          The all-in-one operating system for Honey's Property Management & Services. 
          Manage leads, properties, tenants, and work orders in one seamless platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {!isSignedIn ? (
            <SignUpButton mode="modal">
              <Button size="lg" className="px-8">Get Started Now</Button>
            </SignUpButton>
          ) : (
            <Button size="lg" asChild className="px-8">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          )}
          <Link href="/services">
            <Button variant="outline" size="lg" className="px-8">View Our Services</Button>
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 md:px-6 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Property Solutions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage, maintain, and maximize your property investments.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: HomeIcon, title: "Property Management", desc: "Full-service management for residential and commercial properties." },
            { icon: ShieldCheck, title: "Inspections", desc: "Thorough property inspections for buyers, sellers, and landlords." },
            { icon: Sparkles, title: "Cleaning Services", desc: "Professional cleaning for move-in/move-out and regular maintenance." },
            { icon: Wrench, title: "Maintenance", desc: "24/7 maintenance services with licensed technicians." },
            { icon: Settings, title: "Handyman Services", desc: "Reliable handyman services for repairs and improvements." },
            { icon: Bug, title: "Pest Control", desc: "Comprehensive pest control and prevention services." },
          ].map((service, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <service.icon className="size-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Honey's?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine technology with decades of property management experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "All-in-One Platform", desc: "Manage everything from one dashboard — properties, tenants, work orders, and finances." },
              { title: "Real-Time Updates", desc: "Get instant notifications on maintenance requests, lease renewals, and payments." },
              { title: "Tenant & Landlord Portals", desc: "Dedicated portals for tenants to submit requests and landlords to track performance." },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-4">
                <CheckCircle2 className="size-6 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center bg-primary text-primary-foreground">
        <h2 className="text-3xl font-bold mb-4">Ready to Simplify Your Property Management?</h2>
        <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
          Join Honey's Property Management & Services and let us handle the hard work.
        </p>
        <div className="flex justify-center gap-4">
          {!isSignedIn ? (
            <SignUpButton mode="modal">
              <Button size="lg" variant="secondary" className="px-8">Get Started Free</Button>
            </SignUpButton>
          ) : (
            <Button size="lg" variant="secondary" asChild className="px-8">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          )}
          <Button size="lg" variant="outline" className="px-8 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}