import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import RoleRoute from './components/common/RoleRoute.jsx'
import Spinner from './components/common/Spinner.jsx'

// Lazy-loaded pages for code splitting
const Home            = lazy(() => import('./pages/Home.jsx'))
const Products        = lazy(() => import('./pages/Products.jsx'))
const ProductDetails  = lazy(() => import('./pages/ProductDetails.jsx'))
const Login           = lazy(() => import('./pages/Login.jsx'))
const Register        = lazy(() => import('./pages/Register.jsx'))
const Profile         = lazy(() => import('./pages/Profile.jsx'))
const Cart            = lazy(() => import('./pages/Cart.jsx'))
const Checkout        = lazy(() => import('./pages/Checkout.jsx'))
const OrderHistory    = lazy(() => import('./pages/OrderHistory.jsx'))
const OrderDetails    = lazy(() => import('./pages/OrderDetails.jsx'))
const Wishlist        = lazy(() => import('./pages/Wishlist.jsx'))
const SellerDashboard = lazy(() => import('./pages/SellerDashboard.jsx'))
const SellerProducts  = lazy(() => import('./pages/SellerProducts.jsx'))
const SellerOrderHistory = lazy(() => import('./pages/SellerOrderHistory.jsx'))
const ProductForm     = lazy(() => import('./pages/ProductForm.jsx'))
const About           = lazy(() => import('./pages/About.jsx'))
const Contact         = lazy(() => import('./pages/Contact.jsx'))
const NotFound        = lazy(() => import('./pages/NotFound.jsx'))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size="lg" />
  </div>
)

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes with main layout */}
        <Route element={<MainLayout />}>
          <Route path="/"                    element={<Home />} />
          <Route path="/products"            element={<Products />} />
          <Route path="/products/:id"        element={<ProductDetails />} />
          <Route path="/about"               element={<About />} />
          <Route path="/contact"             element={<Contact />} />

          {/* Auth routes (redirect if logged in) */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected: any logged-in user (buyer or seller) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile"    element={<Profile />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Route>

          {/* Protected: buyer only */}
          <Route element={<RoleRoute role="buyer" />}>
            <Route path="/cart"         element={<Cart />} />
            <Route path="/checkout"     element={<Checkout />} />
            <Route path="/orders"       element={<OrderHistory />} />
            <Route path="/wishlist"     element={<Wishlist />} />
          </Route>
        </Route>

        {/* Protected: seller dashboard layout */}
        <Route element={<RoleRoute role="seller" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard"                 element={<SellerDashboard />} />
            <Route path="/dashboard/orders"          element={<SellerOrderHistory />} />
            <Route path="/dashboard/products"        element={<SellerProducts />} />
            <Route path="/dashboard/products/new"    element={<ProductForm />} />
            <Route path="/dashboard/products/:id/edit" element={<ProductForm />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
