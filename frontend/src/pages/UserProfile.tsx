import React, { useState } from 'react';
import { Page, User, Property, Review } from '../types';
import { PROPERTIES } from '../utils/mockData';

interface UserProfilePageProps {
  user: User | null;
  wishlistIds: number[];
  reviews: Review[];
  onNavigate: (page: Page) => void;
  onUpdateProfile: (updates: Partial<User>) => void;
  onWishlistToggle: (id: number) => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({
  user,
  wishlistIds,
  reviews,
  onNavigate,
  onUpdateProfile,
  onWishlistToggle
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'reviews' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your profile</h2>
          <button
            onClick={() => onNavigate('home')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const userReviews = reviews.filter(review => review.userName === user.name);
  const wishlistProperties = PROPERTIES.filter(property => wishlistIds.includes(property.id));

  const handleSaveProfile = () => {
    onUpdateProfile(editForm);
    setIsEditing(false);
  };

  const ProfileHeader = () => (
    <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700">
            📷
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
          <p className="text-gray-600 mb-4">{user.email}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{wishlistIds.length}</div>
              <div className="text-sm text-gray-600">Saved Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userReviews.length}</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-gray-600">Searches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-600">Months Active</div>
            </div>
          </div>

          {user.bio && (
            <p className="text-gray-700 italic">{user.bio}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700">
            Share Profile
          </button>
        </div>
      </div>
    </div>
  );

  const TabNavigation = () => (
    <div className="bg-white rounded-2xl p-2 shadow-sm mb-8">
      <div className="flex space-x-2">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'properties', label: 'Saved Properties', icon: '❤️' },
          { id: 'reviews', label: 'My Reviews', icon: '⭐' },
          { id: 'settings', label: 'Settings', icon: '⚙️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">❤️</div>
            <div className="flex-1">
              <p className="font-medium">Saved "Riverview Retreat" to wishlist</p>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">⭐</div>
            <div className="flex-1">
              <p className="font-medium">Left a review for "Modern Downtown Loft"</p>
              <p className="text-sm text-gray-600">1 day ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">🔍</div>
            <div className="flex-1">
              <p className="font-medium">Searched for apartments in downtown</p>
              <p className="text-sm text-gray-600">3 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="text-3xl mb-2">🏠</div>
          <div className="text-2xl font-bold text-blue-600 mb-1">24</div>
          <div className="text-sm text-gray-600">Properties Viewed</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="text-3xl mb-2">📞</div>
          <div className="text-2xl font-bold text-green-600 mb-1">8</div>
          <div className="text-sm text-gray-600">Agent Inquiries</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="text-3xl mb-2">📈</div>
          <div className="text-2xl font-bold text-purple-600 mb-1">92%</div>
          <div className="text-sm text-gray-600">Profile Completion</div>
        </div>
      </div>
    </div>
  );

  const PropertiesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Saved Properties ({wishlistProperties.length})</h2>
        <button
          onClick={() => onNavigate('wishlist')}
          className="text-blue-600 hover:underline font-medium"
        >
          View All
        </button>
      </div>

      {wishlistProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlistProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                <p className="text-blue-600 font-bold mb-2">{property.price}</p>
                <p className="text-gray-600 text-sm mb-4">{property.address}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {property.beds} beds • {property.baths} baths • {property.sqft} sqft
                  </div>
                  <button
                    onClick={() => onNavigate('property-details')}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-bold mb-2">No saved properties yet</h3>
          <p className="text-gray-600 mb-6">Start exploring properties and save your favorites!</p>
          <button
            onClick={() => onNavigate('property')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700"
          >
            Browse Properties
          </button>
        </div>
      )}
    </div>
  );

  const ReviewsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Reviews ({userReviews.length})</h2>

      {userReviews.length > 0 ? (
        <div className="space-y-6">
          {userReviews.map((review) => {
            const property = PROPERTIES.find(p => p.id === review.propertyId);
            return (
              <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{property?.title || 'Unknown Property'}</h3>
                    <p className="text-sm text-gray-600">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 italic">"{review.comment}"</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-bold mb-2">No reviews yet</h3>
          <p className="text-gray-600 mb-6">Share your experience by reviewing properties you've viewed!</p>
          <button
            onClick={() => onNavigate('property')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700"
          >
            Explore Properties
          </button>
        </div>
      )}
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-8">
      {/* Profile Settings */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                placeholder="City, State"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSaveProfile}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                <p className="text-lg">{user.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                <p className="text-lg">{user.location || 'Not provided'}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Bio</label>
              <p className="text-lg">{user.bio || 'No bio added yet'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
        <div className="space-y-6">
          <div className="flex justify-between items-center py-4 border-b border-gray-100">
            <div>
              <h3 className="font-medium">Change Password</h3>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              Change
            </button>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-gray-100">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-600">Receive updates about new properties</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-gray-100">
            <div>
              <h3 className="font-medium">SMS Notifications</h3>
              <p className="text-sm text-gray-600">Get text alerts for inquiries</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-medium hover:bg-red-100">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50/40 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-blue-600 transition-colors font-medium"
            >
              ← Back to Home
            </button>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-900">My Profile</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <ProfileHeader />
        <TabNavigation />

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'properties' && <PropertiesTab />}
        {activeTab === 'reviews' && <ReviewsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

export default UserProfilePage;
