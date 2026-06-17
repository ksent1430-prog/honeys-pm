'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building2, 
  Calendar, 
  Clock, 
  Plus, 
  Search,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Briefcase,
  MapPin,
  DollarSign
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

export default function TempStaffingPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Temp Staffing Services</h1>
          <p className="text-muted-foreground">Manage external workers, client businesses, and active assignments.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Schedule
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Assignment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">Ready for assignment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">Across 8 client sites</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active service contracts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$18,450</div>
            <p className="text-xs text-muted-foreground">+5.4% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Active Assignments</CardTitle>
                <CardDescription>Current worker placements at client locations.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-8 h-9 w-48" />
                </div>
                <Button variant="outline" size="sm">Filter</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead>Client Business</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AssignmentRow 
                  worker="Alex Johnson" 
                  client="Springfield General Hospital" 
                  position="Temp Admin" 
                  endDate="June 30, 2024" 
                  status="ongoing" 
                />
                <AssignmentRow 
                  worker="Maria Garcia" 
                  client="TechSolutions Inc." 
                  position="Front Desk" 
                  endDate="June 15, 2024" 
                  status="ending-soon" 
                />
                <AssignmentRow 
                  worker="Robert Taylor" 
                  client="Downtown Retail Hub" 
                  position="Stock Clerk" 
                  endDate="July 10, 2024" 
                  status="ongoing" 
                />
                <AssignmentRow 
                  worker="Sarah Williams" 
                  client="City Library" 
                  position="Cataloguer" 
                  endDate="June 10, 2024" 
                  status="overdue" 
                />
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Worker Availability</CardTitle>
            <CardDescription>Recently updated worker statuses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <WorkerStatusItem 
              name="Kevin Smith" 
              skills="Admin, Data Entry" 
              status="available" 
            />
            <WorkerStatusItem 
              name="Linda Chen" 
              skills="Customer Service, Sales" 
              status="available" 
            />
            <WorkerStatusItem 
              name="Michael Brown" 
              skills="General Labor, Warehouse" 
              status="unavailable" 
            />
            <WorkerStatusItem 
              name="Emily Davis" 
              skills="Cleaning, Housekeeping" 
              status="available" 
            />
            <Button variant="outline" className="w-full mt-2">View Worker Directory</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Temp Invoices</CardTitle>
            <CardDescription>Invoices for temp services awaiting client payment.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <TempInvoiceItem 
                client="Springfield Hospital" 
                amount={4250.00} 
                hours={120} 
                dueDate="June 15" 
              />
              <TempInvoiceItem 
                client="TechSolutions Inc." 
                amount={2100.00} 
                hours={40} 
                dueDate="June 10" 
              />
              <TempInvoiceItem 
                client="Downtown Retail Hub" 
                amount={3500.00} 
                hours={85} 
                dueDate="June 20" 
              />
            </div>
            <Button variant="link" className="w-full mt-4">Manage All Invoices</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Client Businesses</CardTitle>
            <CardDescription>Most active clients by assignment volume.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ClientItem 
                name="Springfield General Hospital" 
                activeAssignments={5} 
                revenue={8500} 
              />
              <ClientItem 
                name="Downtown Retail Hub" 
                activeAssignments={3} 
                revenue={4200} 
              />
              <ClientItem 
                name="TechSolutions Inc." 
                activeAssignments={2} 
                revenue={3100} 
              />
              <ClientItem 
                name="City Library" 
                activeAssignments={1} 
                revenue={1200} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AssignmentRow({ worker, client, position, endDate, status }: { 
  worker: string, 
  client: string, 
  position: string, 
  endDate: string, 
  status: 'ongoing' | 'ending-soon' | 'overdue' 
}) {
  const statusStyles = {
    ongoing: 'bg-emerald-100 text-emerald-700',
    'ending-soon': 'bg-amber-100 text-amber-700',
    overdue: 'bg-rose-100 text-rose-700',
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{worker}</TableCell>
      <TableCell className="text-sm">{client}</TableCell>
      <TableCell className="text-sm">{position}</TableCell>
      <TableCell className="text-sm">{endDate}</TableCell>
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

function WorkerStatusItem({ name, skills, status }: { 
  name: string, 
  skills: string, 
  status: 'available' | 'unavailable' 
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="space-y-1">
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground">{skills}</p>
      </div>
      <Badge variant={status === 'available' ? 'default' : 'secondary'} className={status === 'available' ? 'bg-emerald-500' : ''}>
        {status.toUpperCase()}
      </Badge>
    </div>
  );
}

function TempInvoiceItem({ client, amount, hours, dueDate }: { 
  client: string, 
  amount: number, 
  hours: number, 
  dueDate: string 
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="size-10 bg-slate-100 rounded-lg flex items-center justify-center">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">{client}</p>
          <p className="text-xs text-muted-foreground">{hours} hrs • Due {dueDate}</p>
        </div>
      </div>
      <div className="text-sm font-bold text-right">
        {amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      </div>
    </div>
  );
}

function ClientItem({ name, activeAssignments, revenue }: { 
  name: string, 
  activeAssignments: number, 
  revenue: number 
}) {
  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Building2 className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{activeAssignments} Active Assignments</p>
        </div>
      </div>
      <div className="text-xs font-bold">
        {revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      </div>
    </div>
  );
}
