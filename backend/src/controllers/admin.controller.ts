import { Request, Response } from 'express';
import Property from '../models/mongodb/Property.mongoose.js';
import Contact from '../models/Contact.js';
import User from '../models/mongodb/User.mongoose.js';
import AdminSettings from '../models/AdminSettings.js';
import AdminNotification from '../models/AdminNotification.js';
import Deal from '../models/mongodb/Deal.mongoose.js';
import { BlogComment } from '../models/mongodb/BlogComment.mongoose.js';
import { BlogPost } from '../models/mongodb/BlogPost.mongoose.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

const getMonthKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const getLastMonths = (count: number) => {
  const months: string[] = [];
  const cursor = new Date();
  cursor.setDate(1);
  for (let i = 0; i < count; i += 1) {
    months.unshift(getMonthKey(cursor));
    cursor.setMonth(cursor.getMonth() - 1);
  }
  return months;
};

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalProperties,
      activeProperties,
      totalLeads,
      pendingLeads,
      totalAgents,
      revenueAgg,
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: 'available' }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'agent' }),
      Property.aggregate([
        { $match: { status: 'sold' } },
        { $group: { _id: null, total: { $sum: '$priceValue' } } },
      ]),
    ]);

    const recentPropertiesRaw = await Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title price priceValue status createdAt');

    const recentProperties = recentPropertiesRaw.map((property) => ({
      id: property._id.toString(),
      title: property.title,
      price: property.price || property.priceValue?.toString() || 'N/A',
      status: property.status,
      date: property.createdAt?.toISOString(),
    }));

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name subject createdAt');

    const recentActivities = [
      ...recentContacts.map((contact) => ({
        user: contact.name,
        action: 'submitted an inquiry',
        target: contact.subject,
        time: contact.createdAt?.toISOString(),
      })),
      ...recentProperties.map((property) => ({
        user: 'System',
        action: 'listed property',
        target: property.title,
        time: property.date,
      })),
    ]
      .filter((activity) => activity.time)
      .sort((a, b) => (a.time && b.time ? b.time.localeCompare(a.time) : 0))
      .slice(0, 6);

    res.status(200).json({
      success: true,
      data: {
        totalProperties,
        totalLeads,
        totalRevenue: revenueAgg?.[0]?.total || 0,
        activeDeals: 0,
        activeProperties,
        pendingLeads,
        totalAgents,
        recentProperties,
        recentActivities,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard stats' });
  }
};

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const contacts = await Contact.find()
      .populate('propertyId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error('Leads error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch leads' });
  }
};

export const getInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const contacts = await Contact.find()
      .populate('propertyId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error('Inquiries error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch inquiries' });
  }
};

export const getDeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const deals = await Deal.find()
      .sort({ createdAt: -1 })
      .populate('property', 'title')
      .populate('buyer', 'name')
      .populate('seller', 'name')
      .populate('agent', 'name');

    const data = deals.map((deal) => ({
      id: deal._id.toString(),
      propertyId: deal.property?._id?.toString() || '',
      propertyTitle: (deal.property as any)?.title || '',
      buyerId: deal.buyer?._id?.toString() || '',
      buyerName: (deal.buyer as any)?.name || '',
      sellerId: deal.seller?._id?.toString() || '',
      sellerName: (deal.seller as any)?.name || '',
      agentId: deal.agent?._id?.toString() || '',
      agentName: (deal.agent as any)?.name || '',
      offerPrice: deal.offerPrice,
      acceptedPrice: deal.acceptedPrice,
      status: deal.status,
      createdAt: deal.createdAt?.toISOString(),
      updatedAt: deal.updatedAt?.toISOString(),
    }));

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Deals error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch deals' });
  }
};

export const createDeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const deal = await Deal.create(req.body);
    const populated = await Deal.findById(deal._id)
      .populate('property', 'title')
      .populate('buyer', 'name')
      .populate('seller', 'name')
      .populate('agent', 'name');

    if (!populated) {
      res.status(404).json({ success: false, error: 'Deal not found' });
      return;
    }

    const data = {
      id: populated._id.toString(),
      propertyId: populated.property?._id?.toString() || '',
      propertyTitle: (populated.property as any)?.title || '',
      buyerId: populated.buyer?._id?.toString() || '',
      buyerName: (populated.buyer as any)?.name || '',
      sellerId: populated.seller?._id?.toString() || '',
      sellerName: (populated.seller as any)?.name || '',
      agentId: populated.agent?._id?.toString() || '',
      agentName: (populated.agent as any)?.name || '',
      offerPrice: populated.offerPrice,
      acceptedPrice: populated.acceptedPrice,
      status: populated.status,
      createdAt: populated.createdAt?.toISOString(),
      updatedAt: populated.updatedAt?.toISOString(),
    };

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Create deal error:', error);
    res.status(500).json({ success: false, error: 'Failed to create deal' });
  }
};

