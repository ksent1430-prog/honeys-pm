import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HomeIcon, ShieldCheck, Sparkles, Wrench, Bug, BarChart3, ArrowRight } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-slate-50 border-b">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Our Services
          </h1>
          <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl mx-auto leading-relaxed">
            From comprehensive property management to specialized maintenance, we offer everything you need to run your property business efficiently.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-16">
            <ServiceDetail 
              icon={<HomeIcon className="w-12 h-12 text-primary" />}
              title="Property Management"
              description="Our core management service includes tenant placement, lease administration, rent collection, and financial reporting. We handle the day-to-day so you don't have to."
              features={[
                "Comprehensive tenant screening",
                "Lease preparation and execution",
                "Online rent collection",
                "Detailed financial reporting",
                "Eviction management"
              ]}
              href="/services/property-management"
            />
            <ServiceDetail 
              icon={<ShieldCheck className="w-12 h-12 text-primary" />}
              title="Inspections"
              description="Protect your investment with regular, thorough inspections. Our team provides detailed digital reports with photos for every visit."
              features={[
                "Move-in/Move-out inspections",
                "Annual safety checks",
                "Preventative maintenance reviews",
                "Digital photo documentation",
                "Detailed condition reports"
              ]}
              href="/services/inspections"
              reversed
            />
            <ServiceDetail 
              icon={<Sparkles className="w-12 h-12 text-primary" />}
              title="Cleaning & Upkeep"
              description="Keep your properties in pristine condition. We offer specialized cleaning services for every stage of the rental cycle."
              features={[
                "Turnover cleaning",
                "Deep cleaning services",
                "Routine common area cleaning",
                "Pre-listing staging cleans",
                "Post-construction cleaning"
              ]}
              href="/services/cleaning"
            />
            <ServiceDetail 
              icon={<Wrench className="w-12 h-12 text-primary" />}
              title="Maintenance & Handyman"
              description="Reliable repairs from skilled professionals. We manage a network of vetted contractors to ensure quality work and fast response times."
              features={[
                "24/7 emergency maintenance",
                "General handyman repairs",
                "Electrical and plumbing",
                "HVAC servicing",
                "Property improvements"
              ]}
              href="/services/maintenance"
              reversed
            />
            <ServiceDetail 
              icon={<Bug className="w-12 h-12 text-primary" />}
              title="Pest Control"
              description="Effective pest management to keep your properties safe and compliant with health standards."
              features={[
                "Regular prevention plans",
                "Bed bug treatments",
                "Rodent control",
                "Termite inspections",
                "Environmentally friendly options"
              ]}
              href="/services/pest-control"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Need a Custom Service Package?</h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            We can tailor our services to fit your specific portfolio needs. Contact us to discuss a custom management plan.
          </p>
          <Button size="lg" className="px-10" asChild>
            <Link href="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function ServiceDetail({ icon, title, description, features, href, reversed = false }: { icon: React.ReactNode, title: string, description: string, features: string[], href: string, reversed?: boolean }) {
  return (
    <div className={`grid md:grid-cols-2 gap-12 items-center ${reversed ? 'md:flex-row-reverse' : ''}`}>
      <div className={reversed ? 'md:order-2' : ''}>
        <div className="mb-6">{icon}</div>
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
          {description}
        </p>
        <ul className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="font-medium">{feature}</span>
            </li>
          ))}
        </ul>
        <Button asChild variant="outline">
          <Link href={href} className="flex items-center gap-2">
            View Details <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      <div className={`bg-slate-100 aspect-video rounded-2xl flex items-center justify-center ${reversed ? 'md:order-1' : ''}`}>
        <span className="text-muted-foreground">Illustration / Image for {title}</span>
      </div>
    </div>
  );
}
