import api from './api'

export const cartService = {
  getCart:        ()                    => api.get('/cart'),
  addToCart:      (productId, quantity) => api.post('/cart/add', { productId, quantity }),
  updateCartItem: (productId, quantity) => api.patch('/cart/update', { productId, quantity }),
  removeFromCart: (productId)           => api.delete(`/cart/remove/${productId}`),
  clearCart:      ()                    => api.delete('/cart/clear'),
}
