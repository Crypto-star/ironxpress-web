import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' 
import { useAuth } from '../contexts/AuthContext'
import { useLanguage, Language } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'
import { supabase, Service, Product, Category } from '../lib/supabase'
import BottomNavigation from '../components/BottomNavigation'
import ServiceSelectionModal from '../components/ServiceSelectionModal'
import toast from 'react-hot-toast'
import { 
  ShoppingCartIcon,
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  BoltIcon,
  CloudIcon,
  FireIcon,
  LanguageIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

const HomePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const { addToCart, addToSessionCart, cartCount } = useCart()
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
    console.log('HomePage: Component mounted')
    fetchData()
  }, [])

  useEffect(() => {
    console.log('HomePage: User state changed:', { user: user?.email || 'guest', cartCount })
  }, [user, cartCount])

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

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product)
    setShowServiceModal(true)
  }

  const handleServiceSelection = (product: Product, service: Service, quantity: number) => {
    if (user) {
      addToCart(product, service, quantity)
    } else {
      addToSessionCart(product, service, quantity)
    }
    setShowServiceModal(false)
    setSelectedProduct(null)
  }

  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category_id === selectedCategory.id)
    : products

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(selectedCategory?.id === category.id ? null : category)
  }

  const handleCheckout = () => {
    // Always go to cart - authentication will be handled there when needed
    navigate('/cart')
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
      {/* Header - Responsive for Before/After Login States */}
      <div className="bg-white shadow-sm px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-primary-600">IronXpress</h1>
          </div>

          {/* Right Side - Different for Login States */}
          <div className="flex items-center space-x-3">
            {user ? (
              // After Login: Cart, Notifications, Profile Icons
              <>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleCheckout}
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ShoppingCartIcon className="h-6 w-6 text-gray-600" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => navigate('/notifications')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <BellIcon className="h-6 w-6 text-gray-600" />
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <UserCircleIcon className="h-6 w-6 text-gray-600" />
                  </button>
                </div>
              </>
            ) : (
              // Before Login: Cart Icon and Login Button
              <>
                <button
                  onClick={handleCheckout}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ShoppingCartIcon className="h-6 w-6 text-gray-600" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Banners Section */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-6 mb-6 text-white">
          <h2 className="text-xl font-bold mb-2">Get Started</h2>
          <p className="text-white/90 mb-4">Professional laundry service at your doorstep</p>
          <div className="flex space-x-2">
            <button className="bg-white/20 px-4 py-2 rounded-lg text-sm font-medium">
              Android
            </button>
            <button className="bg-white/20 px-4 py-2 rounded-lg text-sm font-medium">
              iOS
            </button>
          </div>
        </div>

        {/* Choose Your Category */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Your Category</h3>
          
          {/* Categories - Horizontal Scroll */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {categories.map((category) => {
              const isSelected = selectedCategory?.id === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-primary-50 border-2 border-primary-500'
                      : 'bg-white border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full mb-2 flex items-center justify-center ${
                    isSelected ? 'bg-primary-100' : 'bg-gray-100'
                  }`}>
                    <img
                      src={category.image_url || '/placeholder.png'}
                      alt={category.name}
                      className="w-8 h-8 object-cover rounded-full"
                    />
                  </div>
                  <span className={`text-xs font-medium text-center ${
                    isSelected ? 'text-primary-600' : 'text-gray-700'
                  }`}>
                    {category.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="aspect-square">
                <img
                  src={product.image_url || '/placeholder.png'}
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h4 className="font-medium text-gray-800 mb-1 text-sm">{product.product_name}</h4>
                <p className="text-sm text-gray-600 mb-3">₹{product.product_price}</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BoltIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {selectedCategory ? 'No items in this category' : 'No products available'}
            </h3>
            <p className="text-gray-500">
              {selectedCategory ? 'Try selecting a different category' : 'Check back later for new items!'}
            </p>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="mt-4 text-primary-600 font-medium"
              >
                Show all products
              </button>
            )}
          </div>
        )}
      </div>

      {/* Service Selection Modal */}
      <ServiceSelectionModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        services={services}
        product={selectedProduct}
        onAddToCart={handleServiceSelection}
      />

      {/* Support Chatbot - Only show after login */}
      {user && (
        <div className="fixed bottom-24 right-4 z-50">
          <button
            onClick={() => navigate('/support')}
            className="bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}

export default HomePage
