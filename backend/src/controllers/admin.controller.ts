import { Request, Response } from 'express';
import Property from '../models/mongodb/Property.mongoose.js';
import Contact from '../models/Contact.js';
import User from '../models/mongodb/User.mongoose.js';
import AdminSettings from '../models/AdminSettings.js';
import AdminNotification from '../models/AdminNotification.js';
import Deal from '../models/mongodb/Deal.mongoose.js';
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
    const contacts = await Contact.find({ type: 'property_inquiry' })
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
