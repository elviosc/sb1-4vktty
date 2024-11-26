import React, { useState, useEffect } from 'react';
import { Plus, Package, ShoppingCart } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import ProductCard from './components/ProductCard';
import ProductForm from './components/ProductForm';
import CartModal from './components/CartModal';
import { Product } from './types/Product';
import { addProduct, getAllProducts, updateProduct, deleteProduct } from './db/productDB';
import { CartProvider, useCart } from './context/CartContext';

function AppContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { state: cart } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const loadedProducts = await getAllProducts();
      setProducts(loadedProducts);
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const handleAddProduct = async (product: Product) => {
    try {
      await addProduct(product);
      await loadProducts();
      toast.success('Product added successfully!');
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      await updateProduct(product.id, product);
      await loadProducts();
      toast.success('Product updated successfully!');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      await loadProducts();
      toast.success('Product deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleShare = (id: string) => {
    const shareableLink = `${window.location.origin}/product/${id}`;
    navigator.clipboard.writeText(shareableLink);
    toast.success('Share link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-emerald-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Product Catalog</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCart(true)}
                className="relative inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-emerald-600 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
                {cart.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cart.items.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new product.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={(product) => {
                  setEditingProduct(product);
                  setShowForm(true);
                }}
                onDelete={handleDeleteProduct}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <ProductForm
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          initialProduct={editingProduct || undefined}
        />
      )}
      {showCart && <CartModal onClose={() => setShowCart(false)} />}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;