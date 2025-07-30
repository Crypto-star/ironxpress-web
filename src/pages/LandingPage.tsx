
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Category } from '../lib/supabase';
import { ArrowRight, LogIn, Menu, X } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  price: string;
  description: string;
  icon: string;
}

interface Product {
  id: number;
  product_name: string;
  category_id: number;
}

const LandingPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const bannerImages = [
    'https://qehtgclgjhzdlqcjujpp.supabase.co/storage/v1/object/public/public-assets/banners/Banner01.png',
    'https://qehtgclgjhzdlqcjujpp.supabase.co/storage/v1/object/public/public-assets/banners/Banner02.png',
    'https://qehtgclgjhzdlqcjujpp.supabase.co/storage/v1/object/public/public-assets/banners/Banner04.png',
    'https://qehtgclgjhzdlqcjujpp.supabase.co/storage/v1/object/public/public-assets/banners/Banner100.png',
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
      } else {
        setCategories(categoriesData || []);
      }
    };

    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('*');
      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data || []);
      }
    };

    fetchCategories();
    fetchServices();

    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(bannerInterval);
  }, [bannerImages.length]);

  const handleCategoryClick = async (category: Category) => {
    if (selectedCategory?.id === category.id) {
      setSelectedCategory(null);
      setProducts([]);
    } else {
      setSelectedCategory(category);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', category.id);
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
    }
  };

  const handleAddClick = (product: Product) => {
    setSelectedProduct(product);
    setIsServiceModalOpen(true);
  };

  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="font-sans min-h-screen bg-white">
      {/* Content Wrapper */}
      <div>
      {/* Navigation */}
      <div className="pt-6 px-6">
        <nav className="bg-white shadow-lg rounded-2xl max-w-7xl mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold" style={{color: '#4300FF'}}>IronXpress</div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#services" className="text-gray-600 hover:text-gray-900">Services</a>
              <a href="#categories" className="text-gray-600 hover:text-gray-900">Categories</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/auth">
              <button className="text-gray-800 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2">
                <LogIn size={18} />
                <span>Login</span>
              </button>
            </Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-800">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-2xl max-w-7xl mx-auto mt-2 p-4">
            <a href="#services" className="block text-gray-600 hover:text-gray-900 py-2">Services</a>
            <a href="#categories" className="block text-gray-600 hover:text-gray-900 py-2">Categories</a>
            <a href="#how-it-works" className="block text-gray-600 hover:text-gray-900 py-2">How it Works</a>
            <Link to="/auth" className="block w-full mt-2">
              <button className="w-full text-gray-800 font-medium py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
                <LogIn size={18} />
                <span>Login</span>
              </button>
            </Link>
          </div>
        )}
      </div>
      {/* Hero Section - Banner with Overlay */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          {/* Banner Images Container */}
          <div className="w-full aspect-video lg:aspect-[16/7] relative">
            {bannerImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Banner ${index + 1}`}
                className={`w-full h-full object-cover absolute transition-opacity duration-1000 ease-in-out ${
                  index === currentBanner ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight">
              Ironing Made <span className="text-blue-400">Effortless</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed max-w-2xl">
              Quick pickup, expert ironing, and doorstep delivery.
            </p>
            <Link
              to="/auth"
              className="bg-white text-blue-600 font-bold py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg rounded-xl inline-block transform hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content - Centered Layout */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Services Section */}
        <section id="services" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We offer professional ironing services with different techniques to suit all your fabric needs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="card hover:shadow-xl transition-shadow duration-300 p-8 rounded-lg border">
              <div className="text-5xl mb-4 mx-auto">⚡️</div>
              <h3 className="text-xl font-semibold mb-2">Electric Iron</h3>
              <p className="text-gray-600">Standard and reliable ironing for everyday fabrics.</p>
            </div>
            <div className="card hover:shadow-xl transition-shadow duration-300 p-8 rounded-lg border">
              <div className="text-5xl mb-4 mx-auto">💨</div>
              <h3 className="text-xl font-semibold mb-2">Steam Iron</h3>
              <p className="text-gray-600">Gentle and effective for delicate clothes, removing tough wrinkles.</p>
            </div>
            <div className="card hover:shadow-xl transition-shadow duration-300 p-8 rounded-lg border">
              <div className="text-5xl mb-4 mx-auto">🔥</div>
              <h3 className="text-xl font-semibold mb-2">Coal Iron</h3>
              <p className="text-gray-600">Heavy-duty ironing for starched and heavy fabrics.</p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Clothing Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We handle all types of clothing with specialized care for each category.</p>
          </div>
          <div className="flex justify-center space-x-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory?.id === category.id ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          {selectedCategory && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border p-4 rounded-lg">
                  <h3 className="font-semibold">{product.product_name}</h3>
                  <button
                    onClick={() => handleAddClick(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg mt-2"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Simple steps to get your clothes professionally ironed and delivered to your doorstep.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="card p-8">
              <div className="text-4xl mb-4 mx-auto">📅️</div>
              <h3 className="text-xl font-semibold mb-3">1. Schedule Pickup</h3>
              <p className="text-gray-600">Book a convenient slot for us to pick up your clothes.</p>
            </div>
            <div className="card p-8">
              <div className="text-4xl mb-4 mx-auto">✨</div>
              <h3 className="text-xl font-semibold mb-3">2. We Iron with Care</h3>
              <p className="text-gray-600">Our experts iron your clothes with precision and care.</p>
            </div>
            <div className="card p-8">
              <div className="text-4xl mb-4 mx-auto">🚚</div>
              <h3 className="text-xl font-semibold mb-3">3. Doorstep Delivery</h3>
              <p className="text-gray-600">Get fresh, wrinkle-free clothes delivered to your doorstep.</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready for Effortless Ironing?</h2>
            <Link to="/auth" className="btn-primary py-3 px-8 text-lg inline-flex items-center">
                Book a Service Now <ArrowRight className="ml-2" />
            </Link>
        </section>
      </main>

      {isServiceModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-center mb-2">Choose Service</h2>
              <p className="text-gray-500 text-center mb-6">Select service for {selectedProduct.product_name}</p>
              
              {/* Base Price Display */}
              <div className="bg-blue-100 rounded-2xl p-4 mb-6 text-center">
                <p className="text-blue-600 font-semibold text-lg">Base Price: ₹40</p>
              </div>
              
              {/* Services List */}
              <div className="space-y-3">
                {services.map((service, index) => (
                  <div 
                    key={service.id} 
                    className={`border-2 rounded-2xl p-4 flex justify-between items-center ${
                      index === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{service.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg">{service.name}</h3>
                        {index === 0 && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            DEFAULT
                          </span>
                        )}
                        <p className="text-gray-500 text-sm mt-1">
                          {index === 0 ? '₹40' : `₹40 + ₹${service.price.replace('₹', '')}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-blue-600">{service.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cancel Button */}
              <button
                onClick={handleCloseServiceModal}
                className="w-full mt-6 py-3 text-blue-500 font-semibold text-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-blue-600 text-white mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">IronXpress</h3>
              <p className="text-blue-100">IronXpress is your go-to quick service platform for on-demand ironing, delivered to your doorstep in hours. We offer electric, steam, and coal ironing for all your wardrobe needs, spanning male, female, boys, girls, and essential items, with easy pickup and delivery.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-blue-100 hover:text-white transition-colors">Terms and Conditions</Link></li>
                <li><Link to="/privacy" className="text-blue-100 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/about" className="text-blue-100 hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-blue-100">Email: info@ironxpress.in</p>
              <p className="text-blue-100">Phone: +91 8926252422</p>
            </div>
          </div>
          <div className="text-center text-blue-200 mt-8 border-t border-blue-500 pt-6">
            &copy; {new Date().getFullYear()} ironXpress. All rights reserved.
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};
export default LandingPage;

