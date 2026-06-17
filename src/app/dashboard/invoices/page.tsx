'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Plus, 
  Search, 
  DollarSign, 
  FileText, 
  Download,
  Filter,
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertTriangle
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

interface Invoice {
  id: string;
  customer: string;
  property: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  dueDate: string;
  createdAt: string;
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-2024-001',
    customer: 'Alice Green',
    property: 'Oakwood Apts, 1A',
    amount: 1200,
    status: 'paid',
    dueDate: '2024-06-01',
    createdAt: '2024-05-25',
  },
  {
    id: 'INV-2024-002',
    customer: 'John Smith (Owner)',
    property: 'Oakwood Apts',
    amount: 1540,
    status: 'pending',
    dueDate: '2024-06-15',
    createdAt: '2024-06-05',
  },
  {
    id: 'INV-2024-003',
    customer: 'Sarah Johnson',
    property: 'Sunset Villa',
    amount: 2800,
    status: 'overdue',
    dueDate: '2024-06-01',
    createdAt: '2024-05-20',
  },
];

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const statusColors = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-blue-100 text-blue-700',
    overdue: 'bg-red-100 text-red-700',
    draft: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices & Billing</h1>
          <p className="text-muted-foreground">Track revenue, payments, and outstanding balances.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Paid (MTD)" value="$12,400" icon={<CheckCircle2 className="h-4 w-4" />} color="text-green-600" />
        <MetricCard title="Outstanding" value="$8,250" icon={<Clock className="h-4 w-4" />} color="text-blue-600" />
        <MetricCard title="Overdue" value="$2,800" icon={<AlertTriangle className="h-4 w-4" />} color="text-red-600" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices, customers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer / Property</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono text-xs font-medium">{invoice.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{invoice.customer}</span>
                    <span className="text-xs text-muted-foreground">{invoice.property}</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">${invoice.amount.toLocaleString()}</TableCell>
                <TableCell className="text-xs">{invoice.dueDate}</TableCell>
                <TableCell>
                  <Badge className={statusColors[invoice.status]}>
                    {invoice.status.toUpperCase()}
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
                      <DropdownMenuItem>View PDF</DropdownMenuItem>
                      <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                      <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Void Invoice</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={color}>{icon}</div>
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
