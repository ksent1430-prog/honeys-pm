'use client';

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-background z-50">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl">
        <span className="text-primary">Ops</span>Flow
      </Link>
      <nav className="hidden md:flex ml-10 gap-6">
        <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">Services</Link>
        <Link href="/properties" className="text-sm font-medium hover:text-primary transition-colors">Properties</Link>
        <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
        <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
        <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
      </nav>
      <div className="ml-auto flex gap-4 items-center">
        {!isSignedIn ? (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Get Started</Button>
            </SignUpButton>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </>
        )}
      </div>
    </header>
  );
}