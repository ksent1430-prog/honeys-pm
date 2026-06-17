'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  CreditCard, 
  Calendar, 
  AlertCircle,
  ArrowUpRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function TenantDashboard() {
  // Mock data for the tenant
  const tenantData = {
    name: 'Alice Green',
    property: 'Oakwood Apartments, Unit 1A',
    rentStatus: 'paid',
    nextRentDate: 'July 1, 2024',
    rentAmount: 1200,
    activeRequests: [
      { id: 'WO-1234', issue: 'Leaking Sink', status: 'In Progress', date: 'June 5' },
    ]
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {tenantData.name}</h1>
        <p className="text-muted-foreground">{tenantData.property}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rent Status Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Rent Payment</CardTitle>
              <CardDescription>Your next payment is due on {tenantData.nextRentDate}</CardDescription>
            </div>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-4">
              <div>
                <span className="text-4xl font-bold">${tenantData.rentAmount}</span>
                <Badge className="ml-3 bg-green-100 text-green-700 hover:bg-green-100 border-none">
                  PAID FOR JUNE
                </Badge>
              </div>
              <Button>Pay Early</Button>
            </div>
            <div className="border-t pt-4 mt-4">
              <Link href="/portal/tenant/billing" className="text-sm text-primary hover:underline flex items-center">
                View billing history <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/portal/tenant/maintenance/new">
                <Wrench className="mr-2 h-4 w-4" /> Request Maintenance
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/portal/tenant/lease">
                <FileText className="mr-2 h-4 w-4" /> View Lease
              </Link>
            </Button>
            <Button variant="outline" className="justify-start">
              <Calendar className="mr-2 h-4 w-4" /> Contact Manager
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Maintenance Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Active Maintenance</CardTitle>
            <CardDescription>Recent requests you've submitted</CardDescription>
          </CardHeader>
          <CardContent>
            {tenantData.activeRequests.length > 0 ? (
              <div className="space-y-4">
                {tenantData.activeRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50">
                    <div className="flex gap-4 items-center">
                      <div className="size-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{req.issue}</p>
                        <p className="text-xs text-muted-foreground">ID: {req.id} • Submitted {req.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-white">{req.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>No active maintenance requests</p>
              </div>
            )}
            <Button variant="link" className="w-full mt-4" asChild>
              <Link href="/portal/tenant/maintenance">View all history</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Announcements / Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Updates from Honey's Property Management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnnouncementItem 
              title="Gutter Cleaning Scheduled" 
              date="Today" 
              content="Contractors will be on-site this Friday to clean gutters. Please keep windows closed."
            />
            <AnnouncementItem 
              title="Rent Increase Notice" 
              date="2 days ago" 
              content="Please check your email for a notification regarding lease renewals for next year."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnnouncementItem({ title, date, content }: { title: string, date: string, content: string }) {
  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <div className="size-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center shrink-0">
        <AlertCircle className="h-5 w-5" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <p className="font-semibold">{title}</p>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{content}</p>
      </div>
    </div>
  );
}

import { FileText } from 'lucide-react';
