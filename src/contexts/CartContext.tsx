import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, CartItem } from '../lib/supabase'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

interface CartContextType {
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number
  loading: boolean
  addToCart: (product: any, service: any, quantity: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const cartCount = cartItems.reduce((total, item) => total + item.product_quantity, 0)
  const cartTotal = cartItems.reduce((total, item) => total + Number(item.total_price), 0)

  const refreshCart = async () => {
    if (!user) {
      setCartItems([])
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCartItems(data || [])
    } catch (error) {
      console.error('Error fetching cart:', error)
      toast.error('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product: any, service: any, quantity: number = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart')
      return
    }

    try {
      const totalPrice = (Number(product.product_price || 0) + Number(service.price || 0)) * quantity

      const cartItem = {
        user_id: user.id,
        product_name: product.product_name || product.name,
        product_image: product.image_url,
        product_price: Number(product.product_price || 0),
        service_type: service.name,
        service_price: Number(service.price || 0),
        product_quantity: quantity,
        total_price: totalPrice,
        category: product.category || 'general'
      }

      const { error } = await supabase
        .from('cart')
        .insert([cartItem])

      if (error) throw error

      toast.success('Added to cart successfully!')
      await refreshCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add item to cart')
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId)
      return
    }

    try {
      const item = cartItems.find(item => item.id === itemId)
      if (!item) return

      const newTotal = (Number(item.product_price) + Number(item.service_price)) * quantity

      const { error } = await supabase
        .from('cart')
        .update({ 
          product_quantity: quantity,
          total_price: newTotal
        })
        .eq('id', itemId)

      if (error) throw error

      await refreshCart()
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.error('Failed to update quantity')
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      toast.success('Item removed from cart')
      await refreshCart()
    } catch (error) {
      console.error('Error removing from cart:', error)
      toast.error('Failed to remove item')
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setCartItems([])
      toast.success('Cart cleared')
    } catch (error) {
      console.error('Error clearing cart:', error)
      toast.error('Failed to clear cart')
    }
  }

  useEffect(() => {
    refreshCart()
  }, [user])

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
