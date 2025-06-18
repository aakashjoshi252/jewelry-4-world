/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { GET_CART } from '../../graphql/queries';
import { useCurrency } from "../../providers/CurrencyContext";
import { convertPrice } from "../../lib/currencyConverter";
import { formatCurrency } from "../../lib/formatCurrency";
import { UPDATE_CART_ITEM, REMOVE_FROM_CART } from '../../graphql/mutations';
import { Cart, CartItem } from '../products/types';
import TopHeader from "../../components/TopHeader";
import MiddleHeader from "../../components/MiddleHeader";
import Footer from '../../components/Footer';

const CartPage = () => {
  const { currency } = useCurrency();
  const { data, loading, error } = useQuery(GET_CART);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<number>(1);

  const handleUpdateQuantity = (itemId: string) => {
    if (tempQuantity <= 0) return;
    updateCartItem({
      variables: { itemId, quantity: tempQuantity },
      refetchQueries: [{ query: GET_CART }],
    });
    setEditingItemId(null);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart({
      variables: { itemId },
      refetchQueries: [{ query: GET_CART }],
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-4xl mx-auto mt-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">Error loading cart. Please try again later.</p>
        </div>
      </div>
    </div>
  );

  const cart: Cart = data?.getCart;

  return (
    <>
    <TopHeader/>
    <MiddleHeader/>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8 border-b pb-4">Your Cart</h1>
      
      {cart?.items.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-1 text-gray-500">Start adding some products to your cart.</p>
          <div className="mt-6">
            <a
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Order Summary</h3>
          </div>
          
          <ul className="divide-y divide-gray-200">
            <li className="grid grid-cols-3 gap-4 px-4 py-2 font-semibold text-gray-600 border-b">
              <span>Item</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Price</span>
            </li>
            {cart.items.map((item: CartItem) => (
              <li key={item.id} className="grid grid-cols-3 gap-4 px-4 py-5 sm:px-6 items-center">
                {/* Item Info */}
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{item.product.name}</p>
                    {item.variation && (
                      <p className="text-sm text-gray-500">Size: {item.variation.size}</p>
                    )}
                    <div className="mt-2 space-x-2 text-sm">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex flex-col items-center justify-center">
                  {editingItemId === item.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={tempQuantity}
                        min="1"
                        onChange={(e) => setTempQuantity(Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <button
                        onClick={() => handleUpdateQuantity(item.id)}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingItemId(null)}
                        className="text-gray-500 hover:underline text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-700">Qty: {item.quantity}</p>
                      <button
                        onClick={() => {
                          setEditingItemId(item.id);
                          setTempQuantity(item.quantity);
                        }}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-right font-semibold text-gray-900">
                  {formatCurrency(convertPrice(item.price, currency), currency)}
                </div>
              </li>
            ))}
          </ul>

          
          {/* Order Summary */}
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <div className="flex justify-between">
              <div className="text-right w-full">
                <div className="flex justify-between max-w-xs ml-auto">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency(convertPrice(cart?.total, currency), currency)}
                  </span>
                </div>
                <div className="flex justify-between max-w-xs ml-auto mt-2">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between max-w-xs ml-auto mt-4 pt-4 border-t border-gray-200">
                  <span className="text-lg font-medium">Total:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(convertPrice(cart?.total, currency), currency)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className= "bg-indigo-600 border border-transparent rounded-md py-3 px-4 flex text-base font-medium text-white hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Checkout
              </button>
            </div>
            <div className="mt-4 flex justify-center text-sm text-gray-500">
              <p>
                or{' '}
                <a href="/products" className="text-indigo-600 font-medium hover:text-indigo-500">
                  Continue Shopping<span aria-hidden="true"> &rarr;</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </> 
  );
};

export default CartPage;