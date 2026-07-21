import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../services/product.service'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import Pagination from '../components/common/Pagination'
import { formatCurrency } from '../utils/helpers'
import toast from 'react-hot-toast'

const SellerProducts = () => {
  const [products, setProducts]   = useState([])
  const [meta, setMeta]           = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage]           = useState(1)

  useEffect(() => {
    fetchMyProducts(page)
  }, [page])

  const fetchMyProducts = async (pageNum) => {
    setIsLoading(true)
    try {
      const res = await productService.getMyProducts({ page: pageNum, limit: 10 })
      setProducts(res.data.data || [])
      setMeta(res.data.meta || null)
    } catch {
      toast.error('Failed to load your products')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return
    try {
      await productService.deleteProduct(productId)
      toast.success('Product deleted successfully')
      fetchMyProducts(page)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product')
    }
  }

  if (isLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-heading font-bold text-gray-900">Manage Products</h1>
          <p className="text-sm text-gray-500">Add, edit, or remove your products from the store</p>
        </div>
        <Link to="/dashboard/products/new" className="btn btn-primary">
          Add New Product
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden">
                        <img
                          src={prod.images?.[0]?.url || 'https://placehold.co/100x100'}
                          alt={prod.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 truncate max-w-xs">
                      {prod.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{prod.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-primary-600">
                      {formatCurrency(prod.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${prod.stock === 0 ? 'bg-red-100 text-red-800' : prod.stock <= 5 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                        {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} units`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {prod.rating > 0 ? `${prod.rating.toFixed(1)} (${prod.numReviews})` : 'No reviews'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-2">
                      <Link to={`/dashboard/products/${prod._id}/edit`} className="text-primary-600 hover:text-primary-700">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(prod._id)} className="text-red-500 hover:text-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon="Crafts"
          title="No products listed"
          description="Create your first artisan product listing to start selling."
          actionLabel="Add Product"
          actionTo="/dashboard/products/new"
        />
      )}

      {meta && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}

export default SellerProducts
