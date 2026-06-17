import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function inspectionsPage() {
  return (
    <div className="flex flex-col">
      <section className="py-20 bg-slate-50 border-b">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Inspection Services
          </h1>
          <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl mx-auto leading-relaxed">
            Thorough property inspections to protect your investment.
          </p>
          <div className="mt-10">
            <Button size="lg" asChild>
              <Link href="/contact">Request This Service</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 container px-4 md:px-6 mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why Choose Our Inspection Services?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              We provide professional, reliable, and transparent inspections tailored to the needs of property owners and managers.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-medium">Experienced and vetted professionals</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-medium">Digital reports with photo documentation</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-medium">Transparent pricing with no hidden fees</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-medium">Seamless integration with our management platform</span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-100 aspect-square rounded-2xl flex items-center justify-center">
            <span className="text-muted-foreground">Illustration for Inspection Services</span>
          </div>
        </div>
      </section>
    </div>
  );
}
