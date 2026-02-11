import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Home,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Search,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getDashboardStats, getRevenueReport, getLeadSourcesReport, getPropertyTypesReport } from '../services/api';

const Reports = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [revenueReport, setRevenueReport] = useState<any>(null);
  const [leadSources, setLeadSources] = useState<any[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('last30days');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  const formatDateInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [reportType, setReportType] = useState('overview');
  const exportCsv = () => {
    const rows: string[][] = [];
    rows.push(['Metric', 'Value']);
    rows.push(['Total Properties', String(stats?.totalProperties ?? 0)]);
    rows.push(['Active Properties', String(stats?.activeProperties ?? 0)]);
    rows.push(['Total Leads', String(stats?.totalLeads ?? 0)]);
    rows.push(['Pending Leads', String(stats?.pendingLeads ?? 0)]);
    rows.push(['Total Deals', String(stats?.totalDeals ?? 0)]);
    rows.push(['Closed Deals', String(stats?.closedDeals ?? 0)]);
    rows.push(['Total Revenue', String(stats?.totalRevenue ?? 0)]);

    rows.push([]);
    rows.push(['Monthly Revenue', 'Amount']);
    (revenueReport?.monthlyRevenue || []).forEach((item: any) => {
      rows.push([item.month, String(item.revenue)]);
    });

    rows.push([]);
    rows.push(['Lead Source', 'Count']);
    leadSources.forEach((item) => rows.push([item.source, String(item.count)]));

    rows.push([]);
    rows.push(['Property Type', 'Count']);
    propertyTypes.forEach((item) => rows.push([item.type, String(item.count)]));

    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reports-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    const payload = {
      stats,
      revenueReport,
      leadSources,
      propertyTypes,
      dateRange,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reports-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const [statsData, revenueData, leadSourceData, propertyTypeData] = await Promise.all([
          getDashboardStats(),
          getRevenueReport(dateRange.start || undefined, dateRange.end || undefined),
          getLeadSourcesReport(),
          getPropertyTypesReport(),
        ]);
        setStats(statsData);
        setRevenueReport(revenueData);
        setLeadSources(leadSourceData);
        setPropertyTypes(propertyTypeData);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Report data is not available right now.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [dateRange.start, dateRange.end]);

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
          <button
            onClick={exportCsv}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={exportJson}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm shadow-teal-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export JSON
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
            <input
              type="date"
              className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
            <span className="text-sm text-gray-400">to</span>
            <input
              type="date"
              className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={timeRange}
              onChange={(e) => {
                const value = e.target.value;
                setTimeRange(value);
                if (value === 'last7days' || value === 'last30days' || value === 'last90days') {
                  const end = new Date();
                  const start = new Date();
                  const days = value === 'last7days' ? 7 : value === 'last30days' ? 30 : 90;
                  start.setDate(end.getDate() - days);
                  setDateRange({ start: formatDateInput(start), end: formatDateInput(end) });
                }
              }}
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

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Properties</p>
              <p className="text-2xl font-bold mt-1">{formatNumber(stats?.totalProperties || 0)}</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
              <Home className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-100 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Active: {formatNumber(stats?.activeProperties || 0)}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Leads</p>
              <p className="text-2xl font-bold mt-1">{formatNumber(stats?.totalLeads || 0)}</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-100 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Pending: {formatNumber(stats?.pendingLeads || 0)}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Deals</p>
              <p className="text-2xl font-bold mt-1">{formatNumber(stats?.totalDeals || 0)}</p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-purple-100 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Closed: {formatNumber(stats?.closedDeals || 0)}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(stats?.totalRevenue || 0)}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          {(revenueReport?.monthlyRevenue?.length || 0) > 0 ? (
            <div className="space-y-3">
              {revenueReport.monthlyRevenue.map((item: any) => (
                <div key={item.month} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(item.revenue)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No revenue data available.</div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Types</h3>
          {propertyTypes.length > 0 ? (
            <div className="space-y-3">
              {propertyTypes.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{item.type}</span>
                  <span className="text-sm font-medium text-gray-900">{formatNumber(item.count)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No property type data available.</div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h3>
          {leadSources.length > 0 ? (
            <div className="space-y-3">
              {leadSources.map((item) => (
                <div key={item.source} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{item.source}</span>
                  <span className="text-sm font-medium text-gray-900">{formatNumber(item.count)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No lead source data available.</div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div className="text-sm text-gray-500">Performance metrics will appear once deals and reporting pipelines are live.</div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