export const updateDeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('property', 'title')
      .populate('buyer', 'name')
      .populate('seller', 'name')
      .populate('agent', 'name');

    if (!deal) {
      res.status(404).json({ success: false, error: 'Deal not found' });
      return;
    }

    const data = {
      id: deal._id.toString(),
      propertyId: deal.property?._id?.toString() || '',
      propertyTitle: (deal.property as any)?.title || '',
      buyerId: deal.buyer?._id?.toString() || '',
      buyerName: (deal.buyer as any)?.name || '',
      sellerId: deal.seller?._id?.toString() || '',
      sellerName: (deal.seller as any)?.name || '',
      agentId: deal.agent?._id?.toString() || '',
      agentName: (deal.agent as any)?.name || '',
      offerPrice: deal.offerPrice,
      acceptedPrice: deal.acceptedPrice,
      status: deal.status,
      createdAt: deal.createdAt?.toISOString(),
      updatedAt: deal.updatedAt?.toISOString(),
    };

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Update deal error:', error);
    res.status(500).json({ success: false, error: 'Failed to update deal' });
  }
};

export const approveDeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted' },
      { new: true }
    )
      .populate('property', 'title')
      .populate('buyer', 'name')
      .populate('seller', 'name')
      .populate('agent', 'name');

    if (!deal) {
      res.status(404).json({ success: false, error: 'Deal not found' });
      return;
    }

    const data = {
      id: deal._id.toString(),
      propertyId: deal.property?._id?.toString() || '',
      propertyTitle: (deal.property as any)?.title || '',
      buyerId: deal.buyer?._id?.toString() || '',
      buyerName: (deal.buyer as any)?.name || '',
      sellerId: deal.seller?._id?.toString() || '',
      sellerName: (deal.seller as any)?.name || '',
      agentId: deal.agent?._id?.toString() || '',
      agentName: (deal.agent as any)?.name || '',
      offerPrice: deal.offerPrice,
      acceptedPrice: deal.acceptedPrice,
      status: deal.status,
      createdAt: deal.createdAt?.toISOString(),
      updatedAt: deal.updatedAt?.toISOString(),
    };

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Approve deal error:', error);
    res.status(500).json({ success: false, error: 'Failed to approve deal' });
  }
};

export const closeDeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { status: 'closed' },
      { new: true }
    )
      .populate('property', 'title')
      .populate('buyer', 'name')
      .populate('seller', 'name')
      .populate('agent', 'name');

    if (!deal) {
      res.status(404).json({ success: false, error: 'Deal not found' });
      return;
    }

    const data = {
      id: deal._id.toString(),
      propertyId: deal.property?._id?.toString() || '',
      propertyTitle: (deal.property as any)?.title || '',
      buyerId: deal.buyer?._id?.toString() || '',
      buyerName: (deal.buyer as any)?.name || '',
      sellerId: deal.seller?._id?.toString() || '',
      sellerName: (deal.seller as any)?.name || '',
      agentId: deal.agent?._id?.toString() || '',
      agentName: (deal.agent as any)?.name || '',
      offerPrice: deal.offerPrice,
      acceptedPrice: deal.acceptedPrice,
      status: deal.status,
      createdAt: deal.createdAt?.toISOString(),
      updatedAt: deal.updatedAt?.toISOString(),
    };

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Close deal error:', error);
    res.status(500).json({ success: false, error: 'Failed to close deal' });
  }
};

