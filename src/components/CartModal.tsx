import React, { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
}

export default function CartModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useCart();
  const [form, setForm] = useState<CheckoutForm>({
    name: '',
    phone: '',
    address: '',
  });

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) {
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderItems = state.items
      .map(item => `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');

    const message = `*New Order*\n\n` +
      `*Customer Details*\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Address: ${form.address}\n\n` +
      `*Order Items*\n${orderItems}\n\n` +
      `*Total: $${total.toFixed(2)}*`;

    const whatsappUrl = `https://wa.me/5511952807174?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    dispatch({ type: 'CLEAR_CART' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-semibold">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {state.items.length === 0 ? (
          <p className="text-center text-gray-500 my-8">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {state.items.map((item) => (
                <div key={item.productId} className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Checkout via WhatsApp
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}