import React, { useState, useEffect, useMemo } from 'react';
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
  Loader2,
  ArrowUp,
  ArrowDown,
  X,
  Map as MapIcon
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L, { LeafletMouseEvent } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty, uploadFile } from '../services/api';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  status: 'active' | 'pending' | 'sold' | 'rented';
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [featuredUploading, setFeaturedUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const initialFormState = {
    title: '',
    description: '',
    priceValue: '',
    price: '',
    type: 'apartment',
    category: 'sale',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
    beds: '',
    baths: '',
    sqft: '',
    status: 'available',
    featured: false,
    featuredImage: '',
    images: [] as string[],
    amenities: '',
    features: '',
    longitude: '',
    latitude: '',
    virtualTourUrl: '',
    floorPlanUrl: '',
    videoUrl: '',
  };
  const [formState, setFormState] = useState(initialFormState);

  const MapPicker = ({ value, onChange }: { value: [number, number]; onChange: (coords: [number, number]) => void }) => {
    const Picker = () => {
      useMapEvents({
        click(e: LeafletMouseEvent) {
          onChange([e.latlng.lat, e.latlng.lng]);
        },
      });
      return null;
    };

    return (
      <MapContainer key={`${value[0]}-${value[1]}`} center={value} zoom={12} className="h-64 w-full rounded-lg border">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={value} />
        <Picker />
      </MapContainer>
    );
  };

  const mapCenter = useMemo(() => {
    const lat = Number(formState.latitude);
    const lng = Number(formState.longitude);
    if (!Number.isNaN(lat) && !Number.isNaN(lng) && lat && lng) {
      return [lat, lng] as [number, number];
    }
    return [9.0765, 7.3986] as [number, number]; // Abuja fallback
  }, [formState.latitude, formState.longitude]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties() as any[];
        const mapped = data.map((property: any) => ({
          id: property._id || property.id,
          title: property.title,
          address: property.address || property.location?.address || '',
          price: property.priceValue || property.price || 0,
          type: property.type || property.propertyType,
          status: property.status === 'available' ? 'active' : property.status,
          beds: property.beds ?? property.bedrooms ?? 0,
          baths: property.baths ?? property.bathrooms ?? 0,
          sqft: property.sqft ?? property.squareFeet ?? 0,
          image: property.featuredImage || property.images?.[0] || '',
          dateAdded: property.createdAt,
        }));
        setProperties(mapped);
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
      case 'rented': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFeaturedUpload = async (file: File) => {
    try {
      setFeaturedUploading(true);
      const result = await uploadFile(file);
      setFormState((prev) => ({ ...prev, featuredImage: result.url }));
    } catch (error) {
      console.error('Failed to upload featured image:', error);
      setFormError('Failed to upload featured image.');
    } finally {
      setFeaturedUploading(false);
    }
  };

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      setGalleryUploading(true);
      const uploads: string[] = [];
      for (const file of Array.from(files)) {
        const result = await uploadFile(file);
        if (result.url) uploads.push(result.url);
      }
      setFormState((prev) => ({ ...prev, images: [...prev.images, ...uploads] }));
    } catch (error) {
      console.error('Failed to upload gallery images:', error);
      setFormError('Failed to upload gallery images.');
    } finally {
      setGalleryUploading(false);
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    setFormState((prev) => {
      const images = [...prev.images];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= images.length) return prev;
      [images[index], images[target]] = [images[target], images[index]];
      return { ...prev, images };
    });
  };

  const removeImage = (index: number) => {
    setFormState((prev) => {
      const images = prev.images.filter((_, i) => i !== index);
      return { ...prev, images };
    });
  };

  const clearImages = () => {
    setFormState((prev) => ({ ...prev, images: [] }));
  };

  const openEditModal = async (propertyId: string) => {
    setFormError('');
    setShowCreateModal(false);
    setEditingId(propertyId);
    setShowEditModal(true);
    try {
      const property = await getPropertyById(propertyId) as any;
      const coords = property.coordinates || [];
      setFormState({
        title: property.title || '',
        description: property.description || '',
        priceValue: String(property.priceValue || ''),
        price: property.price || '',
        type: property.type || 'apartment',
        category: property.category || 'sale',
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zipCode: property.zipCode || '',
        country: property.country || 'Nigeria',
        beds: String(property.beds ?? ''),
        baths: String(property.baths ?? ''),
        sqft: String(property.sqft ?? ''),
        status: property.status || 'available',
        featured: Boolean(property.featured),
        featuredImage: property.featuredImage || '',
        images: property.images || [],
        amenities: (property.amenities || []).join(', '),
        features: (property.features || []).join(', '),
        longitude: coords[0] !== undefined ? String(coords[0]) : '',
        latitude: coords[1] !== undefined ? String(coords[1]) : '',
        virtualTourUrl: property.virtualTourUrl || '',
        floorPlanUrl: property.floorPlanUrl || '',
        videoUrl: property.videoUrl || '',
      });
    } catch (error) {
      console.error('Failed to load property:', error);
      setFormError('Failed to load property details.');
    }
  };

  const handleCreateProperty = async () => {
    setFormError('');
    if (!formState.title || !formState.description || !formState.priceValue || !formState.address || !formState.city || !formState.state || !formState.zipCode || !formState.beds || !formState.baths || !formState.sqft || !formState.featuredImage || !formState.longitude || !formState.latitude) {
      setFormError('Please fill in all required fields.');
      return;
    }
    try {
      setFormLoading(true);
      const priceValueNum = Number(formState.priceValue);
      const bedsNum = Number(formState.beds);
      const bathsNum = Number(formState.baths);
      const sqftNum = Number(formState.sqft);
      const lng = Number(formState.longitude);
      const lat = Number(formState.latitude);

      const payload = {
        title: formState.title,
        description: formState.description,
        priceValue: priceValueNum,
        price: formState.price || priceValueNum.toLocaleString(),
        type: formState.type,
        category: formState.category,
        address: formState.address,
        city: formState.city,
        state: formState.state,
        zipCode: formState.zipCode,
        country: formState.country,
        beds: bedsNum,
        baths: bathsNum,
        sqft: sqftNum,
        status: formState.status,
        featured: formState.featured,
        featuredImage: formState.featuredImage,
        images: formState.images,
        amenities: formState.amenities.split(',').map((t) => t.trim()).filter(Boolean),
        features: formState.features.split(',').map((t) => t.trim()).filter(Boolean),
        coordinates: [lng, lat],
        virtualTourUrl: formState.virtualTourUrl || undefined,
        floorPlanUrl: formState.floorPlanUrl || undefined,
        videoUrl: formState.videoUrl || undefined,
      };

      const created = await createProperty(payload as any) as any;
      const mapped = {
        id: (created as any)._id || created.id,
        title: created.title,
        address: created.address,
        price: created.priceValue || priceValueNum,
        type: created.type,
        status: created.status === 'available' ? 'active' : created.status,
        beds: created.beds,
        baths: created.baths,
        sqft: created.sqft,
        image: created.featuredImage || created.images?.[0] || '',
        dateAdded: created.createdAt || new Date().toISOString(),
      } as Property;
      setProperties((prev) => [mapped, ...prev]);
      setShowCreateModal(false);
      setShowEditModal(false);
      setEditingId(null);
      setFormState(initialFormState);
    } catch (error) {
      console.error('Failed to create property:', error);
      setFormError('Failed to create property.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSaveProperty = async () => {
    if (!editingId) {
      await handleCreateProperty();
      return;
    }
    setFormError('');
    if (!formState.title || !formState.description || !formState.priceValue || !formState.address || !formState.city || !formState.state || !formState.zipCode || !formState.beds || !formState.baths || !formState.sqft || !formState.featuredImage || !formState.longitude || !formState.latitude) {
      setFormError('Please fill in all required fields.');
      return;
    }
    try {
      setFormLoading(true);
      const priceValueNum = Number(formState.priceValue);
      const bedsNum = Number(formState.beds);
      const bathsNum = Number(formState.baths);
      const sqftNum = Number(formState.sqft);
      const lng = Number(formState.longitude);
      const lat = Number(formState.latitude);
      const payload = {
        title: formState.title,
        description: formState.description,
        priceValue: priceValueNum,
        price: formState.price || priceValueNum.toLocaleString(),
        type: formState.type,
        category: formState.category,
        address: formState.address,
        city: formState.city,
        state: formState.state,
        zipCode: formState.zipCode,
        country: formState.country,
        beds: bedsNum,
        baths: bathsNum,
        sqft: sqftNum,
        status: formState.status,
        featured: formState.featured,
        featuredImage: formState.featuredImage,
        images: formState.images,
        amenities: formState.amenities.split(',').map((t) => t.trim()).filter(Boolean),
        features: formState.features.split(',').map((t) => t.trim()).filter(Boolean),
        coordinates: [lng, lat],
        virtualTourUrl: formState.virtualTourUrl || undefined,
        floorPlanUrl: formState.floorPlanUrl || undefined,
        videoUrl: formState.videoUrl || undefined,
      };
      const updated = await updateProperty(editingId, payload as any) as any;
      const mapped = {
        id: (updated as any)._id || updated.id,
        title: updated.title,
        address: updated.address,
        price: updated.priceValue || priceValueNum,
        type: updated.type,
        status: updated.status === 'available' ? 'active' : updated.status,
        beds: updated.beds,
        baths: updated.baths,
        sqft: updated.sqft,
        image: updated.featuredImage || updated.images?.[0] || '',
        dateAdded: updated.createdAt || new Date().toISOString(),
      } as Property;
      setProperties((prev) => prev.map((p) => (p.id === editingId ? mapped : p)));
      setShowEditModal(false);
      setEditingId(null);
      setFormState(initialFormState);
    } catch (error) {
      console.error('Failed to update property:', error);
      setFormError('Failed to update property.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (propertyId: string) => {
    try {
      await deleteProperty(propertyId);
      setProperties((prev) => prev.filter((property) => property.id !== propertyId));
    } catch (error) {
      console.error('Failed to delete property:', error);
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
        <button
          onClick={() => {
            setFormState(initialFormState);
            setEditingId(null);
            setShowEditModal(false);
            setShowCreateModal(true);
          }}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm shadow-teal-200"
        >
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
            <option value="rented">Rented</option>
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
                <button
                  onClick={() => openEditModal(property.id)}
                  className="flex-1 flex items-center justify-center py-2 px-3 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <Edit className="w-3 h-3 mr-2" />
                  Edit
                </button>
                <button className="flex-1 flex items-center justify-center py-2 px-3 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                  <Eye className="w-3 h-3 mr-2" />
                  View
                </button>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
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

      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{showEditModal ? 'Edit Property' : 'Add Property'}</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setEditingId(null);
                  setFormState(initialFormState);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded mb-3 text-sm">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Title *</label>
                <input
                  type="text"
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Type *</label>
                <select
                  value={formState.type}
                  onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Description *</label>
                <textarea
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Category *</label>
                <select
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status *</label>
                <select
                  value={formState.status}
                  onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Price Value *</label>
                <input
                  type="number"
                  value={formState.priceValue}
                  onChange={(e) => setFormState({ ...formState, priceValue: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Display Price</label>
                <input
                  type="text"
                  value={formState.price}
                  onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="₦15,000,000"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Beds *</label>
                <input
                  type="number"
                  value={formState.beds}
                  onChange={(e) => setFormState({ ...formState, beds: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Baths *</label>
                <input
                  type="number"
                  value={formState.baths}
                  onChange={(e) => setFormState({ ...formState, baths: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Square Feet *</label>
                <input
                  type="number"
                  value={formState.sqft}
                  onChange={(e) => setFormState({ ...formState, sqft: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Address *</label>
                <input
                  type="text"
                  value={formState.address}
                  onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">City *</label>
                <input
                  type="text"
                  value={formState.city}
                  onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">State *</label>
                <input
                  type="text"
                  value={formState.state}
                  onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Zip Code *</label>
                <input
                  type="text"
                  value={formState.zipCode}
                  onChange={(e) => setFormState({ ...formState, zipCode: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Country *</label>
                <input
                  type="text"
                  value={formState.country}
                  onChange={(e) => setFormState({ ...formState, country: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Longitude *</label>
                <input
                  type="number"
                  value={formState.longitude}
                  onChange={(e) => setFormState({ ...formState, longitude: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Latitude *</label>
                <input
                  type="number"
                  value={formState.latitude}
                  onChange={(e) => setFormState({ ...formState, latitude: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapIcon className="h-4 w-4" />
                  Click on the map to set coordinates.
                </div>
                <MapPicker
                  value={mapCenter}
                  onChange={(coords) => {
                    setFormState((prev) => ({
                      ...prev,
                      latitude: coords[0].toString(),
                      longitude: coords[1].toString(),
                    }));
                  }}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Amenities (comma separated)</label>
                <input
                  type="text"
                  value={formState.amenities}
                  onChange={(e) => setFormState({ ...formState, amenities: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  value={formState.features}
                  onChange={(e) => setFormState({ ...formState, features: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-2">Featured Image *</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFeaturedUpload(file);
                      e.currentTarget.value = '';
                    }}
                    className="block w-full text-sm text-gray-600"
                  />
                  {featuredUploading && <span className="text-xs text-gray-500">Uploading...</span>}
                </div>
                {formState.featuredImage && (
                  <div className="mt-3">
                    <img src={formState.featuredImage} alt="Featured preview" className="w-full max-h-48 object-cover rounded-lg border" />
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-2">Gallery Images</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      handleGalleryUpload(e.target.files);
                      e.currentTarget.value = '';
                    }}
                    className="block w-full text-sm text-gray-600"
                  />
                  {galleryUploading && <span className="text-xs text-gray-500">Uploading...</span>}
                </div>
                {formState.images.length > 0 && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Reorder or remove images</span>
                    <button
                      type="button"
                      onClick={clearImages}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                )}
                {formState.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {formState.images.map((img, idx) => (
                      <div key={`${img}-${idx}`} className="relative group">
                        <img src={img} alt="Gallery" className="h-20 w-full object-cover rounded-lg border" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveImage(idx, 'up')}
                            className="p-1 bg-white/90 rounded"
                          >
                            <ArrowUp className="h-3 w-3 text-gray-700" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(idx, 'down')}
                            className="p-1 bg-white/90 rounded"
                          >
                            <ArrowDown className="h-3 w-3 text-gray-700" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="p-1 bg-white/90 rounded"
                          >
                            <X className="h-3 w-3 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Virtual Tour URL</label>
                <input
                  type="url"
                  value={formState.virtualTourUrl}
                  onChange={(e) => setFormState({ ...formState, virtualTourUrl: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Floor Plan URL</label>
                <input
                  type="url"
                  value={formState.floorPlanUrl}
                  onChange={(e) => setFormState({ ...formState, floorPlanUrl: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Video URL</label>
                <input
                  type="url"
                  value={formState.videoUrl}
                  onChange={(e) => setFormState({ ...formState, videoUrl: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  id="featured-flag"
                  type="checkbox"
                  checked={formState.featured}
                  onChange={(e) => setFormState({ ...formState, featured: e.target.checked })}
                />
                <label htmlFor="featured-flag" className="text-sm text-gray-600">Mark as featured</label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProperty}
                disabled={formLoading}
                className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {formLoading ? (showEditModal ? 'Saving...' : 'Creating...') : (showEditModal ? 'Save Changes' : 'Create Property')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
