import { Router, Request, Response } from 'express';
import DashboardConfig from '../models/DashboardConfig';

const router = Router();

const EMPTY_STATE = {
  layout: { lg: [], md: [], sm: [] },
  widgets: {},
  savedAt: null,
};

// GET /api/dashboard
router.get('/', async (_req: Request, res: Response) => {
  try {
    const config = await DashboardConfig.findOne({ key: 'default' });
    if (!config) {
      return res.json(EMPTY_STATE);
    }
    res.json({
      layout: config.layout,
      widgets: config.widgets,
      savedAt: config.savedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard config', error });
  }
});

// PUT /api/dashboard
router.put('/', async (req: Request, res: Response) => {
  try {
    const { layout, widgets } = req.body;
    const savedAt = new Date().toISOString();

    const config = await DashboardConfig.findOneAndUpdate(
      { key: 'default' },
      { key: 'default', layout, widgets, savedAt },
      { upsert: true, new: true }
    );

    res.json({
      layout: config.layout,
      widgets: config.widgets,
      savedAt: config.savedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save dashboard config', error });
  }
});

export default router;
