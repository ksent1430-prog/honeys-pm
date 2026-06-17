'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  Wrench,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 18000 },
  { month: 'Feb', revenue: 19500 },
  { month: 'Mar', revenue: 21000 },
  { month: 'Apr', revenue: 20500 },
  { month: 'May', revenue: 23000 },
  { month: 'Jun', revenue: 24500 },
];

const workOrderData = [
  { name: 'Cleaning', value: 45 },
  { name: 'Maintenance', value: 30 },
  { name: 'Pest Control', value: 15 },
  { name: 'Handyman', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Reports</h1>
          <p className="text-muted-foreground">Analyze your portfolio and operational performance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" /> Last 6 Months
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Export All Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportMetric title="Total Revenue" value="$126,500" change="+12%" positive={true} />
        <ReportMetric title="Avg Occupancy" value="94.2%" change="+2%" positive={true} />
        <ReportMetric title="Open Work Orders" value="12" change="-5%" positive={true} />
        <ReportMetric title="Lead Conversion" value="28%" change="-3%" positive={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly gross revenue for all properties</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Work Order Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Work Orders by Category</CardTitle>
            <CardDescription>Distribution of service requests</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workOrderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {workOrderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
              {workOrderData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="size-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm font-medium">{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Properties</CardTitle>
            <CardDescription>Based on revenue and occupancy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Oakwood Apartments', revenue: '$15,400', occupancy: '92%', status: 'Stable' },
                { name: 'Sunset Villa', revenue: '$2,800', occupancy: '100%', status: 'Growth' },
                { name: 'Main St Commercial', revenue: '$8,500', occupancy: '85%', status: 'Review' },
              ].map((prop) => (
                <div key={prop.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{prop.name}</p>
                    <p className="text-xs text-muted-foreground">{prop.status}</p>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-right">
                      <p className="text-sm font-bold">{prop.revenue}</p>
                      <p className="text-[10px] uppercase text-muted-foreground">Revenue</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{prop.occupancy}</p>
                      <p className="text-[10px] uppercase text-muted-foreground">Occupancy</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Milestones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MilestoneItem title="15 Lease Renewals" date="July 2024" type="Lease" />
            <MilestoneItem title="Quarterly Tax Filings" date="July 15, 2024" type="Finance" />
            <MilestoneItem title="Annual Roof Inspection" date="Aug 1, 2024" type="Maintenance" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportMetric({ title, value, change, positive }: { title: string, value: string, change: string, positive: boolean }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-bold">{value}</h3>
          <div className={`flex items-center text-xs font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {positive ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
            {change}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MilestoneItem({ title, date, type }: { title: string, date: string, type: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-2 rounded-full bg-primary mt-2" />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{type} • {date}</p>
      </div>
    </div>
  );
}
