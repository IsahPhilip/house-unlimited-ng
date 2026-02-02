import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Mail,
  Phone,
  Home,
  Clock,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

const Inquiries = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Simulate fetching data
    const fetchInquiries = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockInquiries: Inquiry[] = [
          {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            phone: '+1 (555) 123-4567',
            propertyId: '123',
            propertyTitle: 'Modern Downtown Loft',
            message: 'Hi, I\'m interested in this property. Can you provide more details about the amenities and parking options?',
            status: 'in_progress',
            createdAt: '2024-03-15T10:30:00Z',
            updatedAt: '2024-03-15T14:20:00Z'
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            phone: '+1 (555) 987-6543',
            propertyId: '456',
            propertyTitle: 'Suburban Family Home',
            message: 'Hello, I would like to schedule a viewing for this property. What are the available time slots?',
            status: 'new',
            createdAt: '2024-03-14T09:15:00Z',
            updatedAt: '2024-03-14T09:15:00Z'
          },
          {
            id: '3',
            name: 'Mike Davis',
            email: 'mike.davis@example.com',
            phone: '+1 (555) 456-7890',
            propertyId: '789',
            propertyTitle: 'Luxury Beach Villa',
            message: 'I have a few questions about the property taxes and HOA fees for this villa.',
            status: 'resolved',
            createdAt: '2024-03-16T16:45:00Z',
            updatedAt: '2024-03-17T11:30:00Z'
          },
          {
            id: '4',
            name: 'Emily Brown',
            email: 'emily.b@example.com',
            phone: '+1 (555) 789-0123',
            propertyId: '101',
            propertyTitle: 'Cozy City Studio',
            message: 'Is this property pet-friendly? Also, what\'s the lease duration options?',
            status: 'closed',
            createdAt: '2024-03-10T14:30:00Z',
            updatedAt: '2024-03-12T10:15:00Z'
          }
        ];
        setInquiries(mockInquiries);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inquiry.phone.includes(searchTerm) ||
                          inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'new': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-500 text-sm mt-1">Manage customer inquiries and support requests.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="relative w-full lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search inquiries by name, email, phone, or message..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select 
            className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Property</th>
                <th className="px-6 py-3">Message</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">{inquiry.name}</div>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <Mail className="w-3 h-3 mr-1" />
                        <span className="truncate">{inquiry.email}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <Phone className="w-3 h-3 mr-1" />
                        <span>{inquiry.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">{inquiry.propertyTitle}</div>
                      <div className="text-gray-500 text-sm mt-1">ID: {inquiry.propertyId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <p className="text-gray-600 text-sm line-clamp-2">{inquiry.message}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)} capitalize flex items-center`}>
                      {getStatusIcon(inquiry.status)}
                      <span className="ml-1">{inquiry.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredInquiries.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
            <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No inquiries found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inquiries;