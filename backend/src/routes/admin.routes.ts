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
  createAgent,
  updateAgent,
  deleteAgent,
  getInquiries,
  getNotifications,
  updateNotificationRead,
  updateAllNotificationsRead,
  getRevenueReport,
  getLeadSourcesReport,
  getPropertyTypesReport,
  getAdminSettings,
  updateAdminSettings,
  getBlogComments,
  deleteBlogComment,
  updateBlogCommentStatus,
  bulkModerateBlogComments,
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
router.post('/agents', createAgent);
router.put('/agents/:id', updateAgent);
router.delete('/agents/:id', deleteAgent);
router.get('/inquiries', getInquiries);
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', updateNotificationRead);
router.patch('/notifications/read-all', updateAllNotificationsRead);

router.get('/reports/revenue', getRevenueReport);
router.get('/reports/lead-sources', getLeadSourcesReport);
router.get('/reports/property-types', getPropertyTypesReport);

router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);

router.get('/blog/comments', getBlogComments);
router.delete('/blog/comments/:id', deleteBlogComment);
router.patch('/blog/comments/:id/status', updateBlogCommentStatus);
router.post('/blog/comments/bulk', bulkModerateBlogComments);

export default router;
