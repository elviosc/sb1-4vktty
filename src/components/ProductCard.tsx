import React from 'react';
import { Share2, Edit, Trash2, ShoppingCart } from 'lucide-react';
import { Product } from '../types/Product';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete, onShare }: ProductCardProps) {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      },
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative pb-[56.25%]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex-1">{product.name}</h3>
          <span className="text-lg font-bold text-emerald-600 whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm sm:text-base text-gray-600 mb-4">{product.description}</p>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm self-start">
            {product.category}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="p-2 text-emerald-600 hover:text-emerald-700 transition-colors"
              title="Add to Cart"
            >
              <ShoppingCart size={20} />
            </button>
            <button
              onClick={() => onShare(product.id)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="Share Product"
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-gray-600 hover:text-emerald-600 transition-colors"
              title="Edit Product"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Delete Product"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}