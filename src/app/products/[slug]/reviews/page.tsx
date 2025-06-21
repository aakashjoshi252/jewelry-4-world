"use client";

import { PRODUCT_REVIEWS_QUERY } from "../../../../graphql/queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import Link from "next/link";

interface Review {
  id: string;
  comment: string;
  rating: number;
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  createdAt: string;
  user?: {
    id: string;
    username: string;
  };
}

export default function ReviewsPage({ params }: { params: { slug: string } }) {
  const [offset, setOffset] = useState(0);
  const limit = 3;
  const { slug } = params;

  const { data, loading, error, fetchMore } = useQuery(PRODUCT_REVIEWS_QUERY, {
    variables: { 
      slug,
      limit, 
      offset 
    },
    fetchPolicy: "cache-and-network",
  });

  const paginatedData = data?.productReviews;
  const reviews: Review[] = paginatedData?.items || [];
  const totalCount = paginatedData?.total || 0;
  const hasMore = paginatedData?.hasMore || false;

  const handlePrevious = () => {
    const newOffset = Math.max(0, offset - limit);
    setOffset(newOffset);
    fetchMore({
      variables: { 
        slug,
        limit,
        offset: newOffset 
      },
    });
  };

  const handleNext = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchMore({
      variables: { 
        slug,
        limit,
        offset: newOffset 
      },
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md border border-red-100">
          <h2 className="text-xl font-bold text-red-600 mb-3">Error Loading Reviews</h2>
          <p className="text-red-500 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customer Reviews</h1>
              <Link 
                href={`/products/${slug}`}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
              >
                ← Back to product
              </Link>
            </div>
            
            {loading && offset === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="flex mr-2">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                              {review.rating}.0
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-1">{review.user?.username || 'Anonymous'}</h3>
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{new Date(review.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                        </div>
                        {review.sentiment && (
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            review.sentiment === 'POSITIVE' ? 'bg-green-100 text-green-800' :
                            review.sentiment === 'NEGATIVE' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {review.sentiment.toLowerCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {reviews.length === 0 && !loading && (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No reviews found for this product</p>
                  </div>
                )}

                {totalCount > 0 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-6">
                    <div className="text-sm text-gray-500">
                      Showing {Math.min(offset + 1, totalCount)}-{Math.min(offset + limit, totalCount)} of {totalCount} reviews
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handlePrevious}
                        disabled={offset === 0 || loading}
                        className={`px-4 py-2 border border-gray-300 rounded-md flex items-center text-sm font-medium ${
                          offset === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 transition-colors'
                        }`}
                      >
                        <FiChevronLeft className="mr-1" /> Previous
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={!hasMore || loading}
                        className={`px-4 py-2 border border-gray-300 rounded-md flex items-center text-sm font-medium ${
                          !hasMore ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 transition-colors'
                        }`}
                      >
                        Next <FiChevronRight className="ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {loading && offset > 0 && (
              <div className="mt-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}