import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Properties from './pages/Properties';
import Blog from './pages/Blog';
import BlogForm from './components/BlogForm';
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
            <Route path="leads" element={<div>Leads Page</div>} />
            <Route path="deals" element={<div>Deals Page</div>} />
            <Route path="agents" element={<div>Agents Page</div>} />
            <Route path="inquiries" element={<div>Inquiries Page</div>} />
            <Route path="reports" element={<div>Reports Page</div>} />
            <Route path="settings" element={<div>Settings Page</div>} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
