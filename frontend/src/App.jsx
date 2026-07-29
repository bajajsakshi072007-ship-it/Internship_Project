import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import BuyerOrdersPage from './pages/BuyerOrdersPage';
import ArtisanDashboardPage from './pages/ArtisanDashboardPage';
import ArtisanProductsPage from './pages/ArtisanProductsPage';
import ProductFormPage from './pages/ProductFormPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col justify-between bg-amber-50/40 text-stone-800 font-sans selection:bg-amber-200">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  
                  {/* Buyer Routes */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-success"
                    element={
                      <ProtectedRoute>
                        <OrderSuccessPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-orders"
                    element={
                      <ProtectedRoute>
                        <BuyerOrdersPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Artisan / Seller Routes */}
                  <Route
                    path="/artisan/dashboard"
                    element={
                      <ProtectedRoute requireArtisan={true}>
                        <ArtisanDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/artisan/products"
                    element={
                      <ProtectedRoute requireArtisan={true}>
                        <ArtisanProductsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/artisan/products/new"
                    element={
                      <ProtectedRoute requireArtisan={true}>
                        <ProductFormPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/artisan/products/edit/:id"
                    element={
                      <ProtectedRoute requireArtisan={true}>
                        <ProductFormPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </LanguageProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
