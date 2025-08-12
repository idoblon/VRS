import React from 'react';
import { User, Building, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface RoleSelectionPageProps {
  onShowLogin: () => void;
  onSelectRole: (role: 'vendor' | 'center') => void;
}

export function RoleSelectionPage({ onShowLogin, onSelectRole }: RoleSelectionPageProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('Logo failed to load, using fallback');
    const target = e.currentTarget;
    target.style.display = 'none';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center">
            <img 
              src="/vrslogo.png" 
              alt="Vendor Request System Logo" 
              className="w-20 h-20 object-contain"
              onError={handleImageError}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
            Join Our Network
          </h1>
          <p className="text-gray-600">Choose your registration type</p>
        </div>

        <Card className="p-8 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center mb-6">
            <button
              onClick={onShowLogin}
              className="flex items-center text-orange-600 hover:text-orange-500 font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign In
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Select Registration Type
            </h2>

            {/* Vendor Registration */}
            <button
              onClick={() => onSelectRole('vendor')}
              className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4 text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Register as Vendor</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Sell your products to distribution centers across the network
                  </p>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li>• List and manage products</li>
                    <li>• Receive orders from centers</li>
                    <li>• Track sales and analytics</li>
                  </ul>
                </div>
              </div>
            </button>

            {/* Center Registration */}
            <button
              onClick={() => onSelectRole('center')}
              className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group"
            >
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                  <Building className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4 text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Register as Distribution Center</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage inventory and coordinate with vendors in your region
                  </p>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li>• Browse vendor products</li>
                    <li>• Place bulk orders</li>
                    <li>• Manage distribution operations</li>
                  </ul>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg">
            <p className="text-sm text-yellow-800 text-center">
              <strong>Note:</strong> All registrations require admin approval before account activation.
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            © 2024 Vendor Request System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}