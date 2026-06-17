import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-12 w-full shrink-0 border-t bg-slate-50">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg mb-2">OpsFlow</h3>
            <p className="text-sm text-muted-foreground">
              A single-platform business operating system for property management.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold mb-2">Services</h3>
            <Link href="/services/property-management" className="text-sm text-muted-foreground hover:text-primary">Property Management</Link>
            <Link href="/services/inspections" className="text-sm text-muted-foreground hover:text-primary">Inspections</Link>
            <Link href="/services/cleaning" className="text-sm text-muted-foreground hover:text-primary">Cleaning</Link>
            <Link href="/services/maintenance" className="text-sm text-muted-foreground hover:text-primary">Maintenance</Link>
            <Link href="/request-maintenance" className="text-sm text-muted-foreground hover:text-primary font-medium text-primary/80">Tenant Maintenance Request</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold mb-2">Company</h3>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
            <Link href="/properties" className="text-sm text-muted-foreground hover:text-primary">Available Properties</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold mb-2">Legal</h3>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Honey's Property Management & Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
