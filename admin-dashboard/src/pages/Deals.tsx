import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Calendar,
  DollarSign,
  TrendingUp,
  User,
  Loader2
} from 'lucide-react';
import { getDeals, approveDeal, closeDeal, createDeal, updateDeal, getProperties, getUsers } from '../services/api';

interface Deal {
  id: string;
  propertyId: string;
  propertyTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  agentId: string;
  agentName: string;
  offerPrice: number;
  acceptedPrice?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'closed';
  createdAt: string;
  updatedAt: string;
}

const Deals = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [formError, setFormError] = useState('');
  const [buyerFilter, setBuyerFilter] = useState('');
  const [sellerFilter, setSellerFilter] = useState('');
  const [formState, setFormState] = useState({
    property: '',
    buyer: '',
    seller: '',
    agent: '',
    offerPrice: '',
    acceptedPrice: '',
    status: 'pending',
  });
  const [editState, setEditState] = useState({
    property: '',
    buyer: '',
    seller: '',
    agent: '',
    offerPrice: '',
    acceptedPrice: '',
    status: 'pending',
  });

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const data = await getDeals();
        setDeals(data);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, []);

  useEffect(() => {
    const fetchFormOptions = async () => {
      try {
        const [propsData, usersData] = await Promise.all([getProperties(), getUsers()]);
        setProperties(propsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading deal form options:', error);
      }
    };

    fetchFormOptions();
  }, []);

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          deal.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          deal.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          deal.agentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || deal.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const exportDealsCsv = () => {
    const headers = ['ID', 'Property', 'Buyer', 'Seller', 'Agent', 'Offer Price', 'Accepted Price', 'Status', 'Created At'];
    const rows = filteredDeals.map((deal) => ([
      deal.id,
      deal.propertyTitle,
      deal.buyerName,
      deal.sellerName,
      deal.agentName,
      deal.offerPrice,
      deal.acceptedPrice ?? '',
      deal.status,
      deal.createdAt,
    ]));
    const csv = [headers, ...rows].map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deals-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const suggestedAcceptedPrice = (offer: string) => {
    const value = Number(offer);
    if (!value || Number.isNaN(value)) return '';
    return Math.round(value * 1.05).toString();
  };

  const submitDeal = async () => {
    setFormError('');
    if (!formState.property || !formState.buyer || !formState.seller || !formState.agent || !formState.offerPrice) {
      setFormError('Please fill in all required fields.');
      return;
    }
    try {
      const created = await createDeal({
        property: formState.property,
        buyer: formState.buyer,
        seller: formState.seller,
        agent: formState.agent,
        offerPrice: Number(formState.offerPrice),
        acceptedPrice: formState.acceptedPrice ? Number(formState.acceptedPrice) : undefined,
        status: formState.status as Deal['status'],
      } as any);
      setDeals([created as any, ...deals]);
      setShowCreateModal(false);
      setFormState({
        property: '',
        buyer: '',
        seller: '',
        agent: '',
        offerPrice: '',
        acceptedPrice: '',
        status: 'pending',
      });
    } catch (error) {
      console.error('Failed to create deal:', error);
      setFormError('Failed to create deal.');
    }
  };

  const openEditModal = (deal: Deal) => {
    setEditingDealId(deal.id);
    setEditState({
      property: deal.propertyId,
      buyer: deal.buyerId,
      seller: deal.sellerId,
      agent: deal.agentId,
      offerPrice: deal.offerPrice.toString(),
      acceptedPrice: deal.acceptedPrice ? deal.acceptedPrice.toString() : '',
      status: deal.status,
    });
    setShowEditModal(true);
  };

  const submitEdit = async () => {
    if (!editingDealId) return;
    setFormError('');
    if (!editState.property || !editState.buyer || !editState.seller || !editState.agent || !editState.offerPrice) {
      setFormError('Please fill in all required fields.');
      return;
    }
    try {
      const updated = await updateDeal(editingDealId, {
        property: editState.property,
        buyer: editState.buyer,
        seller: editState.seller,
        agent: editState.agent,
        offerPrice: Number(editState.offerPrice),
        acceptedPrice: editState.acceptedPrice ? Number(editState.acceptedPrice) : undefined,
        status: editState.status as Deal['status'],
      } as any);
      setDeals(deals.map((d) => (d.id === editingDealId ? (updated as any) : d)));
      setShowEditModal(false);
      setEditingDealId(null);
    } catch (error) {
      console.error('Failed to update deal:', error);
      setFormError('Failed to update deal.');
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
          <h1 className="text-2xl font-bold text-gray-900">Deals Pipeline</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage your property deals.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportDealsCsv}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm shadow-teal-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
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
            placeholder="Search deals by property, buyer, seller, or agent..."
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
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Property</th>
                <th className="px-6 py-3">Buyer</th>
                <th className="px-6 py-3">Seller</th>
                <th className="px-6 py-3">Agent</th>
                <th className="px-6 py-3">Offer Price</th>
                <th className="px-6 py-3">Accepted Price</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">{deal.propertyTitle}</div>
                      <div className="text-gray-500 text-sm mt-1">ID: {deal.propertyId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{deal.buyerName}</div>
                        <div className="text-gray-500 text-sm">ID: {deal.buyerId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{deal.sellerName}</div>
                        <div className="text-gray-500 text-sm">ID: {deal.sellerId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{deal.agentName}</div>
                        <div className="text-gray-500 text-sm">ID: {deal.agentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {formatCurrency(deal.offerPrice)}
                  </td>
                  <td className="px-6 py-4">
                    {deal.acceptedPrice ? (
                      <span className="text-green-600 font-medium">
                        {formatCurrency(deal.acceptedPrice)}
                      </span>
                    ) : (
                      <span className="text-gray-400">No accepted price</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(deal.status)} capitalize`}>
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(deal.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {deal.status === 'pending' && (
                        <button
                          className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded hover:bg-green-100"
                          onClick={async () => {
                            try {
                              const updated = await approveDeal(deal.id);
                              setDeals(deals.map((d) => (d.id === deal.id ? updated : d)));
                            } catch (error) {
                              console.error('Failed to approve deal:', error);
                            }
                          }}
                        >
                          Approve
                        </button>
                      )}
                      {deal.status !== 'closed' && (
                        <button
                          className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100"
                          onClick={async () => {
                            try {
                              const updated = await closeDeal(deal.id);
                              setDeals(deals.map((d) => (d.id === deal.id ? updated : d)));
                            } catch (error) {
                              console.error('Failed to close deal:', error);
                            }
                          }}
                        >
                          Close
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => openEditModal(deal)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredDeals.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
            <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No deals found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}
      </div>
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Create Deal</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded mb-3 text-sm">
                {formError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Property</label>
                <select
                  value={formState.property}
                  onChange={(e) => setFormState({ ...formState, property: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select property</option>
                  {properties.map((p) => (
                    <option key={p._id || p.id} value={p._id || p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Buyer</label>
                  <input
                    type="text"
                    placeholder="Filter buyers..."
                    value={buyerFilter}
                    onChange={(e) => setBuyerFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2"
                  />
                  <select
                    value={formState.buyer}
                    onChange={(e) => setFormState({ ...formState, buyer: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Select buyer</option>
                    {users
                      .filter((u) => u.role !== 'agent')
                      .filter((u) => u.name?.toLowerCase().includes(buyerFilter.toLowerCase()))
                      .map((u) => (
                      <option key={u._id || u.id} value={u._id || u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Seller</label>
                  <input
                    type="text"
                    placeholder="Filter sellers..."
                    value={sellerFilter}
                    onChange={(e) => setSellerFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2"
                  />
                  <select
                    value={formState.seller}
                    onChange={(e) => setFormState({ ...formState, seller: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Select seller</option>
                    {users
                      .filter((u) => u.role !== 'user')
                      .filter((u) => u.name?.toLowerCase().includes(sellerFilter.toLowerCase()))
                      .map((u) => (
                      <option key={u._id || u.id} value={u._id || u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Agent</label>
                <select
                  value={formState.agent}
                  onChange={(e) => setFormState({ ...formState, agent: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select agent</option>
                  {users.filter((u) => u.role === 'agent').map((u) => (
                    <option key={u._id || u.id} value={u._id || u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Offer Price</label>
                  <input
                    type="number"
                    value={formState.offerPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      const suggested = suggestedAcceptedPrice(value);
                      setFormState({
                        ...formState,
                        offerPrice: value,
                        acceptedPrice: formState.acceptedPrice ? formState.acceptedPrice : suggested,
                      });
                    }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Accepted Price</label>
                  <input
                    type="number"
                    value={formState.acceptedPrice}
                    onChange={(e) => setFormState({ ...formState, acceptedPrice: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Suggested: {formState.offerPrice ? suggestedAcceptedPrice(formState.offerPrice) : '-'}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <select
                  value={formState.status}
                  onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="closed">Closed</option>
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
                onClick={submitDeal}
                className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Create Deal
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Edit Deal</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded mb-3 text-sm">
                {formError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Property</label>
                <select
                  value={editState.property}
                  onChange={(e) => setEditState({ ...editState, property: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select property</option>
                  {properties.map((p) => (
                    <option key={p._id || p.id} value={p._id || p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Buyer</label>
                  <select
                    value={editState.buyer}
                    onChange={(e) => setEditState({ ...editState, buyer: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Select buyer</option>
                    {users.filter((u) => u.role !== 'agent').map((u) => (
                      <option key={u._id || u.id} value={u._id || u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Seller</label>
                  <select
                    value={editState.seller}
                    onChange={(e) => setEditState({ ...editState, seller: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Select seller</option>
                    {users.filter((u) => u.role !== 'user').map((u) => (
                      <option key={u._id || u.id} value={u._id || u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Agent</label>
                <select
                  value={editState.agent}
                  onChange={(e) => setEditState({ ...editState, agent: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select agent</option>
                  {users.filter((u) => u.role === 'agent').map((u) => (
                    <option key={u._id || u.id} value={u._id || u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Offer Price</label>
                  <input
                    type="number"
                    value={editState.offerPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      const suggested = suggestedAcceptedPrice(value);
                      setEditState({
                        ...editState,
                        offerPrice: value,
                        acceptedPrice: editState.acceptedPrice ? editState.acceptedPrice : suggested,
                      });
                    }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Accepted Price</label>
                  <input
                    type="number"
                    value={editState.acceptedPrice}
                    onChange={(e) => setEditState({ ...editState, acceptedPrice: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Suggested: {editState.offerPrice ? suggestedAcceptedPrice(editState.offerPrice) : '-'}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <select
                  value={editState.status}
                  onChange={(e) => setEditState({ ...editState, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals;