export const getAgents = async (req: Request, res: Response): Promise<void> => {
  try {
    const agents = await User.find({ role: 'agent' }).select('name email phone createdAt isActive');

    const propertyCounts = await Property.aggregate([
      { $group: { _id: '$agent', count: { $sum: 1 } } },
    ]);

    const countsByAgent = propertyCounts.reduce<Record<string, number>>((acc, entry) => {
      acc[entry._id?.toString()] = entry.count;
      return acc;
    }, {});

    const data = agents.map((agent) => ({
      id: agent._id.toString(),
      name: agent.name,
      email: agent.email,
      phone: agent.phone || '',
      licenseNumber: '',
      propertiesCount: countsByAgent[agent._id.toString()] || 0,
      dealsCount: 0,
      totalSales: 0,
      rating: 0,
      isActive: agent.isActive ?? true,
      joinDate: agent.createdAt?.toISOString(),
    }));

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Agents error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch agents' });
  }
};

export const createAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, isActive } = req.body || {};
    if (!name || !email || !password) {
      res.status(400).json({ success: false, error: 'Name, email, and password are required' });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ success: false, error: 'User already exists' });
      return;
    }

    const agent = await User.create({
      name,
      email,
      password,
      phone,
      role: 'agent',
      isActive: isActive !== undefined ? !!isActive : true,
    });

    const data = {
      id: agent._id.toString(),
      name: agent.name,
      email: agent.email,
      phone: agent.phone || '',
      licenseNumber: '',
      propertiesCount: 0,
      dealsCount: 0,
      totalSales: 0,
      rating: 0,
      isActive: agent.isActive ?? true,
      joinDate: agent.createdAt?.toISOString(),
    };

    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({ success: false, error: 'Failed to create agent' });
  }
};

export const updateAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, isActive } = req.body || {};
    const update: Record<string, any> = {};
    if (name !== undefined) update.name = name;
    if (email !== undefined) update.email = email;
    if (phone !== undefined) update.phone = phone;
    if (isActive !== undefined) update.isActive = !!isActive;

    const agent = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'agent' },
      update,
      { new: true, runValidators: true }
    );

    if (!agent) {
      res.status(404).json({ success: false, error: 'Agent not found' });
      return;
    }

    const data = {
      id: agent._id.toString(),
      name: agent.name,
      email: agent.email,
      phone: agent.phone || '',
      licenseNumber: '',
      propertiesCount: 0,
      dealsCount: 0,
      totalSales: 0,
      rating: 0,
      isActive: agent.isActive ?? true,
      joinDate: agent.createdAt?.toISOString(),
    };

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Update agent error:', error);
    res.status(500).json({ success: false, error: 'Failed to update agent' });
  }
};

export const deleteAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    const agent = await User.findOneAndDelete({ _id: req.params.id, role: 'agent' });
    if (!agent) {
      res.status(404).json({ success: false, error: 'Agent not found' });
      return;
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete agent' });
  }
};

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('name subject createdAt');

    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('title createdAt');

    const upserts = [
      ...contacts.map((contact) => ({
        sourceType: 'contact' as const,
        sourceId: contact._id,
        type: 'new_lead' as const,
        title: 'New Lead',
        message: `${contact.name} submitted: ${contact.subject}`,
        createdAt: contact.createdAt,
      })),
      ...properties.map((property) => ({
        sourceType: 'property' as const,
        sourceId: property._id,
        type: 'property_update' as const,
        title: 'New Property',
        message: `Listed ${property.title}`,
        createdAt: property.createdAt,
      })),
    ];

    await Promise.all(
      upserts.map((item) =>
        AdminNotification.updateOne(
          { sourceType: item.sourceType, sourceId: item.sourceId },
          { $setOnInsert: item },
          { upsert: true }
        )
      )
    );

    const notifications = await AdminNotification.find()
      .sort({ createdAt: -1 })
      .limit(12);

    res.status(200).json({
      success: true,
      data: notifications.map((n) => ({
        id: n._id.toString(),
        type: n.type,
        title: n.title,
        message: n.message,
        read: userId ? n.readBy?.some((id) => id.toString() === userId.toString()) : false,
        createdAt: n.createdAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
  }
};

export const updateNotificationRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { read } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authorized' });
      return;
    }

    const update = read
      ? { $addToSet: { readBy: userId } }
      : { $pull: { readBy: userId } };

    const notification = await AdminNotification.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!notification) {
      res.status(404).json({ success: false, error: 'Notification not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: notification._id.toString(),
        type: notification.type,
        title: notification.title,
        message: notification.message,
        read: notification.readBy?.some((id) => id.toString() === userId.toString()),
        createdAt: notification.createdAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({ success: false, error: 'Failed to update notification' });
  }
};

export const updateAllNotificationsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { read } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authorized' });
      return;
    }

    if (read) {
      await AdminNotification.updateMany({}, { $addToSet: { readBy: userId } });
    } else {
      await AdminNotification.updateMany({}, { $pull: { readBy: userId } });
    }

    res.status(200).json({ success: true, data: { read: !!read } });
  } catch (error) {
    console.error('Update all notifications error:', error);
    res.status(500).json({ success: false, error: 'Failed to update notifications' });
  }
};

