import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Users, Target, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-slate-50 border-b">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            About Honey's Property Management
          </h1>
          <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl mx-auto leading-relaxed">
            We are a family-owned business dedicated to providing top-tier property management and maintenance services with a focus on transparency, reliability, and community.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4 text-lg">
                Founded with a vision to simplify property ownership, Honey's Property Management & Services began as a small maintenance operation. We quickly realized that property owners needed more than just repairs—they needed a partner they could trust to handle every aspect of their investment.
              </p>
              <p className="text-muted-foreground mb-6 text-lg">
                Today, we operate a full-service platform that connects owners, tenants, and contractors, ensuring that properties are well-maintained, tenants are happy, and owners are informed.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">50+</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Properties Managed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">98%</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Occupancy Rate</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-200 aspect-video rounded-2xl flex items-center justify-center">
              <span className="text-muted-foreground">Team Photo / Office Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do for our clients and our community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Shield className="w-10 h-10 text-primary" />}
              title="Integrity & Trust"
              description="We believe in complete transparency. Our owners always know exactly what's happening with their properties."
            />
            <ValueCard 
              icon={<Target className="w-10 h-10 text-primary" />}
              title="Operational Excellence"
              description="We leverage technology to provide the most efficient property management experience possible."
            />
            <ValueCard 
              icon={<Users className="w-10 h-10 text-primary" />}
              title="Community First"
              description="We aren't just managing buildings; we're building communities where tenants feel at home."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Partner With Us Today</h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
            Experience the difference of a property management partner that truly cares about your success.
          </p>
          <Button size="lg" variant="secondary" className="px-10" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-xl border shadow-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
