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
  DollarSign,
  TrendingUp,
  User,
  Home,
  Loader2
} from 'lucide-react';

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

  useEffect(() => {
    // Simulate fetching data
    const fetchDeals = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockDeals: Deal[] = [
          {
            id: '1',
            propertyId: '123',
            propertyTitle: 'Modern Downtown Loft',
            buyerId: 'buyer1',
            buyerName: 'John Smith',
            sellerId: 'seller1',
            sellerName: 'Jane Doe',
            agentId: 'agent1',
            agentName: 'Mike Wilson',
            offerPrice: 450000,
            acceptedPrice: 445000,
            status: 'closed',
            createdAt: '2024-03-15T10:30:00Z',
            updatedAt: '2024-03-20T14:20:00Z'
          },
          {
            id: '2',
            propertyId: '456',
            propertyTitle: 'Suburban Family Home',
            buyerId: 'buyer2',
            buyerName: 'Sarah Johnson',
            sellerId: 'seller2',
            sellerName: 'Robert Brown',
            agentId: 'agent2',
            agentName: 'Lisa Thompson',
            offerPrice: 850000,
            acceptedPrice: 840000,
            status: 'accepted',
            createdAt: '2024-03-14T09:15:00Z',
            updatedAt: '2024-03-18T11:45:00Z'
          },
          {
            id: '3',
            propertyId: '789',
            propertyTitle: 'Luxury Beach Villa',
            buyerId: 'buyer3',
            buyerName: 'Mike Davis',
            sellerId: 'seller3',
            sellerName: 'Emily Wilson',
            agentId: 'agent3',
            agentName: 'David Miller',
            offerPrice: 2100000,
            status: 'pending',
            createdAt: '2024-03-16T16:45:00Z',
            updatedAt: '2024-03-16T16:45:00Z'
          },
          {
            id: '4',
            propertyId: '101',
            propertyTitle: 'Cozy City Studio',
            buyerId: 'buyer4',
            buyerName: 'Emily Brown',
            sellerId: 'seller4',
            sellerName: 'Chris Lee',
            agentId: 'agent4',
            agentName: 'Anna Garcia',
            offerPrice: 250000,
            status: 'rejected',
            createdAt: '2024-03-10T14:30:00Z',
            updatedAt: '2024-03-12T10:15:00Z'
          }
        ];
        setDeals(mockDeals);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
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
        <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm shadow-teal-200">
          <Plus className="w-4 h-4 mr-2" />
          Add Deal
        </button>
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
    </div>
  );
};

export default Deals;