export const getRevenueReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { start, end } = req.query;
    const startDate = start ? new Date(String(start)) : null;
    const endDate = end ? new Date(String(end)) : null;
    const dateMatch: Record<string, Date> = {};
    if (startDate && !isNaN(startDate.getTime())) {
      dateMatch.$gte = startDate;
    }
    if (endDate && !isNaN(endDate.getTime())) {
      dateMatch.$lte = endDate;
    }

    const match: Record<string, any> = { status: 'sold' };
    if (Object.keys(dateMatch).length > 0) {
      match.updatedAt = dateMatch;
    }

    const months = getLastMonths(12);

    const revenueAgg = await Property.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: '$updatedAt' },
            month: { $month: '$updatedAt' },
          },
          revenue: { $sum: '$priceValue' },
        },
      },
    ]);

    const revenueByMonth = revenueAgg.reduce<Record<string, number>>((acc, entry) => {
      const month = String(entry._id.month).padStart(2, '0');
      const key = `${entry._id.year}-${month}`;
      acc[key] = entry.revenue;
      return acc;
    }, {});

    const monthlyRevenue = months.map((month) => ({
      month,
      revenue: revenueByMonth[month] || 0,
    }));

    const totalRevenue = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error('Revenue report error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch revenue report' });
  }
};

export const getLeadSourcesReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Contact.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: data.map((entry) => ({
        source: entry._id || 'unknown',
        count: entry.count,
      })),
    });
  } catch (error) {
    console.error('Lead sources report error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch lead sources report' });
  }
};

export const getPropertyTypesReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Property.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: data.map((entry) => ({
        type: entry._id || 'unknown',
        count: entry.count,
      })),
    });
  } catch (error) {
    console.error('Property types report error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch property types report' });
  }
};

export const getAdminSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await AdminSettings.findOne({ key: 'default' });
    if (!settings) {
      settings = await AdminSettings.create({ key: 'default' });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Admin settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch settings' });
  }
};

export const updateAdminSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await AdminSettings.findOneAndUpdate(
      { key: 'default' },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: settings });
  } catch (error: any) {
    console.error('Update admin settings error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors,
      });
      return;
    }
    res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
};

export const getBlogComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;
    const postId = req.query.postId ? String(req.query.postId) : null;
    const search = req.query.q ? String(req.query.q).trim() : '';

    const filter: Record<string, any> = {};
    if (postId) filter.post = postId;
    if (search) filter.content = { $regex: search, $options: 'i' };

    const [total, comments] = await Promise.all([
      BlogComment.countDocuments(filter),
      BlogComment.find(filter)
        .populate('user', 'name email avatar authorRole role isActive')
        .populate('post', 'title slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: {
        comments: comments.map((comment) => ({
          id: comment._id.toString(),
          content: comment.content,
          createdAt: comment.createdAt?.toISOString(),
          updatedAt: comment.updatedAt?.toISOString(),
          status: comment.status,
          hiddenAt: comment.hiddenAt?.toISOString() || null,
          user: comment.user
            ? {
                id: (comment.user as any)._id?.toString(),
                name: (comment.user as any).name,
                email: (comment.user as any).email,
                avatar: (comment.user as any).avatar,
                role: (comment.user as any).authorRole || (comment.user as any).role,
                isActive: (comment.user as any).isActive ?? true,
              }
            : null,
          post: comment.post
            ? {
                id: (comment.post as any)._id?.toString(),
                title: (comment.post as any).title,
                slug: (comment.post as any).slug,
              }
            : null,
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          limit,
        },
      },
    });
  } catch (error) {
    console.error('Admin blog comments error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch blog comments' });
  }
};

