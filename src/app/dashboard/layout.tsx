import { DashboardSidebar } from '@/components/dashboard-sidebar';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard | OpsFlow',
  description: 'OpsFlow Admin Dashboard - Honey\'s Property Management & Services',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto bg-muted/30">
        {children}
      </main>
    </div>
  );
}