import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* Add more routes here */}
          <Route path="properties" element={<div>Properties Page</div>} />
          <Route path="leads" element={<div>Leads Page</div>} />
          <Route path="deals" element={<div>Deals Page</div>} />
          <Route path="agents" element={<div>Agents Page</div>} />
          <Route path="inquiries" element={<div>Inquiries Page</div>} />
          <Route path="reports" element={<div>Reports Page</div>} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;