import { Router, Request, Response } from 'express';
import Order from '../models/Order';

const router = Router();

// GET /api/orders
router.get('/', async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
});

// POST /api/orders
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      firstName, lastName, email, phone, street, city, state,
      postalCode, country, product, quantity, unitPrice, status, createdBy,
    } = req.body;

    const errors: Record<string, string> = {};
    const required = { firstName, lastName, email, phone, street, city, state, postalCode, country, product, createdBy };
    for (const [field, value] of Object.entries(required)) {
      if (!value || String(value).trim() === '') {
        errors[field] = 'Please fill the field';
      }
    }
    if (quantity === undefined || quantity === null || quantity === '') errors.quantity = 'Please fill the field';
    if (unitPrice === undefined || unitPrice === null || unitPrice === '') errors.unitPrice = 'Please fill the field';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const totalAmount = Number(quantity) * Number(unitPrice);
    const order = new Order({
      firstName, lastName, email, phone, street, city, state,
      postalCode, country, product,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      totalAmount,
      status: status || 'Pending',
      createdBy,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error });
  }
});

// PUT /api/orders/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.quantity !== undefined && updates.unitPrice !== undefined) {
      updates.totalAmount = Number(updates.quantity) * Number(updates.unitPrice);
    }

    const order = await Order.findOneAndUpdate({ id }, updates, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error });
  }
});

// DELETE /api/orders/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findOneAndDelete({ id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete order', error });
  }
});

// DELETE /api/orders — bulk delete by ids array
router.delete('/', async (req: Request, res: Response) => {
  try {
    const { ids } = req.body as { ids: string[] };
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'ids array is required' });
    }
    await Order.deleteMany({ id: { $in: ids } });
    res.json({ message: `${ids.length} order(s) deleted` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to bulk delete orders', error });
  }
});

export default router;
