'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Home, User, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyAddress: string;
  leaseEnd: string;
  balance: number;
  status: 'current' | 'past' | 'pending';
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setIsLoading(true);
    try {
      // Mock data
      const mockTenants: Tenant[] = [
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102', propertyAddress: '456 Oak Lane, Springfield', leaseEnd: '2025-06-01', balance: 0, status: 'current' },
        { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', phone: '555-0104', propertyAddress: '789 Skyline Blvd, #402', leaseEnd: '2024-11-30', balance: 150, status: 'current' },
        { id: '6', name: 'Michael Brown', email: 'michael@example.com', phone: '555-0106', propertyAddress: '101 Heritage Sq', leaseEnd: '2024-08-15', balance: 0, status: 'pending' },
      ];
      setTenants(mockTenants);
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTenants = tenants.filter((tenant) => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
          <p className="text-muted-foreground">Manage your property residents and leases.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${tenants.reduce((acc, curr) => acc + curr.balance, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Renewals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants or addresses..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Lease End</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading...</TableCell>
                  </TableRow>
                ) : filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/crm/customers/${tenant.id}`} className="hover:underline flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{tenant.name}</div>
                          <div className="text-xs font-normal text-muted-foreground">{tenant.phone}</div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Home className="h-3 w-3 text-muted-foreground" />
                        {tenant.propertyAddress}
                      </div>
                    </TableCell>
                    <TableCell>{tenant.leaseEnd}</TableCell>
                    <TableCell>
                      <span className={tenant.balance > 0 ? 'text-destructive font-bold' : ''}>
                        ${tenant.balance.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tenant.status === 'current' ? 'outline' : 'secondary'} className={tenant.status === 'current' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}>
                        {tenant.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/crm/customers/${tenant.id}`}>View Profile</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
