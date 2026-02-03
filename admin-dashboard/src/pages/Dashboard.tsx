import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Home, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { getDashboardStats } from '../services/api';

interface DashboardData {
  totalProperties?: number;
  propertiesChange?: string;
  totalLeads?: number;
  leadsChange?: string;
  totalRevenue?: number;
  revenueChange?: string;
  activeDeals?: number;
  dealsChange?: string;
  recentActivities?: Array<{
    user: string;
    action: string;
    target: string;
    time: string;
  }>;
  recentProperties?: Array<{
    id: string;
    title: string;
    price: string;
    status: string;
    date: string;
  }>;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result = await getDashboardStats();
        setData(result);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
      </div>
    );
  }

  const stats = [
    { 
      label: 'Total Properties', 
      value: data?.totalProperties?.toString() || '0', 
      change: data?.propertiesChange || '0%', 
      trend: (data?.propertiesChange?.startsWith('-') ? 'down' : 'up') as 'up' | 'down',
      icon: Home,
      color: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    { 
      label: 'Total Leads', 
      value: data?.totalLeads?.toString() || '0', 
      change: data?.leadsChange || '0%', 
      trend: (data?.leadsChange?.startsWith('-') ? 'down' : 'up') as 'up' | 'down',
      icon: Users,
      color: 'bg-green-500',
      textColor: 'text-green-500'
    },
    { 
      label: 'Total Revenue', 
      value: data?.totalRevenue ? `$${data.totalRevenue.toLocaleString()}` : '$0', 
      change: data?.revenueChange || '0%', 
      trend: (data?.revenueChange?.startsWith('-') ? 'down' : 'up') as 'up' | 'down',
      icon: DollarSign,
      color: 'bg-purple-500',
      textColor: 'text-purple-500'
    },
    { 
      label: 'Active Deals', 
      value: data?.activeDeals?.toString() || '0', 
      change: data?.dealsChange || '0%', 
      trend: (data?.dealsChange?.startsWith('-') ? 'down' : 'up') as 'up' | 'down',
      icon: TrendingUp,
      color: 'bg-orange-500',
      textColor: 'text-orange-500'
    }
  ];

  const recentActivities = data?.recentActivities || [];
  const recentProperties = data?.recentProperties || [];

  const getPropertyStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
      case 'rented':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            Download Report
          </button>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm shadow-teal-200">
            Add Property
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`font-medium flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {stat.change}
              </span>
              <span className="text-gray-400 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Properties Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Recent Properties</h3>
            <button className="text-sm text-teal-600 font-medium hover:text-teal-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Property</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date Added</th>
                </tr>
              </thead>
              <tbody>
                {recentProperties.map((property) => (
                  <tr key={property.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{property.title}</td>
                    <td className="px-6 py-4 text-gray-600">{property.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPropertyStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{property.date ? new Date(property.date).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-8">
            {recentActivities.map((activity, index) => (
              <div key={index} className="relative flex items-start space-x-4">
                {index !== recentActivities.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-[-32px] w-0.5 bg-gray-100"></div>
                )}
                <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0 z-10">
                  <Activity className="w-4 h-4 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user} <span className="font-normal text-gray-500">{activity.action}</span>
                  </p>
                  <p className="text-sm text-gray-600 truncate">{activity.target}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {activity.time ? new Date(activity.time).toLocaleString() : '-'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
