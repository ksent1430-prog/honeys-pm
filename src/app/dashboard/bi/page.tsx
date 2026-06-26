'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Target, 
  Lightbulb, 
  AlertTriangle,
  Download,
  Calendar,
  Filter,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  FileText
} from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 45000, target: 40000 },
  { month: 'Feb', revenue: 52000, target: 42000 },
  { month: 'Mar', revenue: 48000, target: 44000 },
  { month: 'Apr', revenue: 61000, target: 46000 },
  { month: 'May', revenue: 55000, target: 48000 },
  { month: 'Jun', revenue: 67000, target: 50000 },
];

const occupancyData = [
  { month: 'Jan', rate: 92 },
  { month: 'Feb', rate: 94 },
  { month: 'Mar', rate: 93 },
  { month: 'Apr', rate: 96 },
  { month: 'May', rate: 95 },
  { month: 'Jun', rate: 98 },
];

const segmentData = [
  { name: 'Residential', value: 65 },
  { name: 'Commercial', value: 25 },
  { name: 'Temp Staffing', value: 10 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

export default function BIPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Intelligence</h1>
          <p className="text-muted-foreground">Strategic insights, KPI tracking, and growth recommendations.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Advanced Filters
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Generate BI Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Revenue vs Target" value="+14.2%" icon={<TrendingUp className="h-4 w-4" />} color="emerald" />
        <KPICard title="Customer Retention" value="96.5%" icon={<Target className="h-4 w-4" />} color="indigo" />
        <KPICard title="Operational Efficiency" value="88.2%" icon={<Zap className="h-4 w-4" />} color="amber" />
        <KPICard title="Lead Conversion" value="24.8%" icon={<BarChart3 className="h-4 w-4" />} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Projection</CardTitle>
            <CardDescription>Actual revenue vs quarterly growth targets.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  strokeWidth={2}
                  name="Actual Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#94a3b8" 
                  strokeDasharray="5 5" 
                  name="Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Segment</CardTitle>
            <CardDescription>Breakdown of business units.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={segmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {segmentData.map((item, i) => (
                <div key={item.name} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Insights & Recommendations</CardTitle>
            <CardDescription>Automated suggestions based on business data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RecommendationItem 
              icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
              title="Expand Cleaning Services"
              description="Data shows a 35% increase in cleaning requests in the north sector. Hiring 2 new temps could increase monthly revenue by $8k."
              impact="High"
            />
            <RecommendationItem 
              icon={<AlertTriangle className="h-5 w-5 text-rose-500" />}
              title="Lease Renewal Alert"
              description="15% of high-value commercial leases expire in Q3. Start renewal negotiations early to maintain occupancy rates."
              impact="Critical"
            />
            <RecommendationItem 
              icon={<Lightbulb className="h-5 w-5 text-amber-500" />}
              title="Pest Control Bundle"
              description="Bundling pest control with property management has a 40% higher uptake. Consider a 'Premium Care' tier."
              impact="Medium"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Health Trend</CardTitle>
            <CardDescription>Aggregate occupancy rate over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4 }}
                  name="Occupancy %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automated Report Viewer</CardTitle>
          <CardDescription>Access pre-generated weekly, monthly, and quarterly reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReportItem title="Q2 Quarterly Business Review" date="June 1, 2024" size="4.2 MB" />
            <ReportItem title="May Monthly Performance" date="June 1, 2024" size="1.8 MB" />
            <ReportItem title="Weekly Operational Pulse" date="June 7, 2024" size="850 KB" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KPICard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-500 bg-emerald-50',
    indigo: 'text-indigo-500 bg-indigo-50',
    amber: 'text-amber-500 bg-amber-50',
    blue: 'text-blue-500 bg-blue-50',
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function RecommendationItem({ icon, title, description, impact }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  impact: 'High' | 'Critical' | 'Medium' | 'Low' 
}) {
  const impactColors = {
    Critical: 'bg-rose-100 text-rose-700',
    High: 'bg-emerald-100 text-emerald-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="p-4 border rounded-lg space-y-2 hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="font-semibold text-sm">{title}</h4>
        </div>
        <Badge className={impactColors[impact]} variant="secondary">{impact} Impact</Badge>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function ReportItem({ title, date, size }: { title: string, date: string, size: string }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 rounded-lg">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{date} • {size}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
    </div>
  );
}
