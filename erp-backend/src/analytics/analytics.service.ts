import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [
      projects,
      clients,
      invoices,
      tasks,
      users,
    ] = await Promise.all([
      this.prisma.project.findMany(),
      this.prisma.client.findMany(),
      this.prisma.invoice.findMany(),
      this.prisma.task.findMany(),
      this.prisma.user.findMany(),
    ]);

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const projectStatusData = projects.reduce((acc, p) => {
      const status = p.status;
      const existing = acc.find((item) => item.name === status);
      if (existing) {
        existing.value++;
      } else {
        acc.push({ name: status, value: 1, color: '' });
      }
      return acc;
    }, [] as { name: string; value: number; color: string }[]);

    return {
      kpis: [
        {
          label: "Total Revenue (YTD)",
          value: `₹${(totalRevenue / 100000).toFixed(2)}L`,
          change: "+28%",
          icon: 'BarChart3',
          color: "from-blue-500 to-blue-600",
        },
        {
          label: "Active Projects",
          value: projects.length,
          change: "+4",
          icon: 'FileText',
          color: "from-green-500 to-green-600",
        },
        {
          label: "Client Base",
          value: clients.length,
          change: "+6",
          icon: 'Users',
          color: "from-purple-500 to-purple-600",
        },
        {
          label: "Team Utilization",
          value: "87%",
          change: "+5%",
          icon: 'TrendingUp',
          color: "from-orange-500 to-orange-600",
        },
      ],
      projectStatusData,
      revenueData: [], // Mock data
      clientGrowthData: [], // Mock data
      teamPerformanceData: [], // Mock data
    };
  }
}
