import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, CartItem } from '../lib/supabase'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

interface SessionCartItem {
  id: string
  product_name: string
  product_image?: string
  product_price: number
  service_type: string
  service_price: number
  product_quantity: number
  total_price: number
  category?: string
}

interface CartContextType {
  cartItems: CartItem[]
  sessionCartItems: SessionCartItem[]
  cartCount: number
  cartTotal: number
  loading: boolean
  addToCart: (product: any, service: any, quantity: number) => Promise<void>
  addToSessionCart: (product: any, service: any, quantity: number) => void
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  updateSessionQuantity: (itemId: string, quantity: number) => void
  removeFromCart: (itemId: string) => Promise<void>
  removeFromSessionCart: (itemId: string) => void
  clearCart: () => Promise<void>
  clearSessionCart: () => void
  refreshCart: () => Promise<void>
  mergeSessionCartWithDatabase: () => Promise<void>
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
  const [sessionCartItems, setSessionCartItems] = useState<SessionCartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Load session cart from localStorage on mount
  useEffect(() => {
    const savedSessionCart = localStorage.getItem('ironxpress_session_cart')
    if (savedSessionCart) {
      try {
        setSessionCartItems(JSON.parse(savedSessionCart))
      } catch (error) {
        console.error('Error parsing session cart:', error)
        localStorage.removeItem('ironxpress_session_cart')
      }
    }
  }, [])

  // Save session cart to localStorage whenever it changes
  useEffect(() => {
    if (sessionCartItems.length > 0) {
      localStorage.setItem('ironxpress_session_cart', JSON.stringify(sessionCartItems))
    } else {
      localStorage.removeItem('ironxpress_session_cart')
    }
  }, [sessionCartItems])

  // Calculate totals from both authenticated and session cart
  const allCartItems = user ? cartItems : sessionCartItems
  const cartCount = allCartItems.reduce((total, item) => total + item.product_quantity, 0)
  const cartTotal = allCartItems.reduce((total, item) => total + Number(item.total_price), 0)

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

  // Session cart methods
  const addToSessionCart = (product: any, service: any, quantity: number = 1) => {
    console.log('CartContext: Adding to session cart:', { product: product.product_name, service: service.name, quantity })
    const totalPrice = (Number(product.product_price || 0) + Number(service.price || 0)) * quantity
    const productKey = `${product.product_name}-${service.name}`
    
    setSessionCartItems(prev => {
      const existingItem = prev.find(item => 
        item.product_name === product.product_name && item.service_type === service.name
      )
      
      if (existingItem) {
        // Increase quantity if item exists
        return prev.map(item =>
          item.id === existingItem.id
            ? {
                ...item,
                product_quantity: item.product_quantity + quantity,
                total_price: (Number(item.product_price) + Number(item.service_price)) * (item.product_quantity + quantity)
              }
            : item
        )
      } else {
        // Add new item
        const newItem: SessionCartItem = {
          id: `session-${Date.now()}-${Math.random()}`,
          product_name: product.product_name || product.name,
          product_image: product.image_url,
          product_price: Number(product.product_price || 0),
          service_type: service.name,
          service_price: Number(service.price || 0),
          product_quantity: quantity,
          total_price: totalPrice,
          category: product.category || 'general'
        }
        return [...prev, newItem]
      }
    })
    
    toast.success('Added to cart successfully!')
  }

  const updateSessionQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromSessionCart(itemId)
      return
    }

    setSessionCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              product_quantity: quantity,
              total_price: (Number(item.product_price) + Number(item.service_price)) * quantity
            }
          : item
      )
    )
  }

  const removeFromSessionCart = (itemId: string) => {
    setSessionCartItems(prev => prev.filter(item => item.id !== itemId))
    toast.success('Item removed from cart')
  }

  const clearSessionCart = () => {
    setSessionCartItems([])
    localStorage.removeItem('ironxpress_session_cart')
  }

  const mergeSessionCartWithDatabase = async () => {
    if (!user || sessionCartItems.length === 0) return

    setLoading(true)
    try {
      // Get existing cart items from database
      const { data: existingItems, error: fetchError } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id)

      if (fetchError) throw fetchError

      // Merge session cart with database cart
      for (const sessionItem of sessionCartItems) {
        const existingItem = existingItems?.find(dbItem => 
          dbItem.product_name === sessionItem.product_name && 
          dbItem.service_type === sessionItem.service_type
        )

        if (existingItem) {
          // Update existing item quantity
          const newQuantity = existingItem.product_quantity + sessionItem.product_quantity
          const newTotal = (Number(existingItem.product_price) + Number(existingItem.service_price)) * newQuantity
          
          const { error: updateError } = await supabase
            .from('cart')
            .update({
              product_quantity: newQuantity,
              total_price: newTotal
            })
            .eq('id', existingItem.id)

          if (updateError) throw updateError
        } else {
          // Insert new item
          const { error: insertError } = await supabase
            .from('cart')
            .insert([{
              user_id: user.id,
              product_name: sessionItem.product_name,
              product_image: sessionItem.product_image,
              product_price: sessionItem.product_price,
              service_type: sessionItem.service_type,
              service_price: sessionItem.service_price,
              product_quantity: sessionItem.product_quantity,
              total_price: sessionItem.total_price,
              category: sessionItem.category
            }])

          if (insertError) throw insertError
        }
      }

      // Clear session cart after successful merge
      clearSessionCart()
      await refreshCart()
      toast.success('Cart items merged successfully!')
    } catch (error) {
      console.error('Error merging cart:', error)
      toast.error('Failed to merge cart items')
    } finally {
      setLoading(false)
    }
  }

  // Auto-merge session cart when user logs in
  useEffect(() => {
    if (user && sessionCartItems.length > 0) {
      mergeSessionCartWithDatabase()
    }
  }, [user])

  useEffect(() => {
    refreshCart()
  }, [user])

  const value = {
    cartItems,
    sessionCartItems,
    cartCount,
    cartTotal,
    loading,
    addToCart,
    addToSessionCart,
    updateQuantity,
    updateSessionQuantity,
    removeFromCart,
    removeFromSessionCart,
    clearCart,
    clearSessionCart,
    refreshCart,
    mergeSessionCartWithDatabase,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
