'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  MapPin, 
  Building2, 
  Users, 
  Wrench, 
  FileText, 
  DollarSign,
  Plus,
  Edit,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  // Mock property data
  const property = {
    id,
    name: 'Oakwood Apartments',
    address: '123 Oak St, Springfield, IL 62704',
    type: 'Multi-family',
    status: 'occupied',
    units: 12,
    owner: 'John Smith',
    ownerId: 'owner-1',
    yearBuilt: 1995,
    lastInspected: '2023-11-15',
    monthlyRevenue: 15400,
    occupancyRate: 92,
    description: 'Beautiful 12-unit complex with shared courtyard and modern amenities.',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{property.name}</h1>
            <Badge className="bg-green-500">{property.status.toUpperCase()}</Badge>
          </div>
          <p className="text-muted-foreground flex items-center">
            <MapPin className="mr-1 h-4 w-4" /> {property.address}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Generate Report</DropdownMenuItem>
              <DropdownMenuItem>View Owner Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Archive Property</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Occupancy" value={`${property.occupancyRate}%`} icon={<Users className="h-4 w-4" />} />
        <MetricCard title="Units" value={property.units.toString()} icon={<Building2 className="h-4 w-4" />} />
        <MetricCard title="Monthly Rev" value={`$${property.monthlyRevenue.toLocaleString()}`} icon={<DollarSign className="h-4 w-4" />} />
        <MetricCard title="Open Jobs" value="3" icon={<Wrench className="h-4 w-4" />} />
      </div>

      <Tabs defaultValue="units" className="space-y-4">
        <TabsList>
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
        </TabsList>

        <TabsContent value="units" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Individual Units</h3>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Unit</Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { num: '1A', type: '2B/1B', rent: 1200, status: 'Occupied', tenant: 'Alice Green' },
                  { num: '1B', type: '1B/1B', rent: 950, status: 'Vacant', tenant: '-' },
                  { num: '2A', type: '2B/2B', rent: 1400, status: 'Occupied', tenant: 'Bob Smith' },
                  { num: '2B', type: '2B/2B', rent: 1400, status: 'Maintenance', tenant: '-' },
                ].map((unit) => (
                  <TableRow key={unit.num}>
                    <TableCell className="font-medium">{unit.num}</TableCell>
                    <TableCell>{unit.type}</TableCell>
                    <TableCell>${unit.rent}</TableCell>
                    <TableCell>
                      <Badge variant={unit.status === 'Occupied' ? 'default' : 'secondary'}>
                        {unit.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{unit.tenant}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Manage</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Maintenance History</h3>
            <Button size="sm" asChild>
              <Link href={`/dashboard/work-orders/new?propertyId=${id}`}>
                <Plus className="mr-2 h-4 w-4" /> New Work Order
              </Link>
            </Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: 'WO-1234', title: 'Leaking Sink (1A)', priority: 'High', status: 'In Progress', date: '2024-06-05' },
                  { id: 'WO-1235', title: 'AC Filter Change (2B)', priority: 'Low', status: 'Completed', date: '2024-06-01' },
                ].map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-mono text-xs">{job.id}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>
                      <Badge variant={job.priority === 'High' ? 'destructive' : 'outline'}>{job.priority}</Badge>
                    </TableCell>
                    <TableCell>{job.status}</TableCell>
                    <TableCell>{job.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/work-orders/${job.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="tenants">
           <Card className="p-12 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Active tenant list loading...</p>
           </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DocumentCard title="Lease Agreement Template" type="PDF" size="1.2 MB" />
            <DocumentCard title="Insurance Policy 2024" type="PDF" size="4.5 MB" />
            <DocumentCard title="Property Survey" type="JPG" size="12 MB" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
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

function DocumentCard({ title, type, size }: { title: string, type: string, size: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="bg-primary/10 p-2 rounded text-primary">
          <FileText className="h-6 w-6" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-medium truncate">{title}</p>
          <p className="text-xs text-muted-foreground">{type} • {size}</p>
        </div>
        <Button variant="ghost" size="icon">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

import Link from 'next/link';
