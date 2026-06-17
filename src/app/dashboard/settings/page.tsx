'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Shield, 
  History, 
  Settings as SettingsIcon, 
  Mail, 
  Bell, 
  Lock,
  UserPlus,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Key
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings & Security</h1>
        <p className="text-muted-foreground">Manage users, security protocols, and system-wide configurations.</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <History className="h-4 w-4" /> Audit Log
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-8 h-9" />
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Invite User
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage your team and their system permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <UserRow 
                    name="Honey Owner" 
                    email="owner@honeys.com" 
                    role="Admin" 
                    lastLogin="Just now" 
                    status="active" 
                  />
                  <UserRow 
                    name="Jane Manager" 
                    email="jane@honeys.com" 
                    role="Property Manager" 
                    lastLogin="2 hours ago" 
                    status="active" 
                  />
                  <UserRow 
                    name="Mike Fixit" 
                    email="mike@honeys.com" 
                    role="Maintenance" 
                    lastLogin="Yesterday" 
                    status="active" 
                  />
                  <UserRow 
                    name="Robert Recruiter" 
                    email="robert@honeys.com" 
                    role="HR Lead" 
                    lastLogin="June 5, 2024" 
                    status="active" 
                  />
                  <UserRow 
                    name="Sara Temp" 
                    email="sara@honeys.com" 
                    role="Staffing Agent" 
                    lastLogin="Never" 
                    status="invited" 
                  />
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Configuration</CardTitle>
                <CardDescription>Global security settings for all users.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SecuritySetting 
                  title="Two-Factor Authentication (2FA)" 
                  description="Require all administrative users to use 2FA." 
                  status={true} 
                />
                <SecuritySetting 
                  title="Session Timeout" 
                  description="Automatically log out users after 4 hours of inactivity." 
                  status={true} 
                />
                <SecuritySetting 
                  title="Password Rotation" 
                  description="Force users to change their password every 90 days." 
                  status={false} 
                />
                <SecuritySetting 
                  title="IP Whitelisting" 
                  description="Only allow logins from recognized office IP addresses." 
                  status={false} 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
                <CardDescription>Define role-based access permissions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <RoleItem role="Admin" description="Full access to all modules and settings." />
                  <RoleItem role="Property Manager" description="Access to CRM, properties, and work orders." />
                  <RoleItem role="Maintenance" description="Limited access to work orders and scheduling." />
                  <RoleItem role="HR & Recruiting" description="Access to HR, recruiting, and employee data." />
                  <Button variant="outline" className="w-full mt-2">Manage Role Permissions</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>System Audit Log</CardTitle>
                  <CardDescription>Track all sensitive actions performed by users.</CardDescription>
                </div>
                <Button variant="outline" size="sm">Download CSV</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AuditLogRow 
                    event="Modified Property - Oakwood" 
                    user="Honey Owner" 
                    timestamp="June 9, 2024 14:32" 
                    module="Properties" 
                  />
                  <AuditLogRow 
                    event="Deleted Job Posting - Accountant" 
                    user="Robert Recruiter" 
                    timestamp="June 9, 2024 11:15" 
                    module="HR" 
                  />
                  <AuditLogRow 
                    event="Successful 2FA Authentication" 
                    user="Jane Manager" 
                    timestamp="June 9, 2024 09:45" 
                    module="Security" 
                  />
                  <AuditLogRow 
                    event="Exported Payroll Report" 
                    user="Honey Owner" 
                    timestamp="June 8, 2024 16:50" 
                    module="Accounting" 
                  />
                  <AuditLogRow 
                    event="Password Reset Request" 
                    user="Mike Fixit" 
                    timestamp="June 8, 2024 10:20" 
                    module="Security" 
                  />
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UserRow({ name, email, role, lastLogin, status }: { 
  name: string, 
  email: string, 
  role: string, 
  lastLogin: string, 
  status: 'active' | 'invited' | 'suspended' 
}) {
  const statusStyles = {
    active: 'bg-emerald-100 text-emerald-700',
    invited: 'bg-blue-100 text-blue-700',
    suspended: 'bg-rose-100 text-rose-700',
  };

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{email}</div>
      </TableCell>
      <TableCell className="text-sm">{role}</TableCell>
      <TableCell className="text-sm">{lastLogin}</TableCell>
      <TableCell>
        <Badge className={`capitalize ${statusStyles[status]}`} variant="secondary">
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

function SecuritySetting({ title, description, status }: { title: string, description: string, status: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-0.5">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className={`size-10 rounded-full flex items-center justify-center cursor-pointer transition-colors ${status ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
        {status ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
      </div>
    </div>
  );
}

function RoleItem({ role, description }: { role: string, description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors">
      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
        <Lock className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold">{role}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function AuditLogRow({ event, user, timestamp, module }: { 
  event: string, 
  user: string, 
  timestamp: string, 
  module: string 
}) {
  return (
    <TableRow>
      <TableCell className="text-sm font-medium">{event}</TableCell>
      <TableCell className="text-xs">{user}</TableCell>
      <TableCell className="text-xs font-mono">{timestamp}</TableCell>
      <TableCell>
        <Badge variant="outline" className="text-[10px] uppercase">{module}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

import { Search } from 'lucide-react';
