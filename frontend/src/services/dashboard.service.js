import api from './api'

export const dashboardService = {
  getDashboardStats: () => api.get('/dashboard/stats'),
  getMonthlySales:   (year) => api.get('/dashboard/monthly-sales', { params: { year } }),
  getCategoryStats:  () => api.get('/dashboard/category-stats'),
}
