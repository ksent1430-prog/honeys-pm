'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Clock, 
  Plus, 
  Search,
  UserPlus,
  CheckCircle2,
  XCircle,
  MoreVertical,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { apiClient } from '@/lib/api-client';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  status: string;
  applicants_count?: number;
}

interface Applicant {
  id: string;
  job_id: string;
  job_title: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  created_at: string;
}

interface Timesheet {
  id: string;
  user_id: string;
  user_name: string;
  total_hours: number;
  period_start: string;
  period_end: string;
  status: string;
}

export default function HRPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [jobsRes, applicantsRes, timesheetsRes] = await Promise.all([
          apiClient.get<Job[]>('/api/hr/jobs'),
          apiClient.get<Applicant[]>('/api/hr/applications'),
          apiClient.get<Timesheet[]>('/api/hr/timesheets?status=PENDING')
        ]);
        
        setJobs(jobsRes || []);
        setApplicants(applicantsRes || []);
        setTimesheets(timesheetsRes || []);
      } catch (error) {
        console.error('Failed to fetch HR data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeJobs = jobs.filter(j => j.status === 'ACTIVE' || j.status === 'OPEN');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR & Recruiting</h1>
          <p className="text-muted-foreground">Manage job postings, applicants, and employee operations.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Reports
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Job Posting
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Across 5 departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Job Postings</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs.length}</div>
            <p className="text-xs text-muted-foreground">{jobs.length - activeJobs.length} drafts / filled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applicants.length}</div>
            <p className="text-xs text-muted-foreground">Across all open roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Timesheets</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timesheets.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Applicants</CardTitle>
                <CardDescription>Latest candidates for open positions.</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            {applicants.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Applied For</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicants.slice(0, 5).map((applicant) => (
                    <ApplicantRow 
                      key={applicant.id}
                      name={`${applicant.first_name} ${applicant.last_name}`} 
                      email={applicant.email} 
                      position={applicant.job_title || 'Unknown Position'} 
                      date={new Date(applicant.created_at).toLocaleDateString()} 
                      status={applicant.status.toLowerCase() as any} 
                    />
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                No applicants found.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
            <CardDescription>Currently recruiting for these roles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeJobs.length > 0 ? (
              activeJobs.slice(0, 4).map((job) => (
                <ActiveJobItem 
                  key={job.id}
                  title={job.title} 
                  location={job.location || 'Springfield'} 
                  applicants={0} // Job count could be integrated
                  isUrgent={false} 
                />
              ))
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No active job postings.
              </div>
            )}
            <Button variant="outline" className="w-full mt-2">Manage All Jobs</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Timesheet Approvals</CardTitle>
            <CardDescription>Approve or review submitted hours for the current pay period.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timesheets.length > 0 ? (
                timesheets.slice(0, 3).map((ts) => (
                  <TimesheetItem 
                    key={ts.id}
                    name={ts.user_name || 'Employee'} 
                    role="Staff" 
                    hours={ts.total_hours} 
                    period={`${new Date(ts.period_start).toLocaleDateString()} - ${new Date(ts.period_end).toLocaleDateString()}`} 
                  />
                ))
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  No pending timesheets.
                </div>
              )}
            </div>
            <Button variant="link" className="w-full mt-4">View All Timesheets</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recruiting Funnel</CardTitle>
            <CardDescription>Application conversion rates.</CardDescription>
          </CardHeader>
          <CardContent className="flex h-64 items-center justify-center border-2 border-dashed rounded-lg">
             <div className="text-center space-y-2">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Analytics visualization loading...</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ApplicantRow({ name, email, position, date, status }: { 
  name: string, 
  email: string, 
  position: string, 
  date: string, 
  status: 'new' | 'reviewing' | 'interviewed' | 'shortlisted' | 'rejected' 
}) {
  const statusStyles: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    reviewing: 'bg-amber-100 text-amber-700',
    interviewed: 'bg-purple-100 text-purple-700',
    shortlisted: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-rose-100 text-rose-700',
  };

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{email}</div>
      </TableCell>
      <TableCell className="text-sm">{position}</TableCell>
      <TableCell className="text-sm">{date}</TableCell>
      <TableCell>
        <Badge className={`capitalize ${statusStyles[status] || 'bg-slate-100 text-slate-700'}`} variant="secondary">
          {status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function ActiveJobItem({ title, location, applicants, isUrgent }: { 
  title: string, 
  location: string, 
  applicants: number, 
  isUrgent: boolean 
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{title}</p>
          {isUrgent && <Badge variant="destructive" className="text-[10px] px-1 h-4">Urgent</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">{location} • {applicants} Applicants</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
    </div>
  );
}

function TimesheetItem({ name, role, hours, period }: { 
  name: string, 
  role: string, 
  hours: number, 
  period: string 
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="size-10 bg-slate-100 rounded-full flex items-center justify-center font-bold">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{role} • {period}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold">{hours} hrs</p>
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">Submitted</p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50">
            <XCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
