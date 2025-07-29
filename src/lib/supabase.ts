import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qehtgclgjhzdlqcjujpp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlaHRnY2xnamh6ZGxxY2p1anBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDk2NzYsImV4cCI6MjA2NjQyNTY3Nn0.P7buCrNPIBShznBQgkdEHx6BG5Bhv9HOq7pn6e0HfLo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on your schema
export interface Profile {
  id: string
  location?: string
  latitude?: number
  longitude?: number
  pincode?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  image_url?: string
  is_active?: boolean
  created_at: string
  sort_order?: number
}

export interface Service {
  id: string
  name: string
  price: number
  icon_name?: string
  is_active?: boolean
  sort_order?: number
  created_at: string
  icon?: string
  color_hex?: string
}

export interface Product {
  id: string
  product_name: string
  product_price: number
  image_url: string
  category_id?: string
  is_enabled?: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_name: string
  product_image?: string
  product_price: number
  service_type: string
  service_price: number
  product_quantity: number
  total_price: number
  category?: string
  created_at: string
  updated_at: string
  original_order_id?: string
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  payment_method: string
  payment_status: string
  payment_id?: string
  order_status: string
  pickup_date: string
  pickup_slot_id?: string
  delivery_date: string
  delivery_slot_id?: string
  delivery_type: string
  delivery_address: string
  address_details?: any
  applied_coupon_code?: string
  discount_amount?: number
  created_at: string
  updated_at: string
  status?: string
  cancelled_at?: string
  cancellation_reason?: string
  can_be_cancelled?: boolean
}

export interface AddressBook {
  id: string
  user_id: string
  address_type: 'home' | 'work' | 'other'
  full_address: string
  landmark?: string
  city: string
  state: string
  pincode: string
  latitude?: number
  longitude?: number
  is_default?: boolean
  created_at: string
  updated_at: string
}

export interface Coupon {
  id: string
  code: string
  description?: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  max_discount_amount?: number
  minimum_order_value?: number
  is_active?: boolean
  is_featured?: boolean
  usage_limit?: number
  usage_count?: number
  expiry_date?: string
  brand_logo?: string
  created_at: string
  updated_at: string
  tag?: string
  min_items?: number
  applies_to_categories?: string[]
}
