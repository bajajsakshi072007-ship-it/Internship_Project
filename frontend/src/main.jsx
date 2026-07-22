import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1a1714',
                  color: '#faf8f5',
                  borderRadius: '10px',
                  border: '1px solid #f59e0b20',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                },
                success: {
                  iconTheme: { primary: '#22c55e', secondary: '#faf8f5' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#faf8f5' },
                },
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
