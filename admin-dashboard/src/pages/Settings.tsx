import React, { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Database, 
  Mail, 
  Save, 
  Edit, 
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, updateProfile } from '../services/api';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [authorLoading, setAuthorLoading] = useState(true);
  const [authorSaving, setAuthorSaving] = useState(false);
  const [authorError, setAuthorError] = useState<string>('');
  const [authorProfile, setAuthorProfile] = useState({
    name: '',
    email: '',
    avatar: '',
    bio: '',
    authorRole: '',
  });
  const [formData, setFormData] = useState({
    companyName: 'Real Estate Platform',
    companyEmail: 'info@realestate.com',
    companyPhone: '+1 (555) 123-4567',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 60,
      passwordExpiry: 90
    },
    integrations: {
      mailchimp: false,
      googleAnalytics: true,
      zapier: false
    }
  });
  const { checkAuth } = useAuth();

  const sections: SettingSection[] = [
    {
      id: 'author',
      title: 'Author Profile',
      description: 'Update your public blog author information.',
      icon: <User className="w-5 h-5" />
    },
    {
      id: 'general',
      title: 'General Settings',
      description: 'Manage your company information and basic settings.',
      icon: <SettingsIcon className="w-5 h-5" />
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure how you want to be notified.',
      icon: <Bell className="w-5 h-5" />
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Manage your account security settings.',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Connect with third-party services.',
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: 'database',
      title: 'Database',
      description: 'Manage database backups and maintenance.',
      icon: <Database className="w-5 h-5" />
    },
    {
      id: 'users',
      title: 'Users & Permissions',
      description: 'Manage user accounts and permissions.',
      icon: <User className="w-5 h-5" />
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSection === 'author') {
      setAuthorSaving(true);
      setAuthorError('');

      try {
        await updateProfile({
          name: authorProfile.name,
          avatar: authorProfile.avatar || undefined,
          bio: authorProfile.bio || undefined,
          authorRole: authorProfile.authorRole || undefined,
        });
        await checkAuth();
      } catch (error) {
        setAuthorError('Failed to update author profile.');
        console.error('Error saving author profile:', error);
      } finally {
        setAuthorSaving(false);
      }
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Wire real settings API when available.
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved:', formData);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadAuthorProfile = async () => {
      try {
        setAuthorLoading(true);
        const profile = await getProfile();
        setAuthorProfile({
          name: profile.name || '',
          email: profile.email || '',
          avatar: profile.avatar || '',
          bio: profile.bio || '',
          authorRole: profile.authorRole || '',
        });
      } catch (error) {
        setAuthorError('Failed to load author profile.');
        console.error('Error loading author profile:', error);
      } finally {
        setAuthorLoading(false);
      }
    };

    loadAuthorProfile();
  }, []);

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Email</label>
            <input
              type="email"
              value={formData.companyEmail}
              onChange={(e) => setFormData({...formData, companyEmail: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Phone</label>
            <input
              type="tel"
              value={formData.companyPhone}
              onChange={(e) => setFormData({...formData, companyPhone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({...formData, timezone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="UTC">UTC</option>
              <option value="EST">EST</option>
              <option value="PST">PST</option>
              <option value="GMT">GMT</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select
              value={formData.dateFormat}
              onChange={(e) => setFormData({...formData, dateFormat: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({...formData, currency: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="NGN">NGN - Nigerian Naira</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAuthorProfile = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Author Profile</h3>
      <p className="text-sm text-gray-500 mb-6">
        This information appears on public blog posts.
      </p>

      {authorError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {authorError}
        </div>
      )}

      {authorLoading ? (
        <div className="flex items-center text-gray-500">
          <Loader2 className="animate-spin h-4 w-4 mr-2" />
          Loading author profile...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <input
              type="text"
              value={authorProfile.name}
              onChange={(e) => setAuthorProfile({ ...authorProfile, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={authorProfile.email}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Author Role</label>
            <input
              type="text"
              value={authorProfile.authorRole}
              onChange={(e) => setAuthorProfile({ ...authorProfile, authorRole: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Editor in Chief"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
            <input
              type="url"
              value={authorProfile.avatar}
              onChange={(e) => setAuthorProfile({ ...authorProfile, avatar: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Bio</label>
            <textarea
              value={authorProfile.bio}
              onChange={(e) => setAuthorProfile({ ...authorProfile, bio: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Tell readers a bit about yourself..."
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <input
            type="checkbox"
            checked={formData.notifications.email}
            onChange={(e) => setFormData({
              ...formData,
              notifications: {...formData.notifications, email: e.target.checked}
            })}
            className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
          />
        </div>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-500">Receive browser push notifications</p>
          </div>
          <input
            type="checkbox"
            checked={formData.notifications.push}
            onChange={(e) => setFormData({
              ...formData,
              notifications: {...formData.notifications, push: e.target.checked}
            })}
            className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
          />
        </div>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">SMS Notifications</h4>
            <p className="text-sm text-gray-500">Receive notifications via SMS</p>
          </div>
          <input
            type="checkbox"
            checked={formData.notifications.sms}
            onChange={(e) => setFormData({
              ...formData,
              notifications: {...formData.notifications, sms: e.target.checked}
            })}
            className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
          />
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <input
              type="checkbox"
              checked={formData.security.twoFactorAuth}
              onChange={(e) => setFormData({
                ...formData,
                security: {...formData.security, twoFactorAuth: e.target.checked}
              })}
              className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={formData.security.sessionTimeout}
                onChange={(e) => setFormData({
                  ...formData,
                  security: {...formData.security, sessionTimeout: parseInt(e.target.value)}
                })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
              <input
                type="number"
                value={formData.security.passwordExpiry}
                onChange={(e) => setFormData({
                  ...formData,
                  security: {...formData.security, passwordExpiry: parseInt(e.target.value)}
                })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Change Password</h4>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Third-Party Integrations</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Mailchimp</h4>
              <p className="text-sm text-gray-500">Connect your Mailchimp account for email marketing</p>
            </div>
            <input
              type="checkbox"
              checked={formData.integrations.mailchimp}
              onChange={(e) => setFormData({
                ...formData,
                integrations: {...formData.integrations, mailchimp: e.target.checked}
              })}
              className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
            />
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Google Analytics</h4>
              <p className="text-sm text-gray-500">Track website analytics and user behavior</p>
            </div>
            <input
              type="checkbox"
              checked={formData.integrations.googleAnalytics}
              onChange={(e) => setFormData({
                ...formData,
                integrations: {...formData.integrations, googleAnalytics: e.target.checked}
              })}
              className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
            />
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Zapier</h4>
              <p className="text-sm text-gray-500">Connect with 1000+ apps for automation</p>
            </div>
            <input
              type="checkbox"
              checked={formData.integrations.zapier}
              onChange={(e) => setFormData({
                ...formData,
                integrations: {...formData.integrations, zapier: e.target.checked}
              })}
              className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Keys</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Public API Key</h4>
              <p className="text-sm text-gray-500">Use this key for public API requests</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Copy
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Regenerate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDatabase = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Database Backup</h4>
              <p className="text-sm text-gray-500">Create a backup of your database</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create Backup
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Database Optimization</h4>
              <p className="text-sm text-gray-500">Optimize database performance</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Optimize
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Backups</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Full Backup - March 2024</h4>
              <p className="text-sm text-gray-500">Size: 2.5 GB • Created: 2 days ago</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Download
              </button>
              <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Users & Permissions</h3>
          <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Last Login</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Admin User</div>
                      <div className="text-gray-500 text-sm">admin@example.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Admin
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">2 hours ago</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch(activeSection) {
      case 'author': return renderAuthorProfile();
      case 'general': return renderGeneralSettings();
      case 'notifications': return renderNotifications();
      case 'security': return renderSecurity();
      case 'integrations': return renderIntegrations();
      case 'database': return renderDatabase();
      case 'users': return renderUsers();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Configure your admin dashboard settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings Menu</h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    activeSection === section.id ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {section.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{section.title}</div>
                    <div className="text-xs text-gray-500">{section.description}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit}>
            {renderSection()}
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || authorSaving}
                  className="flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(activeSection === 'author' ? authorSaving : isLoading) ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
