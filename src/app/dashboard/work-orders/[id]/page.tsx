'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  Wrench, 
  Clock, 
  MapPin, 
  User, 
  Calendar as CalendarIcon, 
  AlertTriangle,
  MessageSquare,
  History,
  Camera,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface WorkOrder {
  id: string;
  title: string;
  type: string;
  status: 'new' | 'assigned' | 'scheduled' | 'in-progress' | 'completed' | 'closed';
  priority: string;
  description: string;
  propertyAddress: string;
  propertyId: string;
  assignedTo?: string;
  assignedId?: string;
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface LogEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

export default function WorkOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchWorkOrder();
  }, [id]);

  const fetchWorkOrder = async () => {
    setIsLoading(true);
    try {
      // Mock data
      const mockOrder: WorkOrder = {
        id: id as string,
        title: 'Leaking Faucet in Kitchen',
        type: 'maintenance',
        status: 'assigned',
        priority: 'high',
        description: 'The kitchen faucet is dripping constantly, causing water waste and noise. Tenant reports it started yesterday.',
        propertyAddress: '123 Oak St, Apt 4B, Springfield',
        propertyId: 'prop-1',
        assignedTo: 'Mike Fixit',
        assignedId: 'emp-1',
        createdAt: '2024-06-05 10:00',
        updatedAt: '2024-06-06 14:20',
      };
      setWorkOrder(mockOrder);
    } catch (error) {
      console.error('Failed to fetch work order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await apiClient.put(`/api/work-orders/${id}`, { status: newStatus });
      setWorkOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssign = async (employeeId: string) => {
    setIsUpdating(true);
    try {
      // In real app, get name from employees list
      const employeeName = employeeId === 'emp-1' ? 'Mike Fixit' : 'John Tech';
      await apiClient.put(`/api/work-orders/${id}`, { assignedId: employeeId });
      setWorkOrder(prev => prev ? { ...prev, assignedId: employeeId, assignedTo: employeeName, status: 'assigned' } : null);
    } catch (error) {
      console.error('Failed to assign:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading work order...</div>;
  if (!workOrder) return <div className="p-10 text-center text-destructive">Work order not found.</div>;

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    assigned: 'bg-purple-100 text-purple-700',
    scheduled: 'bg-orange-100 text-orange-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    closed: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{workOrder.title}</h1>
            <Badge className={statusColors[workOrder.status]}>{workOrder.status.toUpperCase()}</Badge>
          </div>
          <p className="text-muted-foreground font-mono text-sm">Order ID: {workOrder.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" /> Message Tenant
          </Button>
          <Button variant="outline" className="text-destructive hover:bg-destructive/10">
            Close Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{workOrder.description}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="photos">
            <TabsList>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="history">History / Logs</TabsTrigger>
              <TabsTrigger value="notes">Internal Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="photos" className="pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed cursor-pointer hover:bg-muted/80 transition-colors">
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <span className="text-xs font-medium">Add Photo</span>
                  </div>
                </div>
                {/* Photo Placeholders */}
                {[1, 2].map((i) => (
                  <div key={i} className="aspect-square bg-slate-200 rounded-lg overflow-hidden relative group">
                    <img src={`https://placehold.co/400?text=Issue+Photo+${i}`} alt="Issue" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="history" className="pt-4">
              <div className="space-y-4">
                <HistoryItem 
                  action="Status changed to Assigned" 
                  user="Admin User" 
                  time="2024-06-06 14:20" 
                  details="Assigned to Mike Fixit" 
                />
                <HistoryItem 
                  action="Work order created" 
                  user="Tenant (Alice)" 
                  time="2024-06-05 10:00" 
                />
              </div>
            </TabsContent>
            <TabsContent value="notes" className="pt-4 space-y-4">
              <div className="space-y-2">
                <Textarea 
                  placeholder="Add an internal note..." 
                  value={newNote} 
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button disabled={!newNote}>Add Note</Button>
              </div>
              <div className="space-y-4">
                <Card className="bg-slate-50">
                  <CardContent className="pt-4">
                    <p className="text-sm">Verified with tenant that leak is only occurring when faucet is turned on. Likely a gasket issue.</p>
                    <p className="text-xs text-muted-foreground mt-2">By John Admin • Today at 09:15</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Sidebar Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Update Status</label>
                <Select value={workOrder.status} onValueChange={handleStatusChange} disabled={isUpdating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Assign Technician</label>
                <Select value={workOrder.assignedId || 'unassigned'} onValueChange={handleAssign} disabled={isUpdating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="emp-1">Mike Fixit (Maintenance)</SelectItem>
                    <SelectItem value="emp-2">Clean Team (Cleaning)</SelectItem>
                    <SelectItem value="emp-3">John Tech (Handyman)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Priority</label>
                <Badge className="block w-fit" variant={workOrder.priority === 'emergency' ? 'destructive' : 'default'}>
                  {workOrder.priority.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">{workOrder.propertyAddress}</p>
                  <Link href={`/dashboard/properties/${workOrder.propertyId}`} className="text-primary hover:underline text-xs">
                    View Property Details
                  </Link>
                </div>
              </div>
              <div className="flex gap-3">
                <User className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Alice Tenant</p>
                  <p className="text-xs text-muted-foreground">Tenant Contact</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted</span>
                <span>{workOrder.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{workOrder.updatedAt}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-muted-foreground">Scheduled</span>
                <span className={workOrder.scheduledDate ? '' : 'italic text-muted-foreground'}>
                  {workOrder.scheduledDate || 'Not yet scheduled'}
                </span>
              </div>
              {!workOrder.scheduledDate && (
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <CalendarIcon className="mr-2 h-4 w-4" /> Schedule Visit
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function HistoryItem({ action, user, time, details }: { action: string, user: string, time: string, details?: string }) {
  return (
    <div className="flex gap-3 relative pb-6 last:pb-0">
      <div className="absolute left-[9px] top-5 bottom-0 w-0.5 bg-slate-200 last:hidden" />
      <div className="size-5 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center z-10">
        <div className="size-1.5 rounded-full bg-slate-500" />
      </div>
      <div>
        <p className="text-sm font-semibold">{action}</p>
        <p className="text-xs text-muted-foreground">{user} • {time}</p>
        {details && <p className="text-xs mt-1 bg-slate-50 p-2 rounded border">{details}</p>}
      </div>
    </div>
  );
}
