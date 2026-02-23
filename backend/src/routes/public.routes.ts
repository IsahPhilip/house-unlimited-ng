import express from 'express';
import { getPublicMedia, getPublicSiteContent } from '../controllers/public.controller.js';

const router = express.Router();

router.get('/media', getPublicMedia);
router.get('/site-content', getPublicSiteContent);

export default router;
