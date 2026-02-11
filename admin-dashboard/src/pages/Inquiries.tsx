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
  Loader2
} from 'lucide-react';
import { getInquiries, updateContactStatus, deleteContact } from '../services/api';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  subject?: string;
  type?: string;
}

const Inquiries = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const data = await getInquiries();
        const mapped: Inquiry[] = data.map((inquiry: any) => ({
          id: inquiry._id || inquiry.id,
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone || '',
          propertyId: inquiry.propertyId?._id || inquiry.propertyId || undefined,
          propertyTitle: inquiry.propertyId?.title || inquiry.subject || '',
          message: inquiry.message,
          status: inquiry.status || 'pending',
          createdAt: inquiry.createdAt,
          updatedAt: inquiry.updatedAt,
          subject: inquiry.subject,
          type: inquiry.type,
        }));
        setInquiries(mapped);
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
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (inquiryId: string, status: Inquiry['status']) => {
    try {
      await updateContactStatus(inquiryId, status);
      setInquiries((prev) => prev.map((inq) => (inq.id === inquiryId ? { ...inq, status } : inq)));
    } catch (error) {
      console.error('Failed to update inquiry status:', error);
    }
  };

  const handleDelete = async (inquiryId: string) => {
    try {
      await deleteContact(inquiryId);
      setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry(null);
      }
    } catch (error) {
      console.error('Failed to delete inquiry:', error);
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
            <option value="pending">Pending</option>
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
                    <select
                      value={inquiry.status}
                      onChange={(e) => handleStatusChange(inquiry.id, e.target.value as Inquiry['status'])}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)} capitalize bg-transparent border border-transparent`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
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

      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Inquiry Details</h2>
              <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div><span className="font-medium text-gray-900">Name:</span> {selectedInquiry.name}</div>
              <div><span className="font-medium text-gray-900">Email:</span> {selectedInquiry.email}</div>
              <div><span className="font-medium text-gray-900">Phone:</span> {selectedInquiry.phone || 'Not provided'}</div>
              <div><span className="font-medium text-gray-900">Subject:</span> {selectedInquiry.subject || selectedInquiry.propertyTitle || 'N/A'}</div>
              <div><span className="font-medium text-gray-900">Message:</span> {selectedInquiry.message || 'N/A'}</div>
              <div><span className="font-medium text-gray-900">Type:</span> {selectedInquiry.type || 'general'}</div>
              <div><span className="font-medium text-gray-900">Status:</span> {selectedInquiry.status}</div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquiries;
