'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Plus, 
  Search, 
  User, 
  Phone, 
  Mail, 
  Briefcase,
  Star,
  CheckCircle2,
  Clock,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Employee {
  id: string;
  name: string;
  role: 'maintenance' | 'cleaning' | 'pest-control' | 'admin' | 'handyman';
  status: 'active' | 'on-job' | 'off-duty';
  rating: number;
  phone: string;
  email: string;
  jobsCompleted: number;
}

const mockEmployees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Mike Fixit',
    role: 'maintenance',
    status: 'on-job',
    rating: 4.8,
    phone: '555-0101',
    email: 'mike@example.com',
    jobsCompleted: 145,
  },
  {
    id: 'EMP-002',
    name: 'Sarah Clean',
    role: 'cleaning',
    status: 'active',
    rating: 4.9,
    phone: '555-0102',
    email: 'sarah@example.com',
    jobsCompleted: 230,
  },
  {
    id: 'EMP-003',
    name: 'Jane Admin',
    role: 'admin',
    status: 'active',
    rating: 5.0,
    phone: '555-0100',
    email: 'jane@example.com',
    jobsCompleted: 0,
  },
  {
    id: 'EMP-004',
    name: 'Bob Handyman',
    role: 'handyman',
    status: 'off-duty',
    rating: 4.5,
    phone: '555-0104',
    email: 'bob@example.com',
    jobsCompleted: 88,
  },
];

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    'on-job': 'bg-blue-100 text-blue-700',
    'off-duty': 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">Manage employees, assignments, and performance.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Team Member
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, role..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockEmployees.map((emp) => (
          <Card key={emp.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div className="size-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-lg">
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem>Assign Task</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="mt-4 text-lg">{emp.name}</CardTitle>
              <CardDescription className="capitalize flex items-center">
                <Briefcase className="mr-1 h-3 w-3" /> {emp.role.replace('-', ' ')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="flex justify-between items-center py-2 border-y">
                <Badge className={statusColors[emp.status]}>
                  {emp.status.toUpperCase()}
                </Badge>
                <div className="flex items-center text-amber-500 text-sm font-bold">
                  <Star className="mr-1 h-3 w-3 fill-current" /> {emp.rating}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Phone className="mr-2 h-4 w-4" /> {emp.phone}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" /> {emp.email}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-muted-foreground">Jobs Completed</span>
                <span className="font-bold">{emp.jobsCompleted}</span>
              </div>
            </CardContent>
            <div className="bg-slate-50 p-2 border-t flex justify-center">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View Performance <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
