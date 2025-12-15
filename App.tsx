import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { AdminForm } from './components/AdminForm';
import { Product, CartItem, ViewState, ProductFormData } from './types';
import { getProducts, saveProducts } from './services/storageService';
import { Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('SHOP');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  // Load products on mount
  useEffect(() => {
    setProducts(getProducts());
  }, []);

  // Cart Management
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
        if (item.id === id) {
            const newQty = Math.max(0, item.quantity + delta);
            return {...item, quantity: newQty};
        }
        return item;
    }).filter(item => item.quantity > 0));
  }

  // Admin Management
  const handleSaveProduct = (data: ProductFormData) => {
    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      name: data.name,
      price: parseFloat(data.price),
      category: data.category,
      description: data.description,
      imageUrl: data.imageUrl
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? newProduct : p);
    } else {
      updatedProducts = [newProduct, ...products];
    }

    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    setView('ADMIN_LIST');
    setEditingProduct(undefined);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setView('ADMIN_FORM');
  };

  const handleCreateClick = () => {
    setEditingProduct(undefined);
    setView('ADMIN_FORM');
  };

  // Views
  const renderShop = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Featured Collections</h1>
            <div className="text-sm text-gray-500">{products.length} Products Available</div>
       </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
    </div>
  );

  const renderCart = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Shopping Cart</h2>
        {cart.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                <p className="text-gray-500 mb-4">Your cart is empty.</p>
                <button onClick={() => setView('SHOP')} className="text-indigo-600 font-medium hover:underline">Continue Shopping</button>
            </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item.id} className="p-6 flex items-center">
                  <img src={item.imageUrl} alt={item.name} className="h-20 w-20 object-cover rounded-md" />
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                     <div className="flex items-center border rounded-md">
                        <button onClick={() => updateCartQuantity(item.id, -1)} className="px-3 py-1 hover:bg-gray-100 text-gray-600">-</button>
                        <span className="px-2 text-gray-900 font-medium">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, 1)} className="px-3 py-1 hover:bg-gray-100 text-gray-600">+</button>
                     </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                className="mt-6 w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                onClick={() => alert('Checkout functionality is simulated.')}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAdminList = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <button
          onClick={handleCreateClick}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img className="h-10 w-10 rounded-full object-cover" src={product.imageUrl} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentView={view}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onNavigate={setView}
      />

      <main>
        {view === 'SHOP' && renderShop()}
        {view === 'CART' && renderCart()}
        {view === 'ADMIN_LIST' && renderAdminList()}
        {view === 'ADMIN_FORM' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <button
               onClick={() => setView('ADMIN_LIST')}
               className="mb-4 flex items-center text-sm text-gray-500 hover:text-indigo-600"
            >
                <ArrowLeft className="w-4 h-4 mr-1"/> Back to List
            </button>
            <AdminForm
                initialData={editingProduct}
                onSave={handleSaveProduct}
                onCancel={() => setView('ADMIN_LIST')}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
