'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Calendar, 
  ClipboardCheck, 
  MapPin, 
  User,
  MoreVertical,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface Inspection {
  id: string;
  property: string;
  type: 'move-in' | 'move-out' | 'routine' | 'annual';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  inspector: string;
  date: string;
  time: string;
}

const mockInspections: Inspection[] = [
  {
    id: 'INS-1001',
    property: 'Oakwood Apartments, Unit 1A',
    type: 'routine',
    status: 'scheduled',
    inspector: 'Dave Inspector',
    date: '2024-06-15',
    time: '10:00 AM',
  },
  {
    id: 'INS-1002',
    property: 'Sunset Villa',
    type: 'move-out',
    status: 'completed',
    inspector: 'Jane Smith',
    date: '2024-06-01',
    time: '02:00 PM',
  },
  {
    id: 'INS-1003',
    property: 'Downtown Commercial Hub',
    type: 'annual',
    status: 'in-progress',
    inspector: 'Dave Inspector',
    date: '2024-06-07',
    time: '09:00 AM',
  },
];

export default function InspectionsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inspections</h1>
          <p className="text-muted-foreground">Schedule and manage property inspections.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/inspections/new">
            <Plus className="mr-2 h-4 w-4" /> Schedule Inspection
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inspections..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" /> Calendar View
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" /> Export All
          </Button>
        </div>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Inspector</TableHead>
              <TableHead>Scheduled Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInspections.map((inspection) => (
              <TableRow key={inspection.id}>
                <TableCell className="font-mono text-xs font-medium">
                  {inspection.id}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{inspection.property}</div>
                </TableCell>
                <TableCell>
                  <span className="capitalize">{inspection.type.replace('-', ' ')}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="size-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold">
                      {inspection.inspector.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span>{inspection.inspector}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs">
                    <span className="font-medium">{inspection.date}</span>
                    <span className="text-muted-foreground">{inspection.time}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[inspection.status]}>
                    {inspection.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/inspections/${inspection.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Reschedule</DropdownMenuItem>
                      {inspection.status === 'completed' && (
                        <DropdownMenuItem>Download PDF Report</DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Scheduled this week" 
          value="8" 
          subtitle="+2 from last week" 
          icon={<Calendar className="h-5 w-5 text-blue-500" />} 
        />
        <StatsCard 
          title="Pending Reports" 
          value="3" 
          subtitle="Awaiting inspector upload" 
          icon={<Clock className="h-5 w-5 text-amber-500" />} 
        />
        <StatsCard 
          title="Completion Rate" 
          value="98%" 
          subtitle="Last 30 days" 
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />} 
        />
      </div>
    </div>
  );
}

function StatsCard({ title, value, subtitle, icon }: { title: string, value: string, subtitle: string, icon: React.ReactNode }) {
  return (
    <Card className="bg-white">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-slate-50 p-2 rounded-lg">{icon}</div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from '@/components/ui/card';
