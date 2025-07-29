import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'
import { supabase, AddressBook } from '../lib/supabase'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  MapPinIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'

const AddressPickerPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useLanguage()
  const { cartItems, cartTotal, clearCart } = useCart()

  const [addresses, setAddresses] = useState<AddressBook[]>([])
  const [selectedAddress, setSelectedAddress] = useState<AddressBook | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [showAddAddressModal, setShowAddAddressModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orderLoading, setOrderLoading] = useState(false)

  const [newAddress, setNewAddress] = useState({
    address_type: 'home' as 'home' | 'work' | 'other',
    full_address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  })

  const deliverySlots = [
    { id: 'morning', label: t('address.morning'), time: '9:00 AM - 12:00 PM' },
    { id: 'afternoon', label: t('address.afternoon'), time: '12:00 PM - 6:00 PM' },
    { id: 'evening', label: t('address.evening'), time: '6:00 PM - 9:00 PM' }
  ]

  useEffect(() => {
    if (user) {
      fetchAddresses()
    }
  }, [user])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('address_book')
        .select('*')
        .eq('user_id', user!.id)
        .order('is_default', { ascending: false })

      if (error) throw error
      setAddresses(data || [])
      
      // Select default address if available
      const defaultAddress = data?.find(addr => addr.is_default)
      if (defaultAddress) {
        setSelectedAddress(defaultAddress)
      } else if (data && data.length > 0) {
        setSelectedAddress(data[0])
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
      toast.error('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAddress = async () => {
    if (!newAddress.full_address || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      const { data, error } = await supabase
        .from('address_book')
        .insert([{
          ...newAddress,
          user_id: user!.id,
          is_default: addresses.length === 0 // First address is default
        }])
        .select()
        .single()

      if (error) throw error

      setAddresses([...addresses, data])
      setSelectedAddress(data)
      setShowAddAddressModal(false)
      setNewAddress({
        address_type: 'home',
        full_address: '',
        landmark: '',
        city: '',
        state: '',
        pincode: ''
      })
      toast.success('Address added successfully!')
    } catch (error) {
      console.error('Error adding address:', error)
      toast.error('Failed to add address')
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address')
      return
    }

    if (!selectedSlot) {
      toast.error('Please select a delivery slot')
      return
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setOrderLoading(true)
    try {
      // Generate order ID
      const orderId = `IX${Date.now()}`
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)

      // Create order
      const orderData = {
        id: orderId,
        user_id: user!.id,
        total_amount: cartTotal,
        payment_method: 'cash_on_delivery',
        payment_status: 'pending',
        order_status: 'confirmed',
        pickup_date: tomorrow.toISOString().split('T')[0],
        delivery_date: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        delivery_type: selectedSlot,
        delivery_address: selectedAddress.full_address,
        address_details: {
          full_address: selectedAddress.full_address,
          landmark: selectedAddress.landmark,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          address_type: selectedAddress.address_type
        }
      }

      const { error: orderError } = await supabase
        .from('orders')
        .insert([orderData])

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderId,
        product_name: item.product_name,
        product_price: item.product_price,
        service_type: item.service_type,
        service_price: item.service_price,
        quantity: item.product_quantity,
        total_amount: item.total_price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart
      await clearCart()

      toast.success('Order placed successfully!')
      navigate('/order-success', { state: { orderId } })
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order')
    } finally {
      setOrderLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="ml-3 text-lg font-semibold text-gray-800">
            {t('address.title')}
          </h1>
        </div>
      </div>

      <div className="p-4">
        {/* Address Selection */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Select Address</h2>
            <button
              onClick={() => setShowAddAddressModal(true)}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="text-sm font-medium">{t('address.add_new')}</span>
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <MapPinIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No addresses found</p>
              <button
                onClick={() => setShowAddAddressModal(true)}
                className="btn-primary"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <button
                  key={address.id}
                  onClick={() => setSelectedAddress(address)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAddress?.id === address.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          address.address_type === 'home' ? 'bg-green-100 text-green-800' :
                          address.address_type === 'work' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {address.address_type.toUpperCase()}
                        </span>
                        {address.is_default && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-800">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-gray-800 mb-1">{address.full_address}</p>
                      {address.landmark && (
                        <p className="text-sm text-gray-600 mb-1">Near: {address.landmark}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                    {selectedAddress?.id === address.id && (
                      <CheckCircleIconSolid className="h-6 w-6 text-primary-600 flex-shrink-0 ml-3" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Delivery Slot Selection */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t('address.select_slot')}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {deliverySlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={`p-4 rounded-lg border-2 flex items-center space-x-4 transition-all ${
                  selectedSlot === slot.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ClockIcon className={`h-6 w-6 ${
                  selectedSlot === slot.id ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <div className="flex-1 text-left">
                  <p className={`font-medium ${
                    selectedSlot === slot.id ? 'text-primary-600' : 'text-gray-800'
                  }`}>
                    {slot.label}
                  </p>
                  <p className={`text-sm ${
                    selectedSlot === slot.id ? 'text-primary-500' : 'text-gray-600'
                  }`}>
                    {slot.time}
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedSlot === slot.id
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}>
                  {selectedSlot === slot.id && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Items ({cartItems.length})</span>
              <span className="text-gray-800">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery</span>
              <span className="text-gray-800">₹30</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">GST (12%)</span>
              <span className="text-gray-800">₹{(cartTotal * 0.12).toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span className="text-gray-800">Total Amount</span>
              <span className="text-primary-600">₹{(cartTotal + 30 + cartTotal * 0.12).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={handlePlaceOrder}
          disabled={!selectedAddress || !selectedSlot || orderLoading}
          className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {orderLoading ? 'Placing Order...' : `Place Order - ₹${(cartTotal + 30 + cartTotal * 0.12).toFixed(2)}`}
        </button>
      </div>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Address</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Type
                  </label>
                  <select
                    value={newAddress.address_type}
                    onChange={(e) => setNewAddress({...newAddress, address_type: e.target.value as any})}
                    className="input-field"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address *
                  </label>
                  <textarea
                    value={newAddress.full_address}
                    onChange={(e) => setNewAddress({...newAddress, full_address: e.target.value})}
                    className="input-field"
                    rows={3}
                    placeholder="Enter your complete address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={newAddress.landmark}
                    onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                    className="input-field"
                    placeholder="e.g., Near City Mall"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      className="input-field"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                      className="input-field"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                    className="input-field"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddAddressModal(false)}
                  className="btn-secondary flex-1"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleAddAddress}
                  className="btn-primary flex-1"
                >
                  Add Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddressPickerPage
