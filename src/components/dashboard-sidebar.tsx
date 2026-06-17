'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserButton, useUser } from '@clerk/nextjs';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Wrench,
  ClipboardCheck,
  Calendar,
  Receipt,
  UserCog,
  BarChart3,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Home,
  DollarSign,
  Briefcase,
  FileText,
  Lightbulb,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'CRM / Leads', href: '/dashboard/crm', icon: Users },
  { label: 'Properties', href: '/dashboard/properties', icon: Building2 },
  { label: 'Work Orders', href: '/dashboard/work-orders', icon: Wrench },
  { label: 'Inspections', href: '/dashboard/inspections', icon: ClipboardCheck },
  { label: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { label: 'Invoices', href: '/dashboard/invoices', icon: Receipt },
  { label: 'Accounting', href: '/dashboard/accounting', icon: DollarSign },
  { label: 'Employees', href: '/dashboard/employees', icon: UserCog },
  { label: 'HR / Jobs', href: '/dashboard/hr', icon: Briefcase },
  { label: 'Temp Staffing', href: '/dashboard/temp-staff', icon: Users },
  { label: 'Contracts', href: '/dashboard/contracts', icon: FileText },
  { label: 'Reports / BI', href: '/dashboard/bi', icon: Lightbulb },
  { label: 'Communications', href: '/dashboard/communications', icon: MessageSquare },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-sidebar transition-all duration-300 md:sticky md:top-0 md:h-screen',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className={cn(
          'flex h-14 items-center border-b px-4',
          collapsed ? 'justify-center' : 'justify-between'
        )}>
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
              <span className="text-primary">Ops</span>Flow
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="flex items-center justify-center size-8">
              <span className="text-primary font-bold text-lg">O</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon-xs"
            className="hidden md:flex"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  collapsed && 'justify-center px-2'
                )}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="size-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={cn(
          'border-t p-3',
          collapsed ? 'flex flex-col items-center gap-2' : 'flex items-center gap-3'
        )}>
          <div className={cn('flex items-center gap-3', collapsed && 'flex-col')}>
            <UserButton />
            {!collapsed && user && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate text-sidebar-foreground">
                  {user.fullName || user.emailAddresses[0]?.emailAddress || 'User'}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user.primaryEmailAddress?.emailAddress || ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}