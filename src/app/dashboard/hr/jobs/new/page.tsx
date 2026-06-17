'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  Building2,
  Users
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import Link from 'next/link';

export default function NewJobPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/hr">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Job Posting</h1>
          <p className="text-muted-foreground">Fill in the details to post a new job opening.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>General information about the position.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" placeholder="e.g. Senior Property Manager" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="management">Property Management</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="cleaning">Cleaning Services</SelectItem>
                      <SelectItem value="pest">Pest Control</SelectItem>
                      <SelectItem value="admin">Administrative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Employment Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="temp">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="location" placeholder="e.g. Springfield (On-site)" className="pl-8" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea id="description" placeholder="Describe the role, responsibilities, and requirements..." className="min-h-[200px]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compensation & Benefits</CardTitle>
              <CardDescription>Salary range and additional perks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary-min">Minimum Salary (Annual)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="salary-min" type="number" placeholder="45000" className="pl-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary-max">Maximum Salary (Annual)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="salary-max" type="number" placeholder="65000" className="pl-8" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (comma separated)</Label>
                <Input id="benefits" placeholder="e.g. Health Insurance, 401k, Paid Time Off" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Post visibility and urgent status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Public Posting</Label>
                  <p className="text-[10px] text-muted-foreground text-left">Show on external career site.</p>
                </div>
                <div className="size-6 bg-emerald-500 rounded-full" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Urgent Hiring</Label>
                  <p className="text-[10px] text-muted-foreground text-left">Highlight as urgent role.</p>
                </div>
                <div className="size-6 bg-slate-200 rounded-full" />
              </div>
              
              <div className="space-y-2">
                <Label>Hiring Manager</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="honey">Honey Owner</SelectItem>
                    <SelectItem value="jane">Jane Manager</SelectItem>
                    <SelectItem value="robert">Robert Recruiter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Publish Job Posting</Button>
              <Button variant="outline" className="w-full">Save as Draft</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>• Be specific about requirements to filter out unqualified applicants.</p>
              <p>• Include a clear salary range to attract more candidates.</p>
              <p>• Highlight company culture and growth opportunities.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
