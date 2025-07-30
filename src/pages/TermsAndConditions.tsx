import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                Welcome to IronXpress. These terms and conditions outline the rules and regulations 
                for the use of IronXpress's services and website.
              </p>
              <p className="text-gray-600 mb-4">
                By accessing and using our service, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Service Description</h2>
              <p className="text-gray-600 mb-4">
                IronXpress provides on-demand laundry and ironing services including pickup, 
                processing, and delivery of clothing items.
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Electric iron services for standard fabrics</li>
                <li>Steam iron services for delicate clothing</li>
                <li>Coal iron services for heavy-duty fabrics</li>
                <li>Pickup and delivery services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-600 mb-4">
                Users are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Providing accurate pickup and delivery information</li>
                <li>Ensuring items are suitable for the selected service type</li>
                <li>Being available during scheduled pickup and delivery times</li>
                <li>Reviewing and confirming order details before submission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Payment Terms</h2>
              <p className="text-gray-600 mb-4">
                Payment is required at the time of order placement. We accept various payment 
                methods including credit cards, debit cards, and digital wallets.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Cancellation Policy</h2>
              <p className="text-gray-600 mb-4">
                Orders can be cancelled within 30 minutes of placement without any charges. 
                After this period, cancellation may incur charges as per our policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                IronXpress shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <p className="text-gray-600">
                Email: support@ironxpress.com<br />
                Phone: +1 (234) 567-890
              </p>
            </section>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
