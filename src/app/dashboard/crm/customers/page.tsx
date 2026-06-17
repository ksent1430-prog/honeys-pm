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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, Search, MoreHorizontal, User, UserCheck, UserX } from 'lucide-react';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'owner' | 'tenant' | 'both';
  status: 'active' | 'inactive';
  propertyCount: number;
  lastServiceDate: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      // Mock data for UI development
      const mockCustomers: Customer[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-0101', type: 'owner', status: 'active', propertyCount: 5, lastServiceDate: '2024-05-20' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102', type: 'tenant', status: 'active', propertyCount: 1, lastServiceDate: '2024-06-01' },
        { id: '3', name: 'Robert Miller', email: 'robert@example.com', phone: '555-0103', type: 'owner', status: 'active', propertyCount: 12, lastServiceDate: '2024-05-15' },
        { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', phone: '555-0104', type: 'both', status: 'inactive', propertyCount: 2, lastServiceDate: '2023-12-10' },
      ];
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your property owners and tenants.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead>Last Service</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      Loading customers...
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/crm/customers/${customer.id}`} className="hover:underline flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div>
                            <div>{customer.name}</div>
                            <div className="text-xs font-normal text-muted-foreground">{customer.email}</div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="capitalize">{customer.type}</TableCell>
                      <TableCell>
                        {customer.status === 'active' ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex w-fit items-center gap-1">
                            <UserCheck className="h-3 w-3" /> Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex w-fit items-center gap-1">
                            <UserX className="h-3 w-3" /> Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{customer.propertyCount}</TableCell>
                      <TableCell>{customer.lastServiceDate}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/crm/customers/${customer.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
