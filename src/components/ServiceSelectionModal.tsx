import React, { useState } from 'react'
import { Service } from '../lib/supabase'
import { XMarkIcon, BoltIcon, FireIcon, CloudIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface ServiceSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  services: Service[]
  product: any
  onAddToCart: (product: any, service: Service, quantity: number) => void
}

const ServiceSelectionModal: React.FC<ServiceSelectionModalProps> = ({
  isOpen,
  onClose,
  services,
  product,
  onAddToCart
}) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [quantity, setQuantity] = useState(1)

  const serviceIcons: { [key: string]: React.ComponentType<any> } = {
    'Electric Iron': BoltIcon,
    'Steam Iron': CloudIcon,
    'Coal Iron': FireIcon
  }

  const handleAddToCart = () => {
    if (!selectedService) {
      toast.error('Please select a service')
      return
    }

    onAddToCart(product, selectedService, quantity)
    onClose()
    
    // Reset state
    setSelectedService(null)
    setQuantity(1)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 md:items-center">
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md mx-4 p-6 animate-slide-up md:animate-none">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Choose Service</h3>
            <p className="text-sm text-gray-600">{product?.product_name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Product Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <img
              src={product?.image_url || '/placeholder.png'}
              alt={product?.product_name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h4 className="font-medium text-gray-800">{product?.product_name}</h4>
              <p className="text-sm text-gray-600">Base Price: ₹{product?.product_price}</p>
            </div>
          </div>
        </div>

        {/* Service Selection */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Select Service Type:</h4>
          <div className="space-y-3">
            {services.map((service) => {
              const IconComponent = serviceIcons[service.name] || BoltIcon
              const isSelected = selectedService?.id === service.id
              
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-primary-100' : 'bg-gray-100'
                  }`}>
                    <IconComponent className={`h-5 w-5 ${
                      isSelected ? 'text-primary-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium ${
                      isSelected ? 'text-primary-600' : 'text-gray-700'
                    }`}>
                      {service.name}
                    </p>
                    <p className={`text-sm ${
                      isSelected ? 'text-primary-500' : 'text-gray-500'
                    }`}>
                      +₹{typeof service.price === 'number' ? service.price : parseFloat(service.price) || 0}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Quantity:</h4>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <span className="text-gray-600 font-medium">-</span>
            </button>
            <span className="text-lg font-medium text-gray-800 min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <span className="text-gray-600 font-medium">+</span>
            </button>
          </div>
        </div>

        {/* Total Price */}
        {selectedService && (
          <div className="bg-primary-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Price:</span>
              <span className="text-lg font-semibold text-primary-600">
                ₹{((product?.product_price || 0) + (selectedService?.price || 0)) * quantity}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!selectedService}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
              selectedService
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServiceSelectionModal
