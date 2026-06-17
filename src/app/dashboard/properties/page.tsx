'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  MapPin, 
  Home, 
  User, 
  MoreVertical,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Property {
  id: string;
  name: string;
  address: string;
  type: string; // Residential, Commercial, Multi-family
  status: 'occupied' | 'vacant' | 'maintenance';
  units: number;
  owner: string;
  thumbnail: string;
}

const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Oakwood Apartments',
    address: '123 Oak St, Springfield',
    type: 'Multi-family',
    status: 'occupied',
    units: 12,
    owner: 'John Smith',
    thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    name: 'Sunset Villa',
    address: '456 Palm Dr, Springfield',
    type: 'Residential',
    status: 'occupied',
    units: 1,
    owner: 'Sarah Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '3',
    name: 'Downtown Commercial Hub',
    address: '789 Main St, Springfield',
    type: 'Commercial',
    status: 'maintenance',
    units: 5,
    owner: 'Business Corp LLC',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '4',
    name: 'Riverview Condo',
    address: '101 River Rd, Springfield',
    type: 'Residential',
    status: 'vacant',
    units: 1,
    owner: 'Michael Brown',
    thumbnail: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=400',
  },
];

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProperties = mockProperties.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage your real estate portfolio.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/properties/new">
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden group">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={property.thumbnail} 
                alt={property.name} 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <Badge className={
                  property.status === 'occupied' ? 'bg-green-500' : 
                  property.status === 'vacant' ? 'bg-amber-500' : 'bg-blue-500'
                }>
                  {property.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg leading-tight mb-1">
                    <Link href={`/dashboard/properties/${property.id}`} className="hover:underline">
                      {property.name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="flex items-center text-xs">
                    <MapPin className="mr-1 h-3 w-3" /> {property.address}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/properties/${property.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Property</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm space-y-3">
              <div className="grid grid-cols-2 gap-2 pt-2 border-t mt-2">
                <div className="flex items-center text-muted-foreground">
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>{property.type}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Home className="mr-2 h-4 w-4" />
                  <span>{property.units} Units</span>
                </div>
              </div>
              <div className="flex items-center text-muted-foreground">
                <User className="mr-2 h-4 w-4" />
                <span>Owner: {property.owner}</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between gap-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href={`/dashboard/work-orders?propertyId=${property.id}`}>
                  Work Orders
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Leases
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No properties found</h3>
          <p className="text-muted-foreground">Try adjusting your search or add a new property.</p>
          <Button className="mt-4" onClick={() => setSearchTerm('')}>Clear Search</Button>
        </div>
      )}
    </div>
  );
}
