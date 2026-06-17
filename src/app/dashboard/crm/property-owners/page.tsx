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
import { Search, Building2, User } from 'lucide-react';
import Link from 'next/link';

interface PropertyOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyCount: number;
  totalRevenue: number;
  status: 'active' | 'inactive';
}

export default function PropertyOwnersPage() {
  const [owners, setOwners] = useState<PropertyOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    setIsLoading(true);
    try {
      // Mock data
      const mockOwners: PropertyOwner[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-0101', propertyCount: 5, totalRevenue: 12500, status: 'active' },
        { id: '3', name: 'Robert Miller', email: 'robert@example.com', phone: '555-0103', propertyCount: 12, totalRevenue: 34200, status: 'active' },
        { id: '5', name: 'Emily Davis', email: 'emily@example.com', phone: '555-0105', propertyCount: 2, totalRevenue: 4800, status: 'active' },
      ];
      setOwners(mockOwners);
    } catch (error) {
      console.error('Failed to fetch owners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOwners = owners.filter((owner) => 
    owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Owners</h1>
          <p className="text-muted-foreground">Manage relationships with your property landlords.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Owners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{owners.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {owners.reduce((acc, curr) => acc + curr.propertyCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Portfolio Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(owners.reduce((acc, curr) => acc + curr.propertyCount, 0) / (owners.length || 1)).toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search owners..."
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
                  <TableHead>Contact</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead>Total Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading...</TableCell>
                  </TableRow>
                ) : filteredOwners.map((owner) => (
                  <TableRow key={owner.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/crm/customers/${owner.id}`} className="hover:underline flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        {owner.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{owner.email}</div>
                      <div className="text-xs text-muted-foreground">{owner.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        {owner.propertyCount}
                      </div>
                    </TableCell>
                    <TableCell>${owner.totalRevenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {owner.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/crm/customers/${owner.id}`}>View Profile</Link>
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
