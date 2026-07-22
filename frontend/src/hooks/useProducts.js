import { useState, useEffect, useCallback, useRef } from 'react'
import { productService } from '../services/product.service'

/**
 * Custom hook for fetching and managing products list
 * Handles search, filters, sorting, and pagination
 */
export const useProducts = (initialParams = {}) => {
  const [products, setProducts]     = useState([])
  const [meta, setMeta]             = useState(null)
  const [isLoading, setIsLoading]   = useState(false)
  const [error, setError]           = useState(null)
  const [params, setParams]         = useState({
    page: 1,
    limit: 12,
    sort: 'newest',
    ...initialParams,
  })

  const abortRef = useRef(null)

  const fetchProducts = useCallback(async (queryParams) => {
    // Cancel previous request
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    setError(null)

    try {
      const res = await productService.getProducts(queryParams)
      setProducts(res.data.data || [])
      setMeta(res.data.meta || null)
    } catch (err) {
      if (err.name !== 'CanceledError') {
        setError(err.response?.data?.message || 'Failed to load products')
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts(params)
  }, [params, fetchProducts])

  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
      page: newParams.page ?? 1, // Reset to page 1 when filters change (unless page is explicitly set)
    }))
  }, [])

  const goToPage = useCallback((page) => {
    setParams((prev) => ({ ...prev, page }))
  }, [])

  return { products, meta, isLoading, error, params, updateParams, goToPage, refetch: () => fetchProducts(params) }
}

export default useProducts
