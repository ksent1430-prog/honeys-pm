'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Wrench, 
  Calendar, 
  Building2, 
  DollarSign, 
  ClipboardList,
  TrendingUp,
  Home,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

interface DashboardKPIs {
  newLeads: number;
  openServiceRequests: number;
  upcomingAppointments: number;
  activeProperties: number;
  totalProperties: number;
  totalTenants: number;
  monthlyRevenue: number;
  outstandingTasks: number;
  completedOrders: number;
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  scheduledInspections: number;
  occupancyRate: number;
  conversionRate: number;
}

export default function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKPIs() {
      try {
        const data = await apiClient.get<DashboardKPIs>('/api/dashboard/kpi');
        setKpis(data);
      } catch (error) {
        console.error('Failed to fetch dashboard KPIs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your property management operations.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/reports">View Reports</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/work-orders/new">New Work Order</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="New Leads" 
          value={kpis?.newLeads || 0} 
          description="Inquiries this week" 
          icon={Users}
          color="blue"
        />
        <KPICard 
          title="Open Requests" 
          value={kpis?.openServiceRequests || 0} 
          description={`${kpis?.outstandingTasks || 0} in progress`} 
          icon={Wrench}
          color="amber"
        />
        <KPICard 
          title="Active Properties" 
          value={kpis?.activeProperties || 0} 
          description={`${kpis?.occupancyRate || 0}% occupancy rate`} 
          icon={Building2}
          color="emerald"
        />
        <KPICard 
          title="Monthly Revenue" 
          value={`$${(kpis?.monthlyRevenue || 0).toLocaleString()}`} 
          description="Paid this month" 
          icon={DollarSign}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Operational Health</CardTitle>
            <CardDescription>Status of ongoing work and properties.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatItem 
                label="Scheduled Inspections" 
                value={kpis?.scheduledInspections || 0} 
                subValue="Next 7 days" 
              />
              <StatItem 
                label="Upcoming Appts" 
                value={kpis?.upcomingAppointments || 0} 
                subValue="Next 7 days" 
              />
              <StatItem 
                label="Active Tenants" 
                value={kpis?.totalTenants || 0} 
                subValue="On lease" 
              />
            </div>
            <div className="mt-8 pt-6 border-t">
              <h4 className="text-sm font-medium mb-4">Quick Links</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <QuickLinkButton href="/dashboard/crm/leads" label="CRM Leads" icon={Users} />
                <QuickLinkButton href="/dashboard/properties" label="Properties" icon={Home} />
                <QuickLinkButton href="/dashboard/work-orders" label="Work Orders" icon={ClipboardList} />
                <QuickLinkButton href="/dashboard/calendar" label="Calendar" icon={Calendar} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Performance</CardTitle>
            <CardDescription>Key business metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <PerformanceMetric 
              label="Occupancy Rate" 
              value={kpis?.occupancyRate || 0} 
              color="text-emerald-500" 
            />
            <PerformanceMetric 
              label="Payment Conversion" 
              value={kpis?.conversionRate || 0} 
              color="text-blue-500" 
            />
            <div className="pt-4 border-t">
               <div className="flex items-center justify-between text-sm mb-2">
                 <span className="text-muted-foreground font-medium">Overdue Invoices</span>
                 <span className="text-rose-500 font-bold">{kpis?.overdueInvoices || 0}</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                 <span className="text-muted-foreground font-medium">Completed Jobs (MTD)</span>
                 <span className="text-emerald-500 font-bold">{kpis?.completedOrders || 0}</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ title, value, description, icon: Icon, color }: {
  title: string,
  value: string | number,
  description: string,
  icon: any,
  color: 'blue' | 'amber' | 'emerald' | 'indigo'
}) {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-50',
    amber: 'text-amber-600 bg-amber-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    indigo: 'text-indigo-600 bg-indigo-50'
  };

  return (
    <Card className="shadow-sm border-none bg-card hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${colorMap[color]}`}>
            <Icon className="size-5" />
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatItem({ label, value, subValue }: { label: string, value: string | number, subValue: string }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{subValue}</p>
    </div>
  );
}

function PerformanceMetric({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm font-medium">
        <span className="text-foreground">{label}</span>
        <span className={color}>{value}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color.replace('text-', 'bg-')}`} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function QuickLinkButton({ href, label, icon: Icon }: { href: string, label: string, icon: any }) {
  return (
    <Button variant="ghost" className="h-auto flex-col gap-2 p-3 border hover:border-primary/50 hover:bg-primary/5 group" asChild>
      <Link href={href}>
        <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="text-[10px] font-medium">{label}</span>
      </Link>
    </Button>
  );
}
