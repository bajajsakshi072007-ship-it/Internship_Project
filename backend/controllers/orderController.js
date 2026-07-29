const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const {
  sendOrderConfirmationNotification,
  sendSellerOrderNotification,
  sendStatusUpdateNotification
} = require('../utils/notificationService');

const isDBConnected = () => mongoose.connection.readyState === 1;

let localOrders = [
  {
    _id: 'ord_1001',
    buyer: 'mock_buyer_1',
    buyerName: 'Rahul Sharma',
    buyerEmail: 'rahul.sharma@example.com',
    items: [
      {
        product: 'prod_1',
        artisan: 'mock_artisan_1',
        title: 'Handcrafted Terracotta Clay Water Vessel',
        price: 650,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'
      }
    ],
    shippingAddress: {
      street: '42 MG Road, Sector 14',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122001',
      phone: '+91 9876543210'
    },
    paymentMethod: 'UPI',
    paymentStatus: 'Completed',
    orderStatus: 'Shipped',
    totalAmount: 1300,
    timeline: [
      { status: 'Pending', note: 'Order placed by buyer', updatedAt: new Date(Date.now() - 86400000 * 2) },
      { status: 'Processing', note: 'Craft packed with protective eco-padding', updatedAt: new Date(Date.now() - 86400000) },
      { status: 'Shipped', note: 'Handed to India Post / Courier (Tracking #IND84920)', updatedAt: new Date() }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2)
  },
  {
    _id: 'ord_1002',
    buyer: 'mock_buyer_1',
    buyerName: 'Priya Patel',
    buyerEmail: 'priya.p@example.com',
    items: [
      {
        product: 'prod_2',
        artisan: 'mock_artisan_1',
        title: 'Madhubani Hand-Painted Canvas Wall Art',
        price: 1800,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800'
      }
    ],
    shippingAddress: {
      street: '15 Civil Lines',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302006',
      phone: '+91 9123456789'
    },
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    totalAmount: 1800,
    timeline: [
      { status: 'Pending', note: 'Order received. Awaiting dispatch preparation.', updatedAt: new Date() }
    ],
    createdAt: new Date()
  }
];

// @desc    Create new order (Buyer)
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart items are required to place an order' });
    }

    const buyerId = req.user.id || req.user._id || 'mock_buyer_1';
    const buyerName = req.user.name || 'Buyer';
    const buyerEmail = req.user.email || 'buyer@example.com';

    const timeline = [
      { status: 'Pending', note: 'Order placed successfully by buyer.', updatedAt: new Date() }
    ];

    if (isDBConnected()) {
      const order = await Order.create({
        buyer: buyerId,
        buyerName,
        buyerEmail,
        items,
        shippingAddress,
        paymentMethod: paymentMethod || 'UPI',
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
        orderStatus: 'Pending',
        totalAmount,
        timeline
      });

      // Reduce product stock
      for (const item of items) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
        }
      }

      // Dispatch notifications asynchronously
      sendOrderConfirmationNotification(order);
      sendSellerOrderNotification(order);

      return res.status(201).json(order);
    } else {
      const newOrder = {
        _id: 'ord_' + Date.now(),
        buyer: buyerId,
        buyerName,
        buyerEmail,
        items,
        shippingAddress,
        paymentMethod: paymentMethod || 'UPI',
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
        orderStatus: 'Pending',
        totalAmount,
        timeline,
        createdAt: new Date()
      };

      localOrders.unshift(newOrder);

      // Dispatch notifications asynchronously
      sendOrderConfirmationNotification(newOrder);
      sendSellerOrderNotification(newOrder);

      return res.status(201).json(newOrder);
    }
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
};

// @desc    Get buyer's order history
// @route   GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const buyerId = req.user.id || req.user._id || 'mock_buyer_1';

    if (isDBConnected()) {
      const orders = await Order.find({ buyer: buyerId }).sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      const orders = localOrders.filter(
        o => o.buyer.toString() === buyerId.toString() || o.buyer === 'mock_buyer_1'
      );
      return res.json(orders);
    }
  } catch (error) {
    console.error('Fetch My Orders Error:', error);
    res.status(500).json({ message: 'Error fetching order history', error: error.message });
  }
};

// @desc    Get orders containing products listed by logged-in Artisan
// @route   GET /api/orders/artisan/orders
const getArtisanOrders = async (req, res) => {
  try {
    const artisanId = req.user.id || req.user._id;

    if (isDBConnected()) {
      const orders = await Order.find({ 'items.artisan': artisanId }).sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      // Return all mock orders for artisan demo
      return res.json(localOrders);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artisan orders', error: error.message });
  }
};

// @desc    Update order fulfillment status (Artisan / Admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status type' });
    }

    if (isDBConnected()) {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      order.orderStatus = status;
      if (status === 'Delivered') order.paymentStatus = 'Completed';

      const updateNote = note || `Status updated to ${status} by artisan`;
      order.timeline.push({
        status,
        note: updateNote,
        updatedAt: new Date()
      });

      await order.save();

      // Dispatch status update notification asynchronously
      sendStatusUpdateNotification(order, status, updateNote);

      return res.json(order);
    } else {
      const order = localOrders.find(o => o._id.toString() === id.toString());
      if (!order) return res.status(404).json({ message: 'Order not found' });

      order.orderStatus = status;
      if (status === 'Delivered') order.paymentStatus = 'Completed';

      const updateNote = note || `Status updated to ${status} by artisan`;
      order.timeline.push({
        status,
        note: updateNote,
        updatedAt: new Date()
      });

      // Dispatch status update notification asynchronously
      sendStatusUpdateNotification(order, status, updateNote);

      return res.json(order);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

// @desc    Get artisan analytics stats (Total Revenue, Monthly Revenue timeline, Top Products, Pending/Delivered counts)
// @route   GET /api/orders/artisan/analytics
const getArtisanAnalytics = async (req, res) => {
  try {
    const artisanId = req.user.id || req.user._id || 'mock_artisan_1';

    let ordersList = [];
    if (isDBConnected()) {
      ordersList = await Order.find({
        $or: [
          { 'items.artisan': artisanId },
          { 'items.artisan': 'mock_artisan_1' }
        ]
      }).sort({ createdAt: -1 });
    } else {
      ordersList = localOrders;
    }

    const totalOrders = ordersList.length;
    let totalRevenue = 0;
    let pendingOrders = 0;
    let deliveredOrders = 0;

    // Monthly revenue aggregation bucket (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = {};
    
    // Pre-populate last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]}`;
      monthlyMap[key] = 0;
    }

    // Top products aggregation map
    const productStatsMap = {};

    ordersList.forEach(order => {
      if (order.orderStatus !== 'Cancelled') {
        const orderRev = order.totalAmount || 0;
        totalRevenue += orderRev;

        // Group into monthly bucket
        const orderDate = new Date(order.createdAt || Date.now());
        const mKey = monthNames[orderDate.getMonth()];
        if (monthlyMap[mKey] !== undefined) {
          monthlyMap[mKey] += orderRev;
        } else {
          monthlyMap[mKey] = orderRev;
        }

        // Aggregate top products
        order.items?.forEach(item => {
          const title = item.title || 'Handcrafted Craft';
          if (!productStatsMap[title]) {
            productStatsMap[title] = { name: title, sales: 0, revenue: 0 };
          }
          productStatsMap[title].sales += item.quantity || 1;
          productStatsMap[title].revenue += (item.price || 0) * (item.quantity || 1);
        });
      }

      if (order.orderStatus === 'Pending' || order.orderStatus === 'Processing') {
        pendingOrders++;
      } else if (order.orderStatus === 'Delivered') {
        deliveredOrders++;
      }
    });

    // Format monthly revenue array
    const monthlyRevenue = Object.keys(monthlyMap).map(month => ({
      month,
      revenue: monthlyMap[month]
    }));

    // Format top products list
    const topProducts = Object.values(productStatsMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return res.json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      averageRating: 4.9,
      monthlyRevenue,
      topProducts
    });
  } catch (error) {
    console.error('Analytics Aggregation Error:', error);
    res.status(500).json({ message: 'Error calculating analytics', error: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getArtisanOrders,
  updateOrderStatus,
  getArtisanAnalytics
};
