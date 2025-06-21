/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@apollo/client";
import { GET_SELLER_ORDERS } from "../../../graphql/queries";
import { formatCurrency } from "../../../lib/formatCurrency";
import { useCurrency } from "../../../providers/CurrencyContext";
import TopHeader from "../../../components/TopHeader";
import SearchBar from "../../../components/SearchBar";
import Footer from "../../../components/Footer";

// SVG Icon Components with proper TypeScript typings
interface IconProps {
  className?: string;
}

const PackageIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const CalendarIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LocationIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CurrencyIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ErrorIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export default function SellerOrdersPage() {
  const { currency } = useCurrency();
  const { data, loading, error } = useQuery(GET_SELLER_ORDERS);

  // const formatDate = (date: string | undefined | null) => {
  //   if (!date || isNaN(new Date(date).getTime())) {
  //     return "Invalid date";
  //   }
  
  //   return new Intl.DateTimeFormat("en-GB", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //   }).format(new Date(date));
  // };  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="max-w-md text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 mb-4">
            <ErrorIcon className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to load orders</h2>
          <p className="text-gray-600 mb-4">We couldn't load your seller orders. Please check your connection and try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const orders = data?.getSellerOrders || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopHeader />
      <SearchBar onSellerSearch={function (): void {
        throw new Error("Function not implemented.");
      } } />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <div className="mt-4 md:mt-0 flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border">
            <CurrencyIcon className="text-indigo-600 mr-2 w-5 h-5" />
            <span className="font-medium">Displaying prices in: {currency}</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <PackageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-2 text-gray-600">You haven't received any orders for your products. When you do, they'll appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="border rounded-xl overflow-hidden shadow-sm bg-white">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <PackageIcon className="mr-2 text-indigo-600 w-5 h-5" />
                        Order #{order.id.slice(-6).toUpperCase()}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1 flex items-center">
                        <CalendarIcon className="mr-1.5 w-4 h-4" />
                        Placed on {new Date(Number(order.createdAt)).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(order.total, currency)}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
                    <ul className="divide-y divide-gray-200">
                      {order.items.map((item: any) => (
                        <li key={item.id} className="py-4 flex flex-col sm:flex-row justify-between">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md overflow-hidden">
                              {/* {item.product?.images?.[0] && (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="h-full w-full object-cover"
                                />
                              )} */}
                            </div>
                            <div className="ml-4">
                              <p className="font-medium text-gray-900">{item.product?.name}</p>
                              {item.variation?.size && (
                                <p className="text-sm text-gray-500">Size: {item.variation.size}</p>
                              )}
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0 sm:text-right">
                            <p className="text-gray-900 font-medium">
                              {formatCurrency(item.price, currency)} each
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {formatCurrency(item.price * item.quantity, currency)} total
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <UserIcon className="mr-2 text-indigo-600 w-5 h-5" />
                        Customer Information
                      </h4>
                      <p className="text-gray-700">{order.user.username}</p>
                      <p className="text-gray-700">{order.user.email}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <LocationIcon className="mr-2 text-indigo-600 w-5 h-5" />
                        Shipping Address
                      </h4>
                      {order.user.addresses && order.user.addresses.length > 0 ? (
                        <>
                          <p className="text-gray-700">
                            {order.user.addresses[0].country}, {order.user.addresses[0].state}, {order.user.addresses[0].city}, 
                            {order.user.addresses[0].streetAddress}, {order.user.addresses[0].streetAddress2}, {order.user.addresses[0].zipcode}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500">No address provided</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};