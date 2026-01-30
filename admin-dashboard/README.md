# Real Estate Admin Dashboard

A modern, responsive CRM dashboard for real estate administrators and agents.

## Features

### 📊 Dashboard
- KPI cards with real-time metrics
- Interactive charts (leads over time, properties by status, deals funnel)
- Recent activity feed
- Quick action buttons

### 🏠 Properties Management
- Comprehensive property listings with filtering and sorting
- Multi-step property creation wizard
- Image gallery with drag-and-drop upload
- Detailed property profiles with amenities, features, and documents

### 👥 Leads & CRM
- Unified contact management
- Lead tracking through sales pipeline
- Interaction timeline (calls, emails, notes)
- Lead source tracking and analytics

### 🤝 Deals Pipeline
- Visual Kanban board for deal stages
- Drag-and-drop deal management
- Deal probability tracking
- Commission calculations

### 👨‍💼 Agents & Team
- Agent performance tracking
- Role-based access control
- Agent profiles and specialties

### 📧 Inquiries
- Centralized message inbox
- Property-specific inquiries
- Response tracking

### 📈 Reports & Analytics
- Lead source performance
- Property view analytics
- Agent leaderboard
- Sales trends and forecasting

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Chart.js with React Chartjs 2
- **Animations**: Framer Motion
- **Notifications**: Sonner
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context + useReducer

## Getting Started

### Installation

```bash
cd admin-dashboard
npm install
npm run dev
```

### Project Structure

```
src/
├── components/       # Reusable UI components
│   └── layout/       # Layout components (MainLayout)
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── contexts/         # React context providers
├── utils/            # Utility functions
├── types/            # TypeScript interfaces
├── api/             # API service functions
├── mock-data/       # Mock data for development
├── assets/           # Static assets
```

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Development Notes

### Authentication Integration

The dashboard is designed to integrate with the existing backend authentication system:

1. **Protected Routes**: Use the `protect` middleware from the backend
2. **Role-Based Access**: Implement role checks using the `authorize` middleware
3. **JWT Tokens**: Store and manage tokens securely

### API Integration

Connect to the backend API by creating service functions in `src/api/`:

```typescript
// Example API service
export const fetchProperties = async (token: string) => {
  const response = await fetch('/api/properties', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

### Deployment

The dashboard can be deployed as a standalone application or integrated with the main real estate platform.

## Design System

### Colors
- **Primary**: Blue palette for main actions and branding
- **Secondary**: Pink/Purple palette for accents and highlights
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

### Spacing
- Consistent 4px scale (4, 8, 12, 16, 20, 24, etc.)

## Future Enhancements

- Real-time updates with WebSockets
- Advanced filtering and search
- Export functionality (CSV, PDF)
- Dark mode support
- Multi-language support
- Mobile app integration