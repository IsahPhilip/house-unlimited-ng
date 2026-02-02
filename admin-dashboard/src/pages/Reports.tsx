import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  Users, 
  Home, 
  DollarSign,
  Calendar,
  Download,
  Filter,
  Search,
  Loader2
} from 'lucide-react';

interface ReportData {
  totalProperties: number;
  totalLeads: number;
  totalDeals: number;
  totalRevenue: number;
  activeProperties: number;
  pendingLeads: number;
  closedDeals: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  propertyTypes: Array<{ type: string; count: number }>;
  leadSources: Array<{ source: string; count: number }>;
}

const Reports = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [timeRange, setTimeRange] = useState('last30days');
  const [reportType, setReportType] = useState('overview');

  useEffect(() => {
    // Simulate fetching data
    const fetchReports = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockData: ReportData = {
          totalProperties: 45,
          totalLeads: 128,
          totalDeals: 23,
          totalRevenue: 8450000,
          activeProperties: 38,
          pendingLeads: 15,
          closedDeals: 18,
          monthlyRevenue: [
            { month: 'Jan 2024', revenue: 1200000 },
            { month: 'Feb 2024', revenue: 1500000 },
            { month: 'Mar 2024', revenue: 1800000 },
            { month: 'Apr 2024', revenue: 2100000 },
            { month: 'May 2024', revenue: 1850000 },
          ],
          propertyTypes: [
            { type: 'House', count: 25 },
            { type: 'Apartment', count: 12 },
            { type: 'Commercial', count: 5 },
            { type: 'Land', count: 3 },
          ],
          leadSources: [
            { source: 'Website', count: 65 },
            { source: 'Referral', count: 35 },
            { source: 'Agent', count: 20 },
            { source: 'Other', count: 8 },
          ]
        };
        setReportData(mockData);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Generate and view comprehensive business reports.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
          <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm shadow-teal-200">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="relative w-full lg:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search reports..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="last90days">Last 90 days</option>
              <option value="lastYear">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="overview">Overview</option>
              <option value="sales">Sales Report</option>
              <option value="leads">Leads Report</option>
              <option value="properties">Properties Report</option>
              <option value="agents">Agents Report</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Properties</p>
              <p className="text-2xl font-bold mt-1">{formatNumber(reportData?.totalProperties || 0)}</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
              <Home className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-100 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Active: {formatNumber(reportData?.activeProperties || 0)}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Leads</p>
              <p className="text-2xl font-bold mt-1">{formatNumber(reportData?.totalLeads || 0)}</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-100 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Pending: {formatNumber(reportData?.pendingLeads || 0)}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Deals</p>
              <p className="text-2xl font-bold mt-1">{formatNumber(reportData?.totalDeals || 0)}</p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-purple-100 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Closed: {formatNumber(reportData?.closedDeals || 0)}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(reportData?.totalRevenue || 0)}</p>
            </div>
            <div className="bg-orange-400 bg-opacity-30 p-3 rounded-full">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-orange-100 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{timeRange}</span>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <div className="space-y-3">
            {reportData?.monthlyRevenue.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-8 bg-teal-500 rounded"></div>
                  <span className="text-sm text-gray-600">{item.month}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{formatCurrency(item.revenue)}</div>
                  <div className="text-xs text-gray-500">USD</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Types Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Types</h3>
          <div className="space-y-3">
            {reportData?.propertyTypes.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : index === 2 ? 'bg-purple-500' : 'bg-orange-500'}`}></div>
                  <span className="text-sm text-gray-600 capitalize">{item.type}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{formatNumber(item.count)}</div>
                  <div className="text-xs text-gray-500">Properties</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h3>
          <div className="space-y-3">
            {reportData?.leadSources.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : index === 2 ? 'bg-purple-500' : 'bg-orange-500'}`}></div>
                  <span className="text-sm text-gray-600 capitalize">{item.source}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{formatNumber(item.count)}</div>
                  <div className="text-xs text-gray-500">Leads</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-lg font-semibold text-gray-900">17.9%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Leads to Deals</p>
                <p className="text-sm text-green-600">+2.3% from last month</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Average Deal Value</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(367391)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Per closed deal</p>
                <p className="text-sm text-green-600">+5.2% from last month</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Average Time to Close</p>
                <p className="text-lg font-semibold text-gray-900">23 days</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">From inquiry to deal</p>
                <p className="text-sm text-red-600">-2 days from last month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;