'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  History, 
  FileText, 
  ChevronLeft,
  Settings,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

interface Property {
  id: string;
  address: string;
  type: string;
  status: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
}

interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'owner' | 'tenant' | 'both';
  status: 'active' | 'inactive';
  address: string;
  joinedDate: string;
}

export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const fetchCustomerData = async () => {
    setIsLoading(true);
    try {
      // Mock data for UI development
      const mockCustomer: CustomerDetail = {
        id: id as string,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-0101',
        type: 'owner',
        status: 'active',
        address: '123 Main St, Springfield',
        joinedDate: '2023-01-15',
      };
      
      const mockProperties: Property[] = [
        { id: '1', address: '456 Oak Lane, Springfield', type: 'House', status: 'Rented' },
        { id: '2', address: '789 Skyline Blvd, Springfield', type: 'Condo', status: 'Vacant' },
      ];

      const mockDocuments: Document[] = [
        { id: '1', name: 'Management Agreement.pdf', type: 'Contract', date: '2023-01-15' },
        { id: '2', name: 'May 2024 Statement.pdf', type: 'Report', date: '2024-06-01' },
      ];

      setCustomer(mockCustomer);
      setProperties(mockProperties);
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Failed to fetch customer details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading customer details...</div>;
  }

  if (!customer) {
    return <div className="p-6 text-center text-destructive">Customer not found.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
            <Badge variant="outline" className="capitalize">{customer.type}</Badge>
            <Badge className={customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}>
              {customer.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground">Customer ID: {customer.id}</p>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" /> Manage Account
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{customer.address}</span>
            </div>
            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Member Since</p>
              <p>{customer.joinedDate}</p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="properties">
            <TabsList>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="billing">Billing & Payments</TabsTrigger>
              <TabsTrigger value="history">Activity Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="space-y-4 pt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {properties.map((property) => (
                  <Card key={property.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <Badge variant="outline">{property.status}</Badge>
                      </div>
                      <h4 className="font-bold">{property.address}</h4>
                      <p className="text-sm text-muted-foreground">{property.type}</p>
                      <Button variant="link" className="px-0 mt-2 h-auto" asChild>
                        <Link href={`/dashboard/properties/${property.id}`}>View Property Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Card className="border-dashed flex items-center justify-center py-10 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="text-center">
                    <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="font-medium">Assign Property</p>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4 pt-4">
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.type} • {doc.date}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" /> Upload New Document
              </Button>
            </TabsContent>

            <TabsContent value="billing" className="pt-4">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <CreditCard className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No recent billing activity.</p>
                  <Button variant="outline" className="mt-4">View All Invoices</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="pt-4">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <History className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Viewing activity history for {customer.name}.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
