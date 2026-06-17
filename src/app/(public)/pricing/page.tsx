import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-slate-50 border-b">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl mx-auto leading-relaxed">
            Choose the management plan that best fits your portfolio. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard 
              title="Individual"
              price="8%"
              description="Ideal for owners with 1-3 properties."
              features={[
                "Full tenant screening",
                "Lease administration",
                "Rent collection",
                "24/7 maintenance coordination",
                "Monthly financial reports",
                "Annual inspection"
              ]}
              buttonText="Get Started"
              href="/contact?plan=individual"
            />
            <PricingCard 
              title="Professional"
              price="7%"
              description="Perfect for growing portfolios (4-10 properties)."
              features={[
                "All Individual features",
                "Quarterly property inspections",
                "Priority maintenance response",
                "Dedicated property manager",
                "Vendor management",
                "Eviction protection"
              ]}
              highlighted
              buttonText="Contact for Consultation"
              href="/contact?plan=professional"
            />
            <PricingCard 
              title="Enterprise"
              price="Custom"
              description="Tailored solutions for 10+ properties."
              features={[
                "All Professional features",
                "Custom reporting API",
                "Multi-property discounts",
                "Dedicated accountant",
                "Strategic portfolio planning",
                "Bulk turnover discounts"
              ]}
              buttonText="Request Quote"
              href="/contact?plan=enterprise"
            />
          </div>
        </div>
      </section>

      {/* Service Fees */}
      <section className="py-20 bg-slate-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Additional Service Rates</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We also offer standalone services for owners who handle their own management.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceRateCard title="Leasing Fee" rate="50% of first month" />
            <ServiceRateCard title="Cleaning" rate="From $150" />
            <ServiceRateCard title="Inspection" rate="$99 / visit" />
            <ServiceRateCard title="Pest Control" rate="From $75" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
            Contact us today for a free property evaluation and a customized management proposal.
          </p>
          <Button size="lg" variant="secondary" className="px-10" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function PricingCard({ 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  href, 
  highlighted = false 
}: { 
  title: string, 
  price: string, 
  description: string, 
  features: string[], 
  buttonText: string, 
  href: string, 
  highlighted?: boolean 
}) {
  return (
    <div className={`p-8 rounded-2xl border flex flex-col ${highlighted ? 'border-primary ring-2 ring-primary ring-offset-2 shadow-lg relative bg-white' : 'bg-white'}`}>
      {highlighted && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-4xl font-extrabold">{price}</span>
        {price.includes('%') && <span className="text-muted-foreground">/ month</span>}
      </div>
      <p className="text-muted-foreground mb-8">{description}</p>
      <ul className="space-y-4 mb-10 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex gap-3">
            <Check className="w-5 h-5 text-primary shrink-0" />
            <span className="text-sm font-medium">{feature}</span>
          </li>
        ))}
      </ul>
      <Button variant={highlighted ? 'default' : 'outline'} size="lg" className="w-full" asChild>
        <Link href={href}>{buttonText}</Link>
      </Button>
    </div>
  );
}

function ServiceRateCard({ title, rate }: { title: string, rate: string }) {
  return (
    <div className="p-6 rounded-xl border bg-white text-center">
      <h4 className="font-semibold text-muted-foreground mb-2">{title}</h4>
      <div className="text-xl font-bold">{rate}</div>
    </div>
  );
}
