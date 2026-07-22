import api from './api'

export const wishlistService = {
  getWishlist:         ()          => api.get('/wishlist'),
  addToWishlist:       (productId) => api.post(`/wishlist/add/${productId}`),
  removeFromWishlist:  (productId) => api.delete(`/wishlist/remove/${productId}`),
  checkWishlist:       (productId) => api.get(`/wishlist/check/${productId}`),
}
