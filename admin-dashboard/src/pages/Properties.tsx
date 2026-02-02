import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Bed,
  Bath,
  Square,
  Loader2
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  status: 'active' | 'pending' | 'sold';
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  dateAdded: string;
}

const Properties = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Simulate fetching data
    const fetchProperties = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockProperties: Property[] = [
          {
            id: '1',
            title: 'Modern Downtown Loft',
            address: '123 Main St, Downtown',
            price: 450000,
            type: 'Apartment',
            status: 'active',
            beds: 2,
            baths: 2,
            sqft: 1200,
            image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=300',
            dateAdded: '2024-03-15'
          },
          {
            id: '2',
            title: 'Suburban Family Home',
            address: '456 Oak Ave, Suburbia',
            price: 850000,
            type: 'House',
            status: 'pending',
            beds: 4,
            baths: 3,
            sqft: 2400,
            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=300',
            dateAdded: '2024-03-14'
          },
          {
            id: '3',
            title: 'Luxury Beach Villa',
            address: '789 Ocean Dr, Seaside',
            price: 2100000,
            type: 'Villa',
            status: 'active',
            beds: 5,
            baths: 4,
            sqft: 3500,
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=300',
            dateAdded: '2024-03-12'
          },
          {
            id: '4',
            title: 'Cozy City Studio',
            address: '101 Pine St, City Center',
            price: 250000,
            type: 'Studio',
            status: 'sold',
            beds: 1,
            baths: 1,
            sqft: 500,
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=300',
            dateAdded: '2024-02-28'
          }
        ];
        setProperties(mockProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your property listings and inventory.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm shadow-teal-200">
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search properties..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-500" />
          <select 
            className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative h-48">
              <img 
                src={property.image} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)} capitalize shadow-sm`}>
                  {property.status}
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{property.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="line-clamp-1">{property.address}</span>
                  </div>
                </div>
                <div className="relative">
                  <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="text-xl font-bold text-teal-600 mb-4">
                ${property.price.toLocaleString()}
              </div>
              
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-1">
                  <Bed className="w-4 h-4 text-gray-400" />
                  <span>{property.beds} Beds</span>
                </div>
                <div className="flex items-center justify-center gap-1 border-l border-gray-100">
                  <Bath className="w-4 h-4 text-gray-400" />
                  <span>{property.baths} Baths</span>
                </div>
                <div className="flex items-center justify-center gap-1 border-l border-gray-100">
                  <Square className="w-4 h-4 text-gray-400" />
                  <span>{property.sqft} sqft</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button className="flex-1 flex items-center justify-center py-2 px-3 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                  <Edit className="w-3 h-3 mr-2" />
                  Edit
                </button>
                <button className="flex-1 flex items-center justify-center py-2 px-3 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                  <Eye className="w-3 h-3 mr-2" />
                  View
                </button>
                <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProperties.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
          <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default Properties;