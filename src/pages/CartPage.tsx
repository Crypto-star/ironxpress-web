import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase, Coupon } from '../lib/supabase'
import BottomNavigation from '../components/BottomNavigation'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  TagIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'

const CartPage: React.FC = () => {
  const { user } = useAuth()
  const { 
    cartItems, 
    sessionCartItems, 
    cartTotal, 
    cartCount, 
    updateQuantity, 
    updateSessionQuantity,
    removeFromCart, 
    removeFromSessionCart,
    loading 
  } = useCart()
  const { t } = useLanguage()
  const navigate = useNavigate()
  
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [discount, setDiscount] = useState(0)

  const deliveryFee = 30
  const platformFee = 0
  const taxRate = 0.12
  
  // Get current cart items (either from database or session)
  const currentCartItems = user ? cartItems : sessionCartItems
  
  const subtotal = cartTotal
  const taxAmount = subtotal * taxRate
  const finalTotal = subtotal + deliveryFee + platformFee + taxAmount - discount

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (user) {
      await updateQuantity(itemId, newQuantity)
    } else {
      updateSessionQuantity(itemId, newQuantity)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    if (user) {
      await removeFromCart(itemId)
    } else {
      removeFromSessionCart(itemId)
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }

    setCouponLoading(true)
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single()

      if (error || !data) {
        toast.error('Invalid coupon code')
        return
      }

      // Check if coupon is expired
      if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
        toast.error('Coupon has expired')
        return
      }

      // Check minimum order value
      if (data.minimum_order_value && subtotal < data.minimum_order_value) {
        toast.error(`Minimum order value ₹${data.minimum_order_value} required`)
        return
      }

      // Check minimum items
      if (data.min_items && cartCount < data.min_items) {
        toast.error(`Minimum ${data.min_items} items required`)
        return
      }

      // Calculate discount
      let discountAmount = 0
      if (data.discount_type === 'percentage') {
        discountAmount = (subtotal * data.discount_value) / 100
        if (data.max_discount_amount && discountAmount > data.max_discount_amount) {
          discountAmount = data.max_discount_amount
        }
      } else {
        discountAmount = data.discount_value
      }

      setAppliedCoupon(data)
      setDiscount(discountAmount)
      toast.success('Coupon applied successfully!')
    } catch (error) {
      console.error('Error applying coupon:', error)
      toast.error('Failed to apply coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setDiscount(0)
    setCouponCode('')
    toast.success('Coupon removed')
  }

  const handleProceedToCheckout = () => {
    if (currentCartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    
    // Check if user is authenticated, if not redirect to auth
    if (!user) {
      toast.error('Please login to proceed with checkout')
      navigate('/auth', { state: { from: '/cart' } })
      return
    }
    
    navigate('/address')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="ml-3 text-lg font-semibold text-gray-800">
              {t('cart.title')} ({cartCount})
            </h1>
          </div>
        </div>
      </div>

      <div className="p-4">
        {currentCartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {t('cart.empty')}
            </h3>
            <p className="text-gray-500 mb-6">Add some items to get started</p>
            <button
              onClick={() => navigate('/home')}
              className="btn-primary"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {currentCartItems.map((item) => (
                <div key={item.id} className="card">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.product_image || '/placeholder.png'}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-1">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        Service: {item.service_type}
                      </p>
                      <p className="text-sm font-semibold text-primary-600">
                        ₹{Number(item.total_price)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.product_quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                      >
                        <MinusIcon className="h-4 w-4 text-gray-600" />
                      </button>
                      
                      <span className="text-sm font-medium min-w-[1.5rem] text-center">
                        {item.product_quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, item.product_quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                      >
                        <PlusIcon className="h-4 w-4 text-gray-600" />
                      </button>
                      
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="w-8 h-8 rounded-full text-red-500 hover:bg-red-50 flex items-center justify-center ml-2"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Section */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t('cart.coupon')}
              </h3>
              
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TagIcon className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                      <p className="text-sm text-green-600">
                        You saved ₹{discount}!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 input-field"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="btn-secondary px-6"
                  >
                    {couponLoading ? 'Applying...' : t('common.apply')}
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Bill Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-800">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="text-gray-800">₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (12%)</span>
                  <span className="text-gray-800">₹{taxAmount.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span className="text-gray-800">Total Amount</span>
                  <span className="text-primary-600">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fixed Bottom Button */}
      {currentCartItems.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={handleProceedToCheckout}
            className="btn-primary w-full text-lg py-4"
          >
            {t('cart.delivery_address')} - ₹{finalTotal.toFixed(2)}
          </button>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}

export default CartPage
