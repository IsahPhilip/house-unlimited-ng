import express from 'express';
import { getPublicMedia } from '../controllers/public.controller.js';

const router = express.Router();

router.get('/media', getPublicMedia);

export default router;
