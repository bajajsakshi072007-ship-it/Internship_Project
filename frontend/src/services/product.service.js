import api from './api'

export const productService = {
  getProducts:       (params)   => api.get('/products', { params }),
  getProductById:    (id)       => api.get(`/products/${id}`),
  getMyProducts:     (params)   => api.get('/products/seller/mine', { params }),
  createProduct:     (formData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateProduct:     (id, formData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteProduct:     (id)       => api.delete(`/products/${id}`),
  removeImage:       (id, publicId) => api.delete(`/products/${id}/images/${encodeURIComponent(publicId)}`),
}
