'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Wrench,
  ArrowUpRight,
  ChevronRight,
  Download
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function LandlordDashboard() {
  // Mock data for the landlord
  const portfolioData = {
    owner: 'John Smith',
    totalProperties: 4,
    totalUnits: 18,
    occupancyRate: 94.4,
    monthlyRevenue: 24500,
    outstandingRepairs: 3,
    recentActivity: [
      { id: 1, type: 'Payment', property: 'Oakwood Apts', amount: 1200, date: 'June 6' },
      { id: 2, type: 'Maintenance', property: 'Sunset Villa', issue: 'Leaking Faucet', status: 'Approved', date: 'June 5' },
      { id: 3, type: 'Lease', property: 'Oakwood Apts', action: 'Renewal signed', date: 'June 4' },
    ]
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Overview</h1>
          <p className="text-muted-foreground">Welcome back, {portfolioData.owner}</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Properties" value={portfolioData.totalProperties} icon={<Building2 className="h-4 w-4" />} />
        <SummaryCard title="Occupancy Rate" value={`${portfolioData.occupancyRate}%`} icon={<TrendingUp className="h-4 w-4" />} />
        <SummaryCard title="Monthly Revenue" value={`$${portfolioData.monthlyRevenue.toLocaleString()}`} icon={<DollarSign className="h-4 w-4" />} />
        <SummaryCard title="Pending Repairs" value={portfolioData.outstandingRepairs} icon={<Wrench className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Properties List Preview */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Properties</CardTitle>
              <CardDescription>Overview of your active real estate assets</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/portal/landlord/properties">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <PropertyRow name="Oakwood Apartments" address="123 Oak St" units={12} occupancy={92} revenue={15400} />
              <PropertyRow name="Sunset Villa" address="456 Palm Dr" units={1} occupancy={100} revenue={2800} />
              <PropertyRow name="Riverview Condo" address="101 River Rd" units={1} occupancy={0} revenue={0} />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {portfolioData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="size-2 rounded-full bg-primary mt-2" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {activity.type}: {activity.amount ? `$${activity.amount}` : activity.issue || activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.property} • {activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6">View All Activity</Button>
          </CardContent>
        </Card>
      </div>

      {/* Action Center */}
      <Card>
        <CardHeader>
          <CardTitle>Needs Your Attention</CardTitle>
          <CardDescription>Items that require landlord approval or review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex gap-4 items-center">
                <div className="size-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Roof Repair Estimate (Oakwood Apts)</p>
                  <p className="text-xs text-muted-foreground">Estimate: $4,500 • Submitted June 5</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Review</Button>
                <Button size="sm">Approve</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function PropertyRow({ name, address, units, occupancy, revenue }: { name: string, address: string, units: number, occupancy: number, revenue: number }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
      <div className="flex-1">
        <p className="font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground">{address} • {units} Units</p>
      </div>
      <div className="flex items-center gap-8">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">{occupancy}%</p>
          <p className="text-[10px] text-muted-foreground uppercase">Occupancy</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">${revenue.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground uppercase">Revenue</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
}
