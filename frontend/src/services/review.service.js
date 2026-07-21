import api from './api'

export const reviewService = {
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  addReview:         (productId, data)   => api.post(`/reviews/product/${productId}`, data),
  updateReview:      (id, data)          => api.put(`/reviews/${id}`, data),
  deleteReview:      (id)                => api.delete(`/reviews/${id}`),
}
