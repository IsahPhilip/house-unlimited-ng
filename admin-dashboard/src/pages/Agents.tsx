import React, { useState, useEffect } from 'react';
import { 
  User, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  DollarSign,
  Home,
  Star,
  Mail,
  Phone,
  Loader2
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  propertiesCount: number;
  dealsCount: number;
  totalSales: number;
  rating: number;
  isActive: boolean;
  joinDate: string;
}

const Agents = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Simulate fetching data
    const fetchAgents = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockAgents: Agent[] = [
          {
            id: '1',
            name: 'Mike Wilson',
            email: 'mike.wilson@example.com',
            phone: '+1 (555) 123-4567',
            licenseNumber: 'LIC123456',
            propertiesCount: 15,
            dealsCount: 8,
            totalSales: 3200000,
            rating: 4.8,
            isActive: true,
            joinDate: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            name: 'Lisa Thompson',
            email: 'lisa.thompson@example.com',
            phone: '+1 (555) 987-6543',
            licenseNumber: 'LIC789012',
            propertiesCount: 22,
            dealsCount: 15,
            totalSales: 5800000,
            rating: 4.9,
            isActive: true,
            joinDate: '2023-12-01T09:15:00Z'
          },
          {
            id: '3',
            name: 'David Miller',
            email: 'david.miller@example.com',
            phone: '+1 (555) 456-7890',
            licenseNumber: 'LIC345678',
            propertiesCount: 8,
            dealsCount: 3,
            totalSales: 1200000,
            rating: 4.6,
            isActive: true,
            joinDate: '2024-02-20T16:45:00Z'
          },
          {
            id: '4',
            name: 'Anna Garcia',
            email: 'anna.garcia@example.com',
            phone: '+1 (555) 789-0123',
            licenseNumber: 'LIC901234',
            propertiesCount: 12,
            dealsCount: 6,
            totalSales: 2100000,
            rating: 4.7,
            isActive: false,
            joinDate: '2024-01-10T14:30:00Z'
          }
        ];
        setAgents(mockAgents);
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agent.licenseNumber.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && agent.isActive) ||
                         (filterStatus === 'inactive' && !agent.isActive);
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Agents & Team</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your real estate agents and team members.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm shadow-teal-200">
          <Plus className="w-4 h-4 mr-2" />
          Add Agent
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="relative w-full lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search agents by name, email, or license number..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{agent.name}</h3>
                    <p className="text-gray-500 text-sm">License: {agent.licenseNumber}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    agent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  } capitalize`}>
                    {agent.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{agent.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{agent.email}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Joined: {new Date(agent.joinDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 uppercase font-medium">Properties</div>
                  <div className="text-lg font-bold text-gray-900">{agent.propertiesCount}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 uppercase font-medium">Deals</div>
                  <div className="text-lg font-bold text-gray-900">{agent.dealsCount}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                  <div className="text-xs text-gray-500 uppercase font-medium">Total Sales</div>
                  <div className="text-lg font-bold text-gray-900">{formatCurrency(agent.totalSales)}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center py-2 px-3 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                  <Eye className="w-3 h-3 mr-2" />
                  View Profile
                </button>
                <button className="flex-1 flex items-center justify-center py-2 px-3 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                  <Edit className="w-3 h-3 mr-2" />
                  Edit
                </button>
                <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredAgents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
          <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No agents found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default Agents;