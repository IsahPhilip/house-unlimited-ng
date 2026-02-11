import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Camera,
  Heart,
  Home as HomeIcon,
  Settings,
  Star,
} from 'lucide-react';
import { Page, User } from '../types';
import { getWishlist, getMyReviews } from '../services/api';

interface UserProfilePageProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  onNavigateProperty: (id: string) => void;
  onUpdateProfile: (updates: Partial<User>) => void;
  onUpdateAvatar: (file: File) => Promise<void>;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({
  user,
  onNavigate,
  onNavigateProperty,
  onUpdateProfile,
  onUpdateAvatar,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'reviews' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });
  const [wishlistProperties, setWishlistProperties] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [notificationPrefs, setNotificationPrefs] = useState(() => ({
    email: user?.preferences?.emailNotifications,
    sms: user?.preferences?.smsNotifications,
  }));

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your profile</h2>
          <button
            onClick={() => onNavigate('home')}
            className="bg-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const [wishlistData, reviewsData] = await Promise.all([
          getWishlist(),
          getMyReviews(),
        ]);
        setWishlistProperties(wishlistData || []);
        setUserReviews(reviewsData || []);
      } catch (error) {
        console.error('Failed to load profile data:', error);
      }
    };

    if (user) {
      loadProfileData();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setEditForm({
      name: user.name || '',
      phone: user.phone || '',
      bio: user.bio || '',
      location: user.location || '',
    });
    setNotificationPrefs({
      email: user.preferences?.emailNotifications,
      sms: user.preferences?.smsNotifications,
    });
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleAvatarSelect = () => {
    setAvatarError(null);
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please choose an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Image must be under 2MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setAvatarUploading(true);
    setAvatarError(null);

    try {
      await onUpdateAvatar(file);
      setAvatarPreview(null);
    } catch (error) {
      setAvatarError('Failed to upload avatar. Please try again.');
    } finally {
      setAvatarUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const profileCompletion = useMemo(() => {
    if (!user) return 0;
    const fields = [
      user.name,
      user.email,
      user.phone,
      user.location,
      user.bio,
      user.avatar,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [user]);

  const memberSinceLabel = useMemo(() => {
    if (!user?.joinDate) return 'Not set';
    const date = new Date(user.joinDate);
    if (Number.isNaN(date.getTime())) return 'Not set';
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  }, [user?.joinDate]);

  const activityItems = useMemo(() => {
    const items: { key: string; title: string; icon: typeof Heart; colorClass: string; date?: string }[] = [];
    wishlistProperties.forEach((property: any) => {
      items.push({
        key: `wishlist-${property._id || property.id}`,
        title: `Saved "${property.title}" to wishlist`,
        icon: Heart,
        colorClass: 'bg-teal-100 text-teal-600',
        date: property.savedAt || property.createdAt || property.updatedAt,
      });
    });
    userReviews.forEach((review: any) => {
      items.push({
        key: `review-${review._id || review.id}`,
        title: `Left a review for "${review.property?.title || 'a property'}"`,
        icon: Star,
        colorClass: 'bg-green-100 text-green-600',
        date: review.createdAt || review.date,
      });
    });

    const withDate = items.filter((item) => item.date);
    if (withDate.length > 0) {
      return items.sort((a, b) => {
        const aTime = a.date ? new Date(a.date).getTime() : 0;
        const bTime = b.date ? new Date(b.date).getTime() : 0;
        return bTime - aTime;
      });
    }
    return items;
  }, [wishlistProperties, userReviews]);

  const handleSaveProfile = () => {
    onUpdateProfile(editForm);
    setIsEditing(false);
  };

  const ProfileHeader = () => (
    <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="relative">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Selected avatar preview"
              className="w-32 h-32 rounded-full object-cover shadow-lg"
            />
          ) : user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            type="button"
            onClick={handleAvatarSelect}
            disabled={avatarUploading}
            className="absolute bottom-0 right-0 bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          {avatarError && (
            <p className="mt-3 text-sm text-red-600">{avatarError}</p>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
          <p className="text-gray-600 mb-4">{user.email}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{wishlistProperties.length}</div>
              <div className="text-sm text-gray-600">Saved Properties</div>
            </div>
            <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{userReviews.length}</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{memberSinceLabel}</div>
              <div className="text-sm text-gray-600">Member Since</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{profileCompletion}%</div>
              <div className="text-sm text-gray-600">Profile Completion</div>
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
          <button className="bg-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-700">
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
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'properties', label: 'Saved Properties', icon: Heart },
          { id: 'reviews', label: 'My Reviews', icon: Star },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        )})}
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        {activityItems.length > 0 ? (
          <div className="space-y-4">
            {activityItems.slice(0, 6).map((activity) => {
              const Icon = activity.icon;
              const dateLabel = activity.date
                ? new Date(activity.date).toLocaleDateString()
                : null;
              return (
                <div key={activity.key} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    {dateLabel && <p className="text-sm text-gray-600">{dateLabel}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-600">
            No recent activity yet.
          </div>
        )}
      </div>
    </div>
  );

  const PropertiesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Saved Properties ({wishlistProperties.length})</h2>
        <button
          onClick={() => onNavigate('wishlist')}
          className="text-teal-600 hover:underline font-medium"
        >
          View All
        </button>
      </div>

      {wishlistProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlistProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <img src={property.featuredImage || property.image || property.images?.[0]} alt={property.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                <p className="text-teal-600 font-bold mb-2">{property.price || property.priceValue}</p>
                <p className="text-gray-600 text-sm mb-4">{property.address}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {property.beds} beds • {property.baths} baths • {property.sqft} sqft
                  </div>
                  <button
                    onClick={() => onNavigateProperty(property._id || property.id)}
                    className="text-teal-600 hover:underline text-sm font-medium"
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
          <div className="text-6xl mb-4 flex justify-center text-teal-600">
            <HomeIcon className="w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold mb-2">No saved properties yet</h3>
          <p className="text-gray-600 mb-6">Start exploring properties and save your favorites!</p>
          <button
            onClick={() => onNavigate('property')}
            className="bg-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-700"
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
          {userReviews.map((review) => (
            <div key={review._id || review.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{review.property?.title || 'Unknown Property'}</h3>
                  <p className="text-sm text-gray-600">{new Date(review.createdAt || review.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={star <= review.rating ? 'text-yellow-400 w-4 h-4' : 'text-gray-300 w-4 h-4'}
                      fill={star <= review.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 italic">"{review.comment}"</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <div className="text-6xl mb-4 flex justify-center text-yellow-400">
            <Star className="w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold mb-2">No reviews yet</h3>
          <p className="text-gray-600 mb-6">Share your experience by reviewing properties you've viewed!</p>
          <button
            onClick={() => onNavigate('property')}
            className="bg-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-700"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSaveProfile}
                className="bg-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-700"
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

          {typeof notificationPrefs.email === 'boolean' && typeof notificationPrefs.sms === 'boolean' ? (
            <>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive updates about new properties</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationPrefs.email}
                    onChange={(e) => {
                      const next = { ...notificationPrefs, email: e.target.checked };
                      setNotificationPrefs(next);
                      onUpdateProfile({ preferences: { ...(user.preferences || {}), emailNotifications: next.email } as User['preferences'] });
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-medium">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Get text alerts for inquiries</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationPrefs.sms}
                    onChange={(e) => {
                      const next = { ...notificationPrefs, sms: e.target.checked };
                      setNotificationPrefs(next);
                      onUpdateProfile({ preferences: { ...(user.preferences || {}), smsNotifications: next.sms } as User['preferences'] });
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </>
          ) : (
            <div className="py-4 text-sm text-gray-600 border-b border-gray-100">
              Notification preferences are not configured for this account.
            </div>
          )}

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
              className="hover:text-teal-600 transition-colors font-medium"
            >
              <span className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </span>
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
