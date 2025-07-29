import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' 
import { useAuth } from '../contexts/AuthContext'
import { useLanguage, Language } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'
import { supabase, Service, Product, Category } from '../lib/supabase'
import BottomNavigation from '../components/BottomNavigation'
import toast from 'react-hot-toast'
import { 
  LanguageIcon, 
  ChevronDownIcon,
  BoltIcon,
  CloudIcon,
  FireIcon
} from '@heroicons/react/24/outline'

const HomePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'hi' as Language, name: 'हिंदी', flag: '🇮🇳' },
    { code: 'or' as Language, name: 'ଓଡ଼ିଆ', flag: '🏳️' }
  ]

  const serviceIcons: { [key: string]: React.ComponentType<any> } = {
    'Electric Iron': BoltIcon,
    'Steam Iron': CloudIcon,
    'Coal Iron': FireIcon
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (servicesError) throw servicesError
      setServices(servicesData || [])
      setSelectedService(servicesData?.[0] || null)

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_enabled', true)
        .order('created_at', { ascending: false })

      if (productsError) throw productsError
      setProducts(productsData || [])

    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (product: Product) => {
    if (!selectedService) {
      toast.error('Please select a service')
      return
    }

    await addToCart(product, selectedService, 1)
  }

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`)
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-electric-600 px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl font-bold">{t('home.welcome')}</h1>
            <p className="text-white/80">Welcome to {t('app.name')}</p>
          </div>
          
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center space-x-2 bg-white/20 text-white px-3 py-2 rounded-lg"
            >
              <LanguageIcon className="h-5 w-5" />
              <span>{languages.find(l => l.code === language)?.flag}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>

            {showLanguageDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code)
                      setShowLanguageDropdown(false)
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${
                      language === lang.code ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="px-4 -mt-4">
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('home.services')}</h2>
          <div className="grid grid-cols-3 gap-3">
            {services.map((service) => {
              const IconComponent = serviceIcons[service.name] || BoltIcon
              const isSelected = selectedService?.id === service.id
              
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    isSelected
                      ? 'bg-primary-100'
                      : 'bg-gray-100'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      isSelected ? 'text-primary-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <p className={`text-sm font-medium ${
                    isSelected ? 'text-primary-600' : 'text-gray-700'
                  }`}>
                    {t(`service.${service.name.toLowerCase().replace(' ', '_')}`)}
                  </p>
                  <p className={`text-xs ${
                    isSelected ? 'text-primary-500' : 'text-gray-500'
                  }`}>
                    ₹{service.price}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex-shrink-0 w-20 text-center"
              >
                <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center mx-auto mb-2">
                  <img
                    src={category.image_url || '/placeholder.png'}
                    alt={category.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </div>
                <p className="text-xs font-medium text-gray-700">{category.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="px-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Popular Items</h3>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="card">
              <div 
                onClick={() => handleProductClick(product)}
                className="cursor-pointer"
              >
                <img
                  src={product.image_url || '/placeholder.png'}
                  alt={product.product_name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-medium text-gray-800 mb-1">{product.product_name}</h4>
                <p className="text-sm text-gray-600 mb-2">₹{product.product_price}</p>
              </div>
              
              <button
                onClick={() => handleAddToCart(product)}
                className="btn-primary w-full text-sm py-2"
                disabled={!selectedService}
              >
                {t('common.add_to_cart')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="px-4 text-center py-12">
          <div className="text-gray-400 mb-4">
            <BoltIcon className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No products available</h3>
          <p className="text-gray-500">Check back later for new items!</p>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}

export default HomePage
