/**
 * Notification Service Utility
 * Handles dispatching notifications for order confirmations, seller alerts, and status changes.
 */

const sendOrderConfirmationNotification = async (order) => {
  try {
    const payload = {
      recipient: order.buyerEmail || 'buyer@example.com',
      subject: `Order Confirmation #${order._id} - Local Artisan Marketplace`,
      body: `Hello ${order.buyerName || 'Valued Customer'},

Thank you for your purchase on Local Artisan! Your order #${order._id} has been successfully placed.

Order Summary:
Total Amount: ₹${order.totalAmount?.toLocaleString('en-IN')}
Payment Method: ${order.paymentMethod || 'UPI'} (${order.paymentStatus || 'Completed'})
Shipping Address: ${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}

Items Ordered:
${order.items?.map(i => `- ${i.title} (Qty: ${i.quantity}) - ₹${i.price}`).join('\n')}

Our rural artisans have been notified and will prepare your handmade items for dispatch soon!

Warm regards,
Local Artisan Marketplace Team`,
      sentAt: new Date()
    };

    console.log('[NOTIFICATION SERVICE] Buyer Order Confirmation Sent:', payload.subject, 'to', payload.recipient);
    return payload;
  } catch (err) {
    console.error('[NOTIFICATION SERVICE] Error sending order confirmation:', err);
  }
};

const sendSellerOrderNotification = async (order) => {
  try {
    const payload = {
      subject: `New Craft Order Received #${order._id}`,
      body: `Great news! A new order #${order._id} has been placed for your craft products by ${order.buyerName}.

Total Value: ₹${order.totalAmount}
Delivery City: ${order.shippingAddress?.city}

Please log in to your Artisan Studio Dashboard to review and fulfill this order.`,
      sentAt: new Date()
    };

    console.log('[NOTIFICATION SERVICE] Seller New Order Alert Sent for Order:', order._id);
    return payload;
  } catch (err) {
    console.error('[NOTIFICATION SERVICE] Error sending seller order alert:', err);
  }
};

const sendStatusUpdateNotification = async (order, status, note) => {
  try {
    const payload = {
      recipient: order.buyerEmail || 'buyer@example.com',
      subject: `Order #${order._id} Status Update: ${status}`,
      body: `Hello ${order.buyerName || 'Valued Customer'},

Your craft order #${order._id} status has been updated to "${status}".

Note from Artisan: ${note || `Fulfillment progress updated to ${status}`}

You can track your live order progress anytime on your My Orders dashboard.

Warm regards,
Local Artisan Marketplace Team`,
      sentAt: new Date()
    };

    console.log('[NOTIFICATION SERVICE] Buyer Status Update Notification Sent:', payload.subject, 'to', payload.recipient);
    return payload;
  } catch (err) {
    console.error('[NOTIFICATION SERVICE] Error sending status update notification:', err);
  }
};

module.exports = {
  sendOrderConfirmationNotification,
  sendSellerOrderNotification,
  sendStatusUpdateNotification
};
