import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { 
  getDashboardStats, 
  getLeads, 
  getDeals, 
  createDeal,
  updateDeal,
  approveDeal,
  closeDeal,
  getAgents, 
  getInquiries,
  getNotifications,
  updateNotificationRead,
  updateAllNotificationsRead,
  getRevenueReport,
  getLeadSourcesReport,
  getPropertyTypesReport,
  getAdminSettings,
  updateAdminSettings,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/leads', getLeads);
router.get('/deals', getDeals);
router.post('/deals', createDeal);
router.put('/deals/:id', updateDeal);
router.patch('/deals/:id/approve', approveDeal);
router.patch('/deals/:id/close', closeDeal);
router.get('/agents', getAgents);
router.get('/inquiries', getInquiries);
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', updateNotificationRead);
router.patch('/notifications/read-all', updateAllNotificationsRead);

router.get('/reports/revenue', getRevenueReport);
router.get('/reports/lead-sources', getLeadSourcesReport);
router.get('/reports/property-types', getPropertyTypesReport);

router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);

export default router;