export const deleteBlogComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const comment = await BlogComment.findById(req.params.id);
    if (!comment) {
      res.status(404).json({ success: false, error: 'Comment not found' });
      return;
    }

    const postId = comment.post?.toString();
    const wasVisible = comment.status !== 'hidden';
    await comment.deleteOne();

    if (postId && wasVisible) {
      await BlogPost.updateOne({ _id: postId }, { $inc: { commentsCount: -1 } });
      await BlogPost.updateOne({ _id: postId, commentsCount: { $lt: 0 } }, { $set: { commentsCount: 0 } });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Admin delete blog comment error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete blog comment' });
  }
};

export const updateBlogCommentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body || {};
    if (status !== 'visible' && status !== 'hidden') {
      res.status(400).json({ success: false, error: 'Invalid status' });
      return;
    }

    const comment = await BlogComment.findById(req.params.id);
    if (!comment) {
      res.status(404).json({ success: false, error: 'Comment not found' });
      return;
    }

    const wasVisible = comment.status !== 'hidden';
    comment.status = status;
    comment.hiddenAt = status === 'hidden' ? new Date() : null;
    comment.hiddenBy = status === 'hidden' && (req as any).user ? (req as any).user._id : null;
    await comment.save();

    if (comment.post) {
      if (wasVisible && status === 'hidden') {
        await BlogPost.updateOne({ _id: comment.post }, { $inc: { commentsCount: -1 } });
        await BlogPost.updateOne({ _id: comment.post, commentsCount: { $lt: 0 } }, { $set: { commentsCount: 0 } });
      } else if (!wasVisible && status === 'visible') {
        await BlogPost.updateOne({ _id: comment.post }, { $inc: { commentsCount: 1 } });
      }
    }

    res.status(200).json({ success: true, data: { id: comment._id.toString(), status: comment.status } });
  } catch (error) {
    console.error('Admin update blog comment status error:', error);
    res.status(500).json({ success: false, error: 'Failed to update comment status' });
  }
};

export const bulkModerateBlogComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { action, ids } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ success: false, error: 'No comment ids provided' });
      return;
    }

    const comments = await BlogComment.find({ _id: { $in: ids } });

    if (action === 'delete') {
      const visibleCounts = comments.reduce<Record<string, number>>((acc, comment) => {
        if (comment.status !== 'hidden') {
          const key = comment.post?.toString() || '';
          if (key) acc[key] = (acc[key] || 0) + 1;
        }
        return acc;
      }, {});

      await BlogComment.deleteMany({ _id: { $in: ids } });

      await Promise.all(
        Object.entries(visibleCounts).map(([postId, count]) =>
          BlogPost.updateOne({ _id: postId }, { $inc: { commentsCount: -count } })
        )
      );
      await BlogPost.updateMany({ commentsCount: { $lt: 0 } }, { $set: { commentsCount: 0 } });

      res.status(200).json({ success: true, data: { action: 'delete', count: ids.length } });
      return;
    }

    if (action === 'hide' || action === 'unhide') {
      const toHide = action === 'hide';
      const status = toHide ? 'hidden' : 'visible';

      const byPost = comments.reduce<Record<string, { hide: number; unhide: number }>>((acc, comment) => {
        const postId = comment.post?.toString();
        if (!postId) return acc;
        if (!acc[postId]) acc[postId] = { hide: 0, unhide: 0 };
        if (comment.status !== 'hidden' && toHide) acc[postId].hide += 1;
        if (comment.status === 'hidden' && !toHide) acc[postId].unhide += 1;
        return acc;
      }, {});

      await BlogComment.updateMany(
        { _id: { $in: ids } },
        {
          $set: {
            status,
            hiddenAt: toHide ? new Date() : null,
            hiddenBy: toHide && (req as any).user ? (req as any).user._id : null,
          },
        }
      );

      await Promise.all(
        Object.entries(byPost).map(([postId, counts]) => {
          const delta = counts.unhide - counts.hide;
          if (delta === 0) return Promise.resolve();
          return BlogPost.updateOne({ _id: postId }, { $inc: { commentsCount: delta } });
        })
      );
      await BlogPost.updateMany({ commentsCount: { $lt: 0 } }, { $set: { commentsCount: 0 } });

      res.status(200).json({ success: true, data: { action, count: ids.length } });
      return;
    }

    res.status(400).json({ success: false, error: 'Invalid action' });
  } catch (error) {
    console.error('Admin bulk blog comment moderation error:', error);
    res.status(500).json({ success: false, error: 'Failed to moderate comments' });
  }
};
