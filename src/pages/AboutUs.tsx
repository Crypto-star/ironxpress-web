import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AboutUs: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About IronXpress</h1>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                At IronXpress, our mission is to provide high-quality, convenient, and reliable 
                ironing services that save you time and effort. We believe that everyone deserves 
                to look their best without the hassle of ironing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2023, IronXpress started with a simple idea: to make professional 
                ironing services accessible to everyone. We saw a need for a quick and easy 
                solution for busy professionals, families, and individuals who want to look 
                sharp without spending hours on laundry care.
              </p>
              <p className="text-gray-600 mb-4">
                From our humble beginnings, we have grown into a trusted service provider, 
                known for our commitment to quality, customer satisfaction, and convenience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Commitment to Quality</h2>
              <p className="text-gray-600 mb-4">
                We are committed to providing the highest quality ironing services. Our team of 
                experienced professionals uses state-of-the-art equipment and techniques to 
                ensure your clothes are perfectly pressed every time.
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Trained and experienced ironing professionals</li>
                <li>High-quality equipment and materials</li>
                <li>Strict quality control processes</li>
                <li>Eco-friendly cleaning solutions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Values</h2>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li><strong>Customer-Centric:</strong> We put our customers at the heart of everything we do.</li>
                <li><strong>Quality:</strong> We are committed to delivering the highest quality results.</li>
                <li><strong>Convenience:</strong> We make it easy for you to get your clothes ironed.</li>
                <li><strong>Reliability:</strong> You can count on us to be there when you need us.</li>
                <li><strong>Integrity:</strong> We operate with honesty and transparency.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                We'd love to hear from you! If you have any questions or feedback, please don't 
                hesitate to get in touch.
              </p>
              <p className="text-gray-600">
                Email: info@ironxpress.in<br />
                Phone: +91 8926252422
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
