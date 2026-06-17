'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  MessageSquare, 
  History, 
  FileText, 
  ChevronLeft,
  Edit
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { LeadForm } from '../../components/lead-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Note {
  id: string;
  content: string;
  createdAt: string;
  author: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
}

interface LeadDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  type: string;
  message: string;
  createdAt: string;
}

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    fetchLeadData();
  }, [id]);

  const fetchLeadData = async () => {
    setIsLoading(true);
    try {
      // Mock data for UI development
      const mockLead: LeadDetail = {
        id: id as string,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '555-0101',
        status: 'contacted',
        source: 'website',
        type: 'owner',
        message: 'Interested in management for 3 units in Springfield.',
        createdAt: '2024-06-01',
      };
      
      const mockNotes: Note[] = [
        { id: '1', content: 'Called Alice, she was busy. Scheduled a callback for tomorrow.', createdAt: '2024-06-02 10:00', author: 'John Admin' },
        { id: '2', content: 'Discussed pricing tiers. She is leaning towards the Professional plan.', createdAt: '2024-06-03 14:30', author: 'John Admin' },
      ];

      const mockActivities: Activity[] = [
        { id: '1', type: 'email', description: 'Sent introduction email', createdAt: '2024-06-01 09:15' },
        { id: '2', type: 'status_change', description: 'Status changed from New to Contacted', createdAt: '2024-06-02 10:05' },
        { id: '3', type: 'call', description: 'Outbound call - No answer', createdAt: '2024-06-02 10:00' },
      ];

      setLead(mockLead);
      setNotes(mockNotes);
      setActivities(mockActivities);
    } catch (error) {
      console.error('Failed to fetch lead details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLead = async (data: any) => {
    try {
      await apiClient.put(`/api/leads/${id}`, data);
      setIsEditOpen(false);
      fetchLeadData();
    } catch (error) {
      console.error('Failed to update lead:', error);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading lead details...</div>;
  }

  if (!lead) {
    return <div className="p-6 text-center text-destructive">Lead not found.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{lead.name}</h1>
            <Badge variant="outline" className="capitalize">{lead.status}</Badge>
            <Badge variant="secondary" className="capitalize">{lead.type}</Badge>
          </div>
          <p className="text-muted-foreground">Lead ID: {lead.id}</p>
        </div>
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" /> Edit Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Lead</DialogTitle>
            </DialogHeader>
            <LeadForm initialData={lead} onSubmit={handleUpdateLead} />
          </DialogContent>
        </Dialog>
        <Button>Convert to Customer</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{lead.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{lead.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Created: {lead.createdAt}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Source: <span className="capitalize">{lead.source}</span></span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Original Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic text-muted-foreground">
                "{lead.message || 'No initial message provided.'}"
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="timeline">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="history">Service History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="space-y-4 pt-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4 p-4 rounded-lg border bg-card relative">
                  <div className="mt-1">
                    {activity.type === 'email' && <Mail className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'call' && <Phone className="h-4 w-4 text-green-500" />}
                    {activity.type === 'status_change' && <History className="h-4 w-4 text-amber-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.createdAt}</p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Internal Notes</h3>
                <Button size="sm">Add Note</Button>
              </div>
              {notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="pt-6">
                    <p className="text-sm mb-4">{note.content}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>By {note.author}</span>
                      <span>{note.createdAt}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="history" className="pt-4 text-center py-10 border rounded-lg bg-muted/20">
              <History className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No service history available for this lead.</p>
              <p className="text-xs text-muted-foreground mt-1">History is created once converted to a customer.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
