import React from 'react';
import { ShoppingCart, LayoutDashboard, Store, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  cartCount: number;
  onNavigate: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, cartCount, onNavigate }) => {
  const isAdmin = currentView.startsWith('ADMIN');

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('SHOP')}>
            <Store className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">LuxeMart</span>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin ? (
              <button
                onClick={() => onNavigate('SHOP')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Exit Admin
              </button>
            ) : (
              <>
                 <button
                  onClick={() => onNavigate('ADMIN_LIST')}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <LayoutDashboard className="h-5 w-5 mr-1" />
                  Admin
                </button>
                <button
                  onClick={() => onNavigate('CART')}
                  className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-indigo-600 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
