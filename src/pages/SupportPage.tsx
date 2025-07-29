import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'

interface FAQ {
  question: string
  answer: string
}

const SupportPage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  
  const [message, setMessage] = useState('')
  const [contactType, setContactType] = useState('general')
  const [loading, setLoading] = useState(false)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const contactOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'order', label: 'Order Related' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'suggestion', label: 'Suggestion' }
  ]

  const faqs: FAQ[] = [
    {
      question: 'How long does the ironing service take?',
      answer: 'Standard ironing service takes 24-48 hours. Express service is available for same-day delivery with additional charges.'
    },
    {
      question: 'What types of clothes can you iron?',
      answer: 'We can iron all types of clothing including shirts, pants, dresses, sarees, kurtas, and delicate fabrics. Special care is taken for different fabric types.'
    },
    {
      question: 'How do you ensure the safety of my clothes?',
      answer: 'We use professional equipment and trained staff. Each item is tagged and tracked throughout the process. We also provide insurance coverage for any damages.'
    },
    {
      question: 'What are your pickup and delivery timings?',
      answer: 'We offer flexible pickup and delivery slots: Morning (9 AM - 12 PM), Afternoon (12 PM - 6 PM), and Evening (6 PM - 9 PM).'
    },
    {
      question: 'Do you provide services in my area?',
      answer: 'We currently serve major cities and are expanding rapidly. Enter your pincode on the home page to check service availability in your area.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept cash on delivery, UPI, credit/debit cards, and digital wallets. Payment can be made during pickup or delivery.'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) {
      toast.error('Please enter your message')
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Your message has been sent! We\'ll get back to you soon.')
      setMessage('')
      setContactType('general')
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
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
            {t('support.title')}
          </h1>
        </div>
      </div>

      <div className="p-4">
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <a
            href="tel:+919876543210"
            className="card flex items-center space-x-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <PhoneIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Call Us</h3>
              <p className="text-sm text-gray-600">+91 98765 43210</p>
            </div>
          </a>

          <a
            href="mailto:support@ironxpress.com"
            className="card flex items-center space-x-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <EnvelopeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Email Us</h3>
              <p className="text-sm text-gray-600">support@ironxpress.com</p>
            </div>
          </a>

          <div className="card flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Live Chat</h3>
              <p className="text-sm text-gray-600">24/7 Support</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Send us a message
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Type
              </label>
              <select
                value={contactType}
                onChange={(e) => setContactType(e.target.value)}
                className="input-field"
              >
                {contactOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('support.message')}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-field"
                rows={5}
                placeholder="Describe your issue or question in detail..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Sending...' : t('support.send')}
            </button>
          </form>
        </div>

        {/* FAQs */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t('support.faqs')}
          </h2>
          
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-gray-800 flex-1 pr-4">
                    {faq.question}
                  </span>
                  {expandedFAQ === index ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {expandedFAQ === index && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <p className="text-gray-600 text-sm leading-relaxed pt-3">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="card mt-6 bg-gradient-to-r from-primary-50 to-electric-50 border-primary-200">
          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-2">Need Immediate Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              For urgent issues related to ongoing orders, please call our helpline directly.
            </p>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <PhoneIcon className="h-4 w-4" />
              <span className="font-medium">Call Now</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportPage
