import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, PieChart, Users, Home, Handshake, TrendingUp, TrendingDown, Calendar, Clock } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Mock data for KPI cards
const kpiData = [
  {
    title: 'Total Properties',
    value: 128,
    change: 12,
    icon: <Home className="h-6 w-6 text-blue-500" />,
    color: 'bg-blue-50'
  },
  {
    title: 'New Leads',
    value: 24,
    change: 8,
    icon: <Users className="h-6 w-6 text-green-500" />,
    color: 'bg-green-50'
  },
  {
    title: 'Active Deals',
    value: 18,
    change: -2,
    icon: <Handshake className="h-6 w-6 text-purple-500" />,
    color: 'bg-purple-50'
  },
  {
    title: 'Conversion Rate',
    value: '68%',
    change: 5,
    icon: <TrendingUp className="h-6 w-6 text-yellow-500" />,
    color: 'bg-yellow-50'
  }
];

// Mock data for charts
const leadsOverTimeData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Leads',
      data: [12, 19, 15, 22, 18, 25, 30],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      tension: 0.4
    }
  ]
};

const propertiesByStatusData = {
  labels: ['Available', 'Pending', 'Sold', 'Rented'],
  datasets: [
    {
      data: [45, 12, 28, 15],
      backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
      borderWidth: 0
    }
  ]
};

const dealsFunnelData = {
  labels: ['New', 'Contacted', 'Qualified', 'Offer', 'Closed'],
  datasets: [
    {
      label: 'Deals',
      data: [42, 32, 24, 18, 12],
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2
    }
  ]
};

// Mock recent activity
const recentActivity = [
  {
    id: 1,
    type: 'new_lead',
    user: 'John Doe',
    message: 'Submitted inquiry for 123 Main St',
    time: '2 hours ago',
    icon: <Users className="h-5 w-5 text-blue-500" />
  },
  {
    id: 2,
    type: 'property_added',
    user: 'Jane Smith',
    message: 'Added new luxury condo listing',
    time: '5 hours ago',
    icon: <Home className="h-5 w-5 text-green-500" />
  },
  {
    id: 3,
    type: 'deal_update',
    user: 'Mike Johnson',
    message: 'Offer accepted for property #456',
    time: '1 day ago',
    icon: <Handshake className="h-5 w-5 text-purple-500" />
  },
  {
    id: 4,
    type: 'appointment',
    user: 'Sarah Williams',
    message: 'Scheduled viewing for 3:00 PM today',
    time: '1 day ago',
    icon: <Calendar className="h-5 w-5 text-yellow-500" />
  }
];

// Quick actions
const quickActions = [
  {
    name: 'Add Property',
    icon: <Home className="h-5 w-5" />,
    path: '/properties/add'
  },
  {
    name: 'Add Lead',
    icon: <Users className="h-5 w-5" />,
    path: '/leads/add'
  },
  {
    name: 'Schedule Viewing',
    icon: <Calendar className="h-5 w-5" />,
    path: '/deals/schedule'
  },
  {
    name: 'Generate Report',
    icon: <BarChart2 className="h-5 w-5" />,
    path: '/reports'
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * kpiData.indexOf(kpi) }}
            className={`${kpi.color} rounded-lg p-6 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {kpi.icon}
                <div>
                  <p className="text-sm text-gray-500">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                </div>
              </div>
              <div className={`flex items-center ${kpi.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="text-sm font-medium">{kpi.change}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Leads Over Time</h3>
            <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="h-64">
            <Bar
              data={leadsOverTimeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  title: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: '#f3f4f6'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Properties by Status Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties by Status</h3>
          <div className="h-64">
            <Doughnut
              data={propertiesByStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Deals Funnel Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deals Funnel</h3>
        <div className="h-64">
          <Bar
            data={dealsFunnelData}
            options={{
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                x: {
                  beginAtZero: true,
                  grid: {
                    color: '#f3f4f6'
                  }
                },
                y: {
                  grid: {
                    display: false
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50"
              >
                <div className="flex-shrink-0">{activity.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{activity.user}</p>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <motion.button
                key={action.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-primary-600 mb-2">{action.icon}</div>
                <span className="text-sm font-medium text-gray-700">{action.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}