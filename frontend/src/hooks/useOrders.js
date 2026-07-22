import { useState, useEffect, useCallback } from 'react'
import { orderService } from '../services/order.service'

/**
 * Custom hook for fetching orders (buyer or seller)
 */
export const useOrders = ({ role = 'buyer', params: initialParams = {} } = {}) => {
  const [orders, setOrders]       = useState([])
  const [meta, setMeta]           = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState(null)
  const [params, setParams]       = useState({ page: 1, limit: 10, ...initialParams })

  const fetchOrders = useCallback(async (queryParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const fetcher = role === 'seller' ? orderService.getSellerOrders : orderService.getBuyerOrders
      const res = await fetcher(queryParams)
      setOrders(res.data.data || [])
      setMeta(res.data.meta || null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }, [role])

  useEffect(() => {
    fetchOrders(params)
  }, [params, fetchOrders])

  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({ ...prev, ...newParams, page: newParams.page ?? 1 }))
  }, [])

  return { orders, meta, isLoading, error, params, updateParams, refetch: () => fetchOrders(params) }
}

export default useOrders
