'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Search, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MoreVertical,
  ChevronRight,
  User,
  Building2,
  Calendar,
  PenTool,
  History
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export default function ContractsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contract Management</h1>
          <p className="text-muted-foreground">Manage leases, service agreements, and vendor contracts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <History className="mr-2 h-4 w-4" /> Audit Log
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Contract
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Signed & active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Signature</CardTitle>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Awaiting stakeholder</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Within next 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Standardized formats</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Contracts</CardTitle>
                <CardDescription>Latest generated and updated contracts.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search contracts..." className="pl-8 h-9 w-48" />
                </div>
                <Button variant="outline" size="sm">Filter</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract Name</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <ContractRow 
                  name="Residential Lease - Unit 4B" 
                  party="Alice Green" 
                  type="Lease" 
                  status="active" 
                />
                <ContractRow 
                  name="Service Agreement - Cleaning" 
                  party="Sarah's Cleaning LLC" 
                  type="Vendor" 
                  status="pending-signature" 
                />
                <ContractRow 
                  name="Pest Control Annual Contract" 
                  party="EcoSafe Pest Control" 
                  type="Service" 
                  status="active" 
                />
                <ContractRow 
                  name="Commercial Lease - Suite 101" 
                  party="Tech Solutions Inc." 
                  type="Lease" 
                  status="expiring-soon" 
                />
                <ContractRow 
                  name="Employee Agreement - Mike Fixit" 
                  party="Mike Fixit" 
                  type="Employment" 
                  status="active" 
                />
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contract Templates</CardTitle>
            <CardDescription>Quickly generate new contracts from presets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TemplateItem 
              title="Standard Residential Lease" 
              description="Standard 12-month residential agreement." 
              category="Lease" 
            />
            <TemplateItem 
              title="Commercial Lease Agreement" 
              description="Full-service gross commercial lease." 
              category="Lease" 
            />
            <TemplateItem 
              title="Vendor Service Agreement" 
              description="Standard contract for third-party vendors." 
              category="Vendor" 
            />
            <TemplateItem 
              title="Employment Offer Letter" 
              description="Basic offer letter with terms & conditions." 
              category="HR" 
            />
            <Button variant="outline" className="w-full mt-2" asChild>
              <a href="/dashboard/contracts/templates">Manage All Templates</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expiring Contracts</CardTitle>
            <CardDescription>Items that require renewal or termination notice.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ExpiringItem 
                name="Maintenance Contract - HVAC" 
                date="June 30, 2024" 
                daysLeft={21} 
              />
              <ExpiringItem 
                name="Software Subscription - CRM" 
                date="July 15, 2024" 
                daysLeft={36} 
              />
              <ExpiringItem 
                name="Unit 1A - Lease Agreement" 
                date="June 15, 2024" 
                daysLeft={6} 
              />
            </div>
            <Button variant="link" className="w-full mt-4">View Renewal Calendar</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Signature Tracking</CardTitle>
            <CardDescription>Status of contracts currently out for signature.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SignatureItem 
                name="Management Agreement - Oakwood" 
                party="John Smith (Owner)" 
                status="sent" 
                sentDate="June 8" 
              />
              <SignatureItem 
                name="Pool Maintenance Service" 
                party="Clearwater Pools" 
                status="viewed" 
                sentDate="June 7" 
              />
              <SignatureItem 
                name="Lease Addendum - Unit 12" 
                party="Robert Miller" 
                status="signed" 
                sentDate="June 6" 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ContractRow({ name, party, type, status }: { 
  name: string, 
  party: string, 
  type: string, 
  status: 'active' | 'pending-signature' | 'expiring-soon' | 'void' 
}) {
  const statusStyles = {
    active: 'bg-emerald-100 text-emerald-700',
    'pending-signature': 'bg-blue-100 text-blue-700',
    'expiring-soon': 'bg-amber-100 text-amber-700',
    void: 'bg-slate-100 text-slate-700',
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell className="text-sm">{party}</TableCell>
      <TableCell className="text-sm">{type}</TableCell>
      <TableCell>
        <Badge className={`capitalize ${statusStyles[status]}`} variant="secondary">
          {status.replace('-', ' ')}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function TemplateItem({ title, description, category }: { 
  title: string, 
  description: string, 
  category: string 
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors">
      <div className="space-y-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
      </div>
      <Badge variant="outline" className="text-[10px] uppercase font-bold">{category}</Badge>
    </div>
  );
}

function ExpiringItem({ name, date, daysLeft }: { 
  name: string, 
  date: string, 
  daysLeft: number 
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${daysLeft < 10 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
          <AlertCircle className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">Expires on {date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${daysLeft < 10 ? 'text-rose-600' : ''}`}>{daysLeft} days</p>
        <p className="text-[10px] text-muted-foreground uppercase font-semibold">Remaining</p>
      </div>
    </div>
  );
}

function SignatureItem({ name, party, status, sentDate }: { 
  name: string, 
  party: string, 
  status: 'sent' | 'viewed' | 'signed', 
  sentDate: string 
}) {
  const statusIcon = {
    sent: <Clock className="h-4 w-4 text-blue-500" />,
    viewed: <Search className="h-4 w-4 text-amber-500" />,
    signed: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 rounded-full">
          {statusIcon[status]}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{party} • Sent {sentDate}</p>
        </div>
      </div>
      <Badge variant="outline" className="capitalize">{status}</Badge>
    </div>
  );
}
