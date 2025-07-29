import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'
import { supabase, Product, Service } from '../lib/supabase'
import toast from 'react-hot-toast'
import { 
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  BoltIcon,
  CloudIcon,
  FireIcon
} from '@heroicons/react/24/outline'

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  const serviceIcons: { [key: string]: React.ComponentType<any> } = {
    'Electric Iron': BoltIcon,
    'Steam Iron': CloudIcon,
    'Coal Iron': FireIcon
  }

  useEffect(() => {
    if (id) {
      fetchProductDetails()
      fetchServices()
    }
  }, [id])

  const fetchProductDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product details')
      navigate('/home')
    }
  }

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (error) throw error
      setServices(data || [])
      setSelectedService(data?.[0] || null)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product || !selectedService) {
      toast.error('Please select a service')
      return
    }

    await addToCart(product, selectedService, quantity)
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity)
    }
  }

  const totalPrice = product && selectedService 
    ? (Number(product.product_price) + Number(selectedService.price)) * quantity 
    : 0

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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <button
            onClick={() => navigate('/home')}
            className="btn-primary mt-4"
          >
            Go to Home
          </button>
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
          <h1 className="ml-3 text-lg font-semibold text-gray-800">Product Details</h1>
        </div>
      </div>

      <div className="p-4">
        {/* Product Image */}
        <div className="card mb-6">
          <img
            src={product.image_url || '/placeholder.png'}
            alt={product.product_name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          
          <h2 className="text-xl font-bold text-gray-800 mb-2">{product.product_name}</h2>
          <p className="text-lg font-semibold text-primary-600 mb-4">
            ₹{product.product_price}
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Premium quality clothing item that requires professional ironing service. 
              Choose your preferred ironing method and we'll take care of the rest with 
              our expert team and modern equipment.
            </p>
          </div>
        </div>

        {/* Service Selection */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Select Service Type
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {services.map((service) => {
              const IconComponent = serviceIcons[service.name] || BoltIcon
              const isSelected = selectedService?.id === service.id
              
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-4 rounded-lg border-2 flex items-center space-x-4 transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-primary-100' : 'bg-gray-100'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      isSelected ? 'text-primary-600' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <p className={`font-medium ${
                      isSelected ? 'text-primary-600' : 'text-gray-700'
                    }`}>
                      {t(`service.${service.name.toLowerCase().replace(' ', '_')}`)}
                    </p>
                    <p className={`text-sm ${
                      isSelected ? 'text-primary-500' : 'text-gray-500'
                    }`}>
                      +₹{service.price} service charge
                    </p>
                  </div>
                  
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected 
                      ? 'border-primary-500 bg-primary-500' 
                      : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t('common.quantity')}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
              >
                <MinusIcon className="h-5 w-5 text-gray-600" />
              </button>
              
              <span className="text-xl font-semibold text-gray-800 min-w-[2rem] text-center">
                {quantity}
              </span>
              
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 99}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
              >
                <PlusIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-800">₹{totalPrice}</p>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        {selectedService && (
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Price Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Item Price (x{quantity})</span>
                <span className="text-gray-800">₹{Number(product.product_price) * quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Charge (x{quantity})</span>
                <span className="text-gray-800">₹{Number(selectedService.price) * quantity}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span className="text-gray-800">Total Amount</span>
                <span className="text-primary-600">₹{totalPrice}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={handleAddToCart}
          disabled={!selectedService}
          className="btn-primary w-full text-lg py-4"
        >
          {t('common.add_to_cart')} - ₹{totalPrice}
        </button>
      </div>
    </div>
  )
}

export default ProductDetailsPage
