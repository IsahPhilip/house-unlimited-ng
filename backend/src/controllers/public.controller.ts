import { Request, Response } from 'express';
import AdminSettings from '../models/AdminSettings.js';
import { defaultSiteContent } from '../constants/siteContent.js';

export const getPublicMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await AdminSettings.findOne({ key: 'default' }).lean();
    res.status(200).json({
      success: true,
      data: settings?.mediaGallery || [],
    });
  } catch (error) {
    console.error('Public media error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch media' });
  }
};

export const getPublicSiteContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await AdminSettings.findOne({ key: 'default' }).lean();
    res.status(200).json({
      success: true,
      data: settings?.siteContent || defaultSiteContent,
    });
  } catch (error) {
    console.error('Public site content error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch site content' });
  }
};
