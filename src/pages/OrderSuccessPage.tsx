import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const orderId = (location.state as { orderId: string })?.orderId || 'N/A';
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <CheckCircleIcon className="h-20 w-20 text-green-600 mx-auto mb-4 animate-pulse" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {t('order.success')}
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          {t('order.id')}: <span className="font-semibold">{orderId}</span>
        </p>
        <button
          onClick={() => navigate('/home')}
          className="btn-primary px-6 py-3"
        >
          {t('order.go_home')}
        </button>
      </div>
    </div>
  );
}

export default OrderSuccessPage
