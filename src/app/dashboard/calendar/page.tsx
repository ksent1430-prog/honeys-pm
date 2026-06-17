'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Filter,
  CheckCircle2,
  Clock,
  Wrench,
  ClipboardCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Simplified calendar logic
  const daysInMonth = 30; // Mock
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const mockEvents = [
    { day: 5, type: 'work-order', title: 'Leaking Sink', status: 'assigned' },
    { day: 7, type: 'inspection', title: 'Annual - Downtown', status: 'in-progress' },
    { day: 15, type: 'inspection', title: 'Routine - Oakwood', status: 'scheduled' },
    { day: 15, type: 'work-order', title: 'AC Repair', status: 'new' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master Calendar</h1>
          <p className="text-muted-foreground">View all scheduled appointments and tasks.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar / Filters */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="size-3 bg-blue-500 rounded-full" />
                <span className="text-sm">Inspections</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 bg-orange-500 rounded-full" />
                <span className="text-sm">Maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 bg-green-500 rounded-full" />
                <span className="text-sm">Move-in / Move-out</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 bg-purple-500 rounded-full" />
                <span className="text-sm">Lease Renewals</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 border-l-4 border-orange-500 pl-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold">AC Filter Change</p>
                  <p className="text-xs text-muted-foreground">Sunset Villa • 02:00 PM</p>
                </div>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex gap-3 border-l-4 border-blue-500 pl-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold">Move-in Inspection</p>
                  <p className="text-xs text-muted-foreground">Unit 4B • 04:30 PM</p>
                </div>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <CardTitle>June 2024</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm">Today</Button>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-b">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="p-2 text-center text-xs font-semibold text-muted-foreground border-r last:border-r-0">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 border-b">
                {/* Placeholder empty days at start */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[120px] bg-slate-50/50 border-r border-b last:border-r-0" />
                ))}
                {days.map((day) => {
                  const dayEvents = mockEvents.filter(e => e.day === day);
                  return (
                    <div key={day} className="min-h-[120px] p-2 border-r border-b last:border-r-0 hover:bg-slate-50/50 transition-colors">
                      <span className="text-sm font-medium">{day}</span>
                      <div className="mt-1 space-y-1">
                        {dayEvents.map((event, idx) => (
                          <div 
                            key={idx} 
                            className={`text-[10px] p-1 rounded border-l-2 truncate ${
                              event.type === 'inspection' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-orange-50 border-orange-500 text-orange-700'
                            }`}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {/* Placeholder empty days at end */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`empty-end-${i}`} className="min-h-[120px] bg-slate-50/50 border-r border-b last:border-r-0" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
