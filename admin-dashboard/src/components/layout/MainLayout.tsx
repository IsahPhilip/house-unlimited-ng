import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import {
  LayoutDashboard,
  Home,
  Building2,
  Users,
  MessageSquare,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  User,
  ChevronDown,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Sidebar navigation items
const sidebarItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    name: 'Properties',
    path: '/properties',
    icon: <Building2 className="h-5 w-5" />
  },
  {
    name: 'Leads/CRM',
    path: '/leads',
    icon: <Users className="h-5 w-5" />
  },
  {
    name: 'Deals Pipeline',
    path: '/deals',
    icon: <Users className="h-5 w-5" />
  },
  {
    name: 'Agents/Team',
    path: '/agents',
    icon: <User className="h-5 w-5" />
  },
  {
    name: 'Inquiries',
    path: '/inquiries',
    icon: <MessageSquare className="h-5 w-5" />
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: <BarChart2 className="h-5 w-5" />
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: <Settings className="h-5 w-5" />
  }
];

// Mock notifications
const mockNotifications = [
  {
    id: '1',
    type: 'new_lead',
    title: 'New Lead',
    message: 'John Doe submitted a new lead for property #123',
    read: false,
    createdAt: '2023-01-15T10:30:00'
  },
  {
    id: '2',
    type: 'deal_update',
    title: 'Deal Update',
    message: 'Offer accepted for property #456',
    read: true,
    createdAt: '2023-01-14T15:45:00'
  }
];

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-sm"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 lg:hidden z-40 bg-black bg-opacity-50"
            onClick={toggleSidebar}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-6 w-6 text-primary-600" />
                    <span className="font-semibold text-lg">Real Estate CRM</span>
                  </div>
                  <button onClick={toggleSidebar}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <nav className="p-4 space-y-2">
                {sidebarItems.map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.path
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                    }}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </a>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex flex-col flex-grow overflow-y-auto">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary-600" />
              <span className="font-semibold text-lg">Real Estate CRM</span>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Top Navbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties, leads, deals..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={toggleNotifications}
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                  >
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b last:border-b-0 ${
                              !notification.read ? 'bg-blue-50' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                {notification.type === 'new_lead' && (
                                  <Users className="h-5 w-5 text-blue-500" />
                                )}
                                {notification.type === 'deal_update' && (
                                  <Users className="h-5 w-5 text-green-500" />
                                )}
                                {notification.type === 'appointment' && (
                                  <Calendar className="h-5 w-5 text-purple-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-gray-900">{notification.title}</h4>
                                  {!notification.read && (
                                    <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notification.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t">
                      <button
                        className="w-full text-sm text-primary-600 hover:bg-gray-50 py-2"
                        onClick={() => {
                          setNotifications(notifications.map(n => ({ ...n, read: true })));
                          setNotificationsOpen(false);
                        }}
                      >
                        Mark all as read
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">{user?.name || 'User'}</span>
                <span className="text-xs text-gray-500 capitalize">{user?.role || 'user'}</span>
              </div>
              <img
                src={user?.avatar || 'https://i.pravatar.cc/150?u=default'}
                alt="User avatar"
                className="h-8 w-8 rounded-full"
              />
              <button className="p-1 hover:bg-gray-100 rounded-full">
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Toaster for notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
}