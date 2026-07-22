import api from './api'

export const orderService = {
  placeOrder:         (data)          => api.post('/orders', data),
  getBuyerOrders:     (params)        => api.get('/orders/my', { params }),
  getSellerOrders:    (params)        => api.get('/orders/seller', { params }),
  getOrderById:       (id)            => api.get(`/orders/${id}`),
  updateOrderStatus:  (id, data)      => api.patch(`/orders/${id}/status`, data),
  cancelOrder:        (id)            => api.patch(`/orders/${id}/cancel`),
}
