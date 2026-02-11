import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Mail,
  Phone,
  DollarSign,
  Loader2,
  Tag
} from 'lucide-react';
import { getLeads, updateContactStatus, deleteContact, createLead } from '../services/api';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  budget: string;
  requirements: string[];
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  source: 'general' | 'property_inquiry' | 'partnership' | 'complaint' | 'other';
  createdAt: string;
  updatedAt: string;
  subject?: string;
  message?: string;
}

const Leads = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general',
  });

  const exportLeadsCsv = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Property', 'Status', 'Source', 'Created At'];
    const rows = filteredLeads.map((lead) => ([
      lead.id,
      lead.name,
      lead.email,
      lead.phone,
      lead.propertyTitle || '',
      lead.status,
      lead.source,
      lead.createdAt,
    ]));
    const csv = [headers, ...rows].map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getLeads();
        const mapped: Lead[] = data.map((lead: any) => {
          return {
            id: lead._id || lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone || '',
            propertyId: lead.propertyId?._id || lead.propertyId || undefined,
            propertyTitle: lead.propertyId?.title || lead.subject || '',
            budget: 'Not provided',
            requirements: [],
            status: lead.status || 'pending',
            source: lead.type || 'general',
            createdAt: lead.createdAt,
            updatedAt: lead.updatedAt,
            subject: lead.subject,
            message: lead.message,
          };
        });
        setLeads(mapped);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSource = filterSource === 'all' || lead.source === filterSource;
    return matchesSearch && matchesStatus && matchesSource;
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

  const getSourceColor = (source: string) => {
    switch(source) {
      case 'property_inquiry': return 'bg-purple-100 text-purple-800';
      case 'partnership': return 'bg-green-100 text-green-800';
      case 'complaint': return 'bg-red-100 text-red-800';
      case 'general': return 'bg-blue-100 text-blue-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (leadId: string, status: Lead['status']) => {
    try {
      await updateContactStatus(leadId, status);
      setLeads((prev) => prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)));
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  const handleDelete = async (leadId: string) => {
    try {
      await deleteContact(leadId);
      setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
      if (selectedLead?.id === leadId) {
        setSelectedLead(null);
      }
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  };

  const handleCreateLead = async () => {
    setCreateError('');
    if (!leadForm.name || !leadForm.email || !leadForm.subject || !leadForm.message) {
      setCreateError('Please fill in all required fields.');
      return;
    }
    try {
      setCreating(true);
      const created = await createLead({
        name: leadForm.name,
        email: leadForm.email,
        phone: leadForm.phone || undefined,
        subject: leadForm.subject,
        message: leadForm.message,
        type: leadForm.type,
      });
      const mapped: Lead = {
        id: (created as any)._id || (created as any).id || created.id,
        name: (created as any).name || leadForm.name,
        email: (created as any).email || leadForm.email,
        phone: (created as any).phone || leadForm.phone || '',
        propertyId: (created as any).propertyId?._id || (created as any).propertyId || undefined,
        propertyTitle: (created as any).propertyId?.title || (created as any).subject || leadForm.subject,
        budget: 'Not provided',
        requirements: [],
        status: (created as any).status || 'pending',
        source: (created as any).type || (leadForm.type as Lead['source']),
        createdAt: (created as any).createdAt || new Date().toISOString(),
        updatedAt: (created as any).updatedAt || new Date().toISOString(),
        subject: (created as any).subject || leadForm.subject,
        message: (created as any).message || leadForm.message,
      };
      setLeads((prev) => [mapped, ...prev]);
      setShowCreateModal(false);
      setLeadForm({ name: '', email: '', phone: '', subject: '', message: '', type: 'general' });
    } catch (error) {
      console.error('Failed to create lead:', error);
      setCreateError('Failed to create lead.');
    } finally {
      setCreating(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Leads & CRM</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your leads and customer relationships.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportLeadsCsv}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Tag className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm shadow-teal-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="relative w-full lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search leads by name, email, or phone..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
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
          
          <div className="flex items-center gap-2">
            <select 
              className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
            >
              <option value="all">All Sources</option>
              <option value="general">General</option>
              <option value="property_inquiry">Property Inquiry</option>
              <option value="partnership">Partnership</option>
              <option value="complaint">Complaint</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Lead</th>
                <th className="px-6 py-3">Property</th>
                <th className="px-6 py-3">Budget</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">{lead.name}</div>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <Mail className="w-3 h-3 mr-1" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <Phone className="w-3 h-3 mr-1" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">{lead.propertyTitle}</div>
                      <div className="text-gray-500 text-sm mt-1">ID: {lead.propertyId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {lead.budget}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)} capitalize bg-transparent border border-transparent`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getSourceColor(lead.source)} capitalize`}>
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
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
        
        {filteredLeads.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
            <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No leads found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Create Lead</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {createError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded mb-3 text-sm">
                {createError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Subject</label>
                <input
                  type="text"
                  value={leadForm.subject}
                  onChange={(e) => setLeadForm({ ...leadForm, subject: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Message</label>
                <textarea
                  rows={4}
                  value={leadForm.message}
                  onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Source</label>
                <select
                  value={leadForm.type}
                  onChange={(e) => setLeadForm({ ...leadForm, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="general">General</option>
                  <option value="property_inquiry">Property Inquiry</option>
                  <option value="partnership">Partnership</option>
                  <option value="complaint">Complaint</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLead}
                disabled={creating}
                className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Create Lead'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Lead Details</h2>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div><span className="font-medium text-gray-900">Name:</span> {selectedLead.name}</div>
              <div><span className="font-medium text-gray-900">Email:</span> {selectedLead.email}</div>
              <div><span className="font-medium text-gray-900">Phone:</span> {selectedLead.phone || 'Not provided'}</div>
              <div><span className="font-medium text-gray-900">Subject:</span> {selectedLead.subject || 'N/A'}</div>
              <div><span className="font-medium text-gray-900">Message:</span> {selectedLead.message || 'N/A'}</div>
              <div><span className="font-medium text-gray-900">Source:</span> {selectedLead.source}</div>
              <div><span className="font-medium text-gray-900">Status:</span> {selectedLead.status}</div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setSelectedLead(null)}
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

export default Leads;
