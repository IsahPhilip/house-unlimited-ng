import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Properties from './pages/Properties';
import Blog from './pages/Blog';
import BlogForm from './components/BlogForm';
import Leads from './pages/Leads';
import Deals from './pages/Deals';
import Agents from './pages/Agents';
import Inquiries from './pages/Inquiries';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/create" element={<BlogForm isEditing={false} />} />
            <Route path="blog/edit/:id" element={<BlogForm isEditing={true} />} />
            <Route path="leads" element={<Leads />} />
            <Route path="deals" element={<Deals />} />
            <Route path="agents" element={<Agents />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
