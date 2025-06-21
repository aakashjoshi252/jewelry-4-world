// /* eslint-disable @next/next/no-img-element */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { useQuery, useMutation } from "@apollo/client";
// import { useParams } from "next/navigation";
// import {
//   GET_PRODUCT_BY_SLUG,
//   GET_SIMILAR_PRODUCTS,
//   GET_USER_RATING,
//   GET_WISHLISTS,
// } from "../../graphql/queries";
// import { ADD_TO_CART, ADD_TO_WISHLIST, CREATE_REVIEW } from "../../graphql/mutations";
// import Head from "next/head";
// // import Header from "../../../components/Header";
// import Link from "next/link";
// import { useCurrency } from "../../providers/CurrencyContext";
// import { convertPrice } from "../../lib/currencyConverter";
// import { formatCurrency } from "../../lib/formatCurrency";
// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { StarIcon } from "@heroicons/react/24/solid";
// import {
//   HeartIcon,
//   ArrowPathIcon,
//   ShieldCheckIcon,
// } from "@heroicons/react/24/outline";
// import LoadingPage from "@/components/LoadingPage";

// export default function ProductPage() {
//   const { currency } = useCurrency();
//   const params = useParams();
//   const [selectedVariation, setSelectedVariation] = useState<any>(null);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const { data: wishlistData } = useQuery(GET_WISHLISTS);
//   const wishlistItems = wishlistData?.getWishlist?.items || [];
//   const [addtoWishlist] = useMutation(ADD_TO_WISHLIST);

//   const [expanded, setExpanded] = useState(false);
//   const MAX_LENGTH = 200;
//   const toggleReadMore = () => setExpanded(!expanded);

//   const slug =
//     typeof params?.slug === "string"
//       ? params.slug
//       : Array.isArray(params?.slug)
//       ? params?.slug[0]
//       : undefined;

//   const { data, loading, error } = useQuery(GET_PRODUCT_BY_SLUG, {
//     variables: { slug },
//     skip: !slug,
//   });

//   const isInWishlist = (productId: string) => {
//     return wishlistItems.some((item: any) => item.product.id === productId);
//   };

//   const wishlist = async (productId: string) => {
//     try {
//       await addtoWishlist({
//         variables: {
//           productId,
//         },
//       });
//       toast.success("Added to wishlist");
//     } catch (err) {
//       toast.error("Failed to add to wishlist");
//       console.log(err);
//     }
//   };

//   const [addToCart] = useMutation(ADD_TO_CART);

//   const [createReview] = useMutation(CREATE_REVIEW, {
//     refetchQueries: [{ query: GET_PRODUCT_BY_SLUG, variables: { slug } }],
//   });

//   const [reviewInput, setReviewInput] = useState({
//     rating: 5,
//     comment: "",
//     sentiment: "POSITIVE",
//   });

//   const product = data?.productBySlug;

//   const shouldTruncate = product?.description?.length > MAX_LENGTH;
//   const proddes = expanded
//     ? product?.description
//     : product?.description?.slice(0, MAX_LENGTH);

//   const { data: similarData, loading: similarLoading, error: similarError } =
//     useQuery(GET_SIMILAR_PRODUCTS, {
//       variables: { category: product?.category?.name, productId: product?.id },
//       skip: !product?.category?.name || !product?.id,
//       fetchPolicy: "network-only",
//     });

//   const { data: userreviewdata } = useQuery(GET_USER_RATING);
//   const userRating = userreviewdata?.userReviews.rating;  

//   if (loading)
//     return (
//       <LoadingPage/>
//     );

//   if (error)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
//           <h3 className="font-bold text-lg mb-2">Error loading product</h3>
//           <p>{error.message}</p>
//         </div>
//       </div>
//     );

//   if (!product)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-gray-50 border border-gray-200 text-gray-700 px-6 py-4 rounded-lg max-w-md text-center">
//           <h3 className="font-bold text-lg mb-2">Product Not Found</h3>
//           <p>
//             The product you're looking for doesn't exist or may have been
//             removed.
//           </p>
//           <Link
//             href="/"
//             className="mt-4 inline-block text-blue-600 hover:text-blue-800"
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );

//   const handleAddToCart = async () => {
//     try {
//       toast.dismiss();
//       await addToCart({
//         variables: {
//           productId: product.id,
//           variationId: selectedVariation?.id || null,
//           quantity,
//         },
//       });

//       const toastMessage = selectedVariation
//         ? `${selectedVariation.size} ${selectedVariation.color} added to cart!`
//         : `Default product added to cart!`;

//       toast.success(toastMessage);
//     } catch (err) {
//       toast.error("Failed to add item to cart.");
//     }
//   };

//   const handleCreateReview = async () => {
//     try {
//       await createReview({
//         variables: {
//           input: {
//             productId: product.id,
//             rating: reviewInput.rating,
//             comment: reviewInput.comment,
//             sentiment: reviewInput.sentiment,
//           },
//         },
//       });
//       toast.success("Review submitted!");
//       setReviewInput({ rating: 5, comment: "", sentiment: "POSITIVE" });
//     } catch (err) {
//       toast.error("Failed to submit review");
//       console.error(err);
//     }
//   };

//   const handleQuantityChange = (action: "increase" | "decrease") => {
//     setQuantity((prevQuantity) =>
//       action === "increase"
//         ? prevQuantity + 1
//         : prevQuantity > 1
//         ? prevQuantity - 1
//         : prevQuantity
//     );
//   };

//   const displayedPrice = selectedVariation?.price ?? product.price;

//   const productImages = [
//     { id: 1, src: "https://via.placeholder.com/800x800?text=Product+Main" },
//     { id: 2, src: "https://via.placeholder.com/800x800?text=Product+Angle" },
//     { id: 3, src: "https://via.placeholder.com/800x800?text=Product+Detail" },
//     { id: 4, src: "https://via.placeholder.com/800x800?text=Product+In+Use" },
//   ];

//   return (
//     <>
//       <Head>
//         <title>{product.name} | Your Store</title>
//         <meta name="description" content={product.description} />
//       </Head>

//       {/* <Header /> */}
//       <Toaster position="top-center" />

//       <main className="bg-gray-50 min-h-screen">
//         {/* Breadcrumb */}
//         <nav className="bg-white py-3 border-b">
//           <div className="container mx-auto px-4">
//             <ol className="flex items-center space-x-2 text-sm">
//               <li>
//                 <Link href="/" className="text-blue-600 hover:underline">Home</Link>
//               </li>
//               <li>
//                 <span className="text-gray-400">/</span>
//               </li>
//               <li>
//                 <Link href={`/category/${product.category?.slug}`} className="text-blue-600 hover:underline">
//                   {product.category?.name || "Category"}
//                 </Link>
//               </li>
//               <li>
//                 <span className="text-gray-400">/</span>
//               </li>
//               <li className="text-gray-600 truncate max-w-xs">{product.name}</li>
//             </ol>
//           </div>
//         </nav>

//         {/* Product Section */}
//         <section className="container mx-auto px-4 py-8">
//           <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
//               {/* Product Images */}
//               <div className="space-y-4">
//                 <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
//                   <img 
//                     src={productImages[selectedImage].src} 
//                     alt={product.name}
//                     className="w-full h-full object-contain"
//                   />
//                   <button 
//                     onClick={(e) => {
//                       e.preventDefault();
//                       wishlist(product.id);
//                     }}
//                     className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-all shadow-sm"
//                     aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
//                   >
//                     <HeartIcon
//                       className={`h-4 w-4 ${
//                         isInWishlist(product.id)
//                           ? 'text-red-500 fill-red-500 hover:text-red-600'
//                           : 'text-gray-400 hover:text-red-500'
//                       } transition-colors`}
//                     />
//                   </button>
//                 </div>
//                 <div className="grid grid-cols-4 gap-3">
//                   {productImages.map((image, index) => (
//                     <button
//                       key={image.id}
//                       onClick={() => setSelectedImage(index)}
//                       className={`aspect-square bg-gray-100 rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-transparent'}`}
//                     >
//                       <img 
//                         src={image.src} 
//                         alt={`Product view ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Product Info */}
//               <div className="py-2">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h1 className="text-xl md:text-2xl font-bold text-gray-900">{product.name}</h1>
//                     <h2 className="text-lg md:text-md font-bold text-gray-900">by {product.company.cname}</h2>
//                     <div className="flex items-center mt-2">
//                       <div className="flex">
//                         {[0, 1, 2, 3, 4].map((rating) => (
//                           <StarIcon
//                             key={rating}
//                             className={`h-5 w-5 ${rating < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
//                           />
//                         ))}
//                       </div>
//                       <span className="ml-2 text-sm text-gray-500">
//                         {product.averageRating} rating
//                       </span>
//                       {/* <span className="ml-2 text-sm text-gray-500">{product.averageRating} reviews</span> */}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     {/* <p className="text-sm text-gray-500">SKU: {product.id.slice(0, 8)}</p> */}
//                     <p className="text-sm text-green-600 mt-1">In Stock</p>
//                   </div>
//                 </div>

//                 <div className="mt-6">
//                   <p className="text-2xl font-semibold text-gray-900">
//                     {formatCurrency(convertPrice(displayedPrice, currency), currency)}
//                     {product.originalPrice && (
//                       <span className="ml-2 text-lg text-gray-500 line-through">
//                         {formatCurrency(convertPrice(product.originalPrice, currency), currency)}
//                       </span>
//                     )}
//                   </p>
//                   {product.originalPrice && (
//                     <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-md mt-1">
//                       Save {Math.round((1 - displayedPrice / product.originalPrice) * 100)}%
//                     </span>
//                   )}
//                 </div>

//                 {/* Only show variations section if product has variations */}
//                   {product.variations && product.variations.length > 0 && (
//                     <div className="mt-6">
//                       <h3 className="text-sm font-medium text-gray-900">Options</h3>
//                       <div className="mt-4 space-y-4">
//                         {product.variations.map((variation: any) => (
//                           <div
//                             key={variation.id}
//                             onClick={() => {
//                               if (selectedVariation?.id === variation.id) {
//                                 setSelectedVariation(null);
//                               } else {
//                                 setSelectedVariation(variation);
//                               }
//                             }}
//                             className={`p-4 border rounded-lg cursor-pointer transition-colors ${
//                               selectedVariation?.id === variation.id
//                                 ? "border-blue-500 bg-blue-50"
//                                 : "border-gray-200 hover:border-gray-300"
//                             }`}
//                           >
//                             <div className="flex justify-between">
//                               <div>
//                                 <p className="font-medium">
//                                   {variation.color}  {variation.size}
//                                 </p>
//                                 <p className="text-sm text-gray-500 mt-1">
//                                   {formatCurrency(convertPrice(variation.price, currency), currency)}
//                                 </p>
//                               </div>
//                               {selectedVariation?.id === variation.id && (
//                                 <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
//                                   <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                   </svg>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                 <div className="mt-8">
//                   <div className="flex items-center">
//                     <p className="text-sm font-medium text-gray-900 mr-4">Quantity:</p>
//                     <div className="flex items-center border border-gray-300 rounded-md">
//                       <button
//                         onClick={() => handleQuantityChange("decrease")}
//                         className="px-3 py-1 text-gray-600 hover:bg-gray-100"
//                       >
//                         -
//                       </button>
//                       <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
//                       <button
//                         onClick={() => handleQuantityChange("increase")}
//                         className="px-3 py-1 text-gray-600 hover:bg-gray-100"
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>

//                   <div className="mt-6 grid grid-cols-2 gap-3">
//                     <button
//                       onClick={handleAddToCart}
//                       className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
//                     >
//                       Add to Cart
//                     </button>
//                     <button className="flex items-center justify-center bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors">
//                       Buy Now
//                     </button>
//                   </div>
//                 </div>

//                 <div className="mt-8 border-t border-gray-200 pt-6">
//                   <div className="grid grid-cols-3 gap-4">
//                     <div className="text-center">
//                       <ArrowPathIcon className="h-6 w-6 text-gray-400 mx-auto" />
//                       <p className="mt-2 text-xs text-gray-500">30-Day Returns</p>
//                     </div>
//                     <div className="text-center">
//                       <ShieldCheckIcon className="h-6 w-6 text-gray-400 mx-auto" />
//                       <p className="mt-2 text-xs text-gray-500">2-Year Warranty</p>
//                     </div>
//                     <div className="text-center">
//                       <svg className="h-6 w-6 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//                       </svg>
//                       <p className="mt-2 text-xs text-gray-500">Secure Payment</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
            
//           <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
//           <div className="p-6">
//             <h3 className="text-xl font-bold text-gray-900">Description</h3>
//             <div className="mt-2 text-md leading-relaxed text-gray-800">
//               <p className="whitespace-pre-line">
//                 {proddes}
//                 {shouldTruncate && !expanded && "..."}
//               </p>
//               {shouldTruncate && (
//                 <button
//                   onClick={toggleReadMore}
//                   className="mt-1 text-blue-600 hover:underline focus:outline-none font-medium"
//                 >
//                   {expanded ? "Read less" : "Read more"}
//                 </button>
//               )}
//             </div>
//           </div>
//           </div>


//           {/* Product Details Section */}
//           <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
//             <div className="p-6">
//               <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
//               <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-900">Features</h3>
//                   <ul className="mt-2 space-y-2 text-sm text-gray-500">
//                     <li className="flex items-start">
//                       <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                       <span>High-quality {product.material} material</span>
//                     </li>
//                     <li className="flex items-start">
//                       <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                       <span>Designed for comfort and durability</span>
//                     </li>
//                     <li className="flex items-start">
//                       <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                       <span>Available in multiple colors and sizes</span>
//                     </li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-900">Specifications</h3>
//                   <div className="mt-2">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <tbody className="divide-y divide-gray-200">
//                         <tr>
//                           <td className="py-2 text-sm font-medium text-gray-500">Material</td>
//                           <td className="py-2 text-sm text-gray-900">{product.material}</td>
//                         </tr>
//                         <tr>
//                           <td className="py-2 text-sm font-medium text-gray-500">Category</td>
//                           <td className="py-2 text-sm text-gray-900">{product.category?.name || "Unknown"}</td>
//                         </tr>
//                         <tr>
//                           <td className="py-2 text-sm font-medium text-gray-500">Weight</td>
//                           <td className="py-2 text-sm text-gray-900">{product.weight}</td>
//                         </tr>
//                         <tr>
//                           <td className="py-2 text-sm font-medium text-gray-500">Size</td>
//                           <td className="py-2 text-sm text-gray-900">{product.size}</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//          {/* Reviews Section */}
//             <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
//               <div className="p-6">
//                 <div className="mt-8">
//                   <h3 className="text-lg font-medium text-gray-900">Write a Review</h3>
//                   <div className="mt-4 space-y-4">
//                     {/* Rating Selector */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Rating</label>
//                       <div className="flex items-center mt-2">
//                         <div className="flex">
//                           {[1, 2, 3, 4, 5].map((star) => (
//                             <button
//                               key={star}
//                               type="button"
//                               onClick={() => {
//                                 const newRating = star;
//                                 let newSentiment = "POSITIVE";
//                                 if (newRating <= 2) newSentiment = "NEGATIVE";
//                                 else if (newRating === 3) newSentiment = "NEUTRAL";
                                
//                                 setReviewInput({
//                                   ...reviewInput,
//                                   rating: newRating,
//                                   sentiment: newSentiment
//                                 });
//                               }}
//                               className="focus:outline-none"
//                             >
//                               <StarIcon
//                                 className={`h-8 w-8 ${star <= reviewInput.rating ? 'text-yellow-400' : 'text-gray-300'}`}
//                               />
//                             </button>
//                           ))}
//                         </div>
//                         <span className="ml-2 text-sm font-medium text-gray-700">
//                           {reviewInput.rating} out of 5
//                         </span>
//                       </div>
//                     </div>

//                     {/* Sentiment Selector */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Overall Feeling</label>
//                       <div className="mt-2 flex space-x-4">
//                         {[
//                           { value: "POSITIVE", label: "Positive", color: "bg-green-100 text-green-800" },
//                           { value: "NEUTRAL", label: "Neutral", color: "bg-yellow-100 text-yellow-800" },
//                           { value: "NEGATIVE", label: "Negative", color: "bg-red-100 text-red-800" }
//                         ].map((option) => (
//                           <button
//                             key={option.value}
//                             type="button"
//                             onClick={() => setReviewInput({...reviewInput, sentiment: option.value})}
//                             className={`px-4 py-2 rounded-md text-sm font-medium ${option.color} ${
//                               reviewInput.sentiment === option.value 
//                                 ? 'ring-2 ring-offset-2 ring-blue-500' 
//                                 : 'hover:opacity-90'
//                             }`}
//                           >
//                             {option.label}
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Comment Textarea */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Review</label>
//                       <textarea
//                         rows={4}
//                         value={reviewInput.comment}
//                         onChange={(e) => setReviewInput({...reviewInput, comment: e.target.value})}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                         placeholder="Share your experience with this product..."
//                       />
//                     </div>

//                     <button
//                       onClick={handleCreateReview}
//                       className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     >
//                       Submit Review
//                     </button>
//                   </div>
//                 </div>

//                 {/* Customer Reviews Section */}
//                 <h2 className="text-xl pt-10 font-bold text-gray-900">Customer Reviews</h2>
                
//                 {/* Overall Rating Summary */}
//                 {product.reviews?.length > 0 && (
//                   <div className="mt-4 flex items-center">
//                     <div className="flex items-center">
//                       <div className="flex">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <StarIcon
//                             key={star}
//                             className={`h-5 w-5 ${star <= Math.round(product.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
//                           />
//                         ))}
//                       </div>
//                       <span className="ml-2 text-lg font-semibold text-gray-900">
//                         {product.averageRating?.toFixed(1)} out of 5
//                       </span>
//                     </div>
//                     <span className="ml-2 text-sm text-gray-500">
//                       ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
//                     </span>
//                   </div>
//                 )}

//                 {/* Individual Reviews */}
//                 {product.reviews?.length > 0 ? (
//                   <div className="mt-6 space-y-6">
//                     {product.reviews.map((review: any) => (
//                       <div key={review.id} className="border-b border-gray-200 pb-6">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center">
//                             <div className="flex">
//                               {[1, 2, 3, 4, 5].map((star) => (
//                                 <StarIcon
//                                   key={star}
//                                   className={`h-5 w-5 ${star <= Math.round(review.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
//                                 />
//                               ))}
//                             </div>
//                             <span className="ml-2 text-sm font-medium text-gray-700">
//                               {userRating} out of 5
//                             </span>
//                           </div>
//                           {review.sentiment && (
//                             <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                               review.sentiment === "POSITIVE" ? "bg-green-100 text-green-800" :
//                               review.sentiment === "NEUTRAL" ? "bg-yellow-100 text-yellow-800" :
//                               "bg-red-100 text-red-800"
//                             }`}>
//                               {review.sentiment.toLowerCase()}
//                             </span>
//                           )}
//                         </div>
//                         <div className="mt-1 text-sm text-gray-500">
//                           by {review.user.username} • {new Date(review.createdAt).toLocaleDateString()}
//                         </div>
//                         <p className="mt-2 text-gray-600">{review.comment}</p>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="mt-4 text-gray-500">No reviews yet. Be the first to review!</p>
//                 )}
//               </div>
//             </div>

//           {/* Similar Products Section */}
//           <section className="mt-12">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
//             {similarLoading ? (
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                 {[1, 2, 3, 4].map((i) => (
//                   <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
//                 ))}
//               </div>
//             ) : similarError ? (
//               <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
//                 <p>Error loading similar products: {similarError.message}</p>
//               </div>
//             ) : similarData?.getSimilarProducts?.length > 0 ? (
//               <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
//                 {similarData.getSimilarProducts.map((similarProduct: any) => (
//                   <Link key={similarProduct.id} href={`/products/${similarProduct.slug}`}>
//                   <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
//                     <div className="aspect-square bg-gray-100 relative">
//                       <Link href={`/products/${similarProduct.slug}`} className="block">
//                             <div className="aspect-square bg-gray-50 relative overflow-hidden">
//                               <div className="absolute inset-0 flex items-center justify-center">
//                                 <span className="text-gray-300 text-sm">Product Image</span>
//                               </div>
//                               {new Date(similarProduct.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
//                                 <span className="absolute top-2 left-2 bg-white text-gray-600 text-xs font-light px-2 py-0.5">
//                                   New
//                                 </span>
//                               )}
//                             </div>
//                           </Link>
//                         <button 
//                           onClick={(e) => {
//                             e.preventDefault();
//                             wishlist(similarProduct.id);
//                           }}
//                           className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-all shadow-sm"
//                           aria-label={isInWishlist(similarProduct.id) ? "Remove from wishlist" : "Add to wishlist"}
//                         >
//                           <HeartIcon
//                             className={`h-4 w-4 ${
//                               isInWishlist(similarProduct.id)
//                                 ? 'text-red-500 fill-red-500 hover:text-red-600'
//                                 : 'text-gray-400 hover:text-red-500'
//                             } transition-colors`}
//                           />
//                         </button>
//                     </div>
//                     <div className="p-4">
//                     <div className="flex justify-between items-start">
//                         <Link href={`/products/${similarProduct.slug}`} className="block">
//                           <h3 className="text-sm sm:text-base font-light text-gray-900 mb-1 hover:text-gray-600 transition line-clamp-2">
//                             {similarProduct.name}
//                           </h3>
//                         </Link>
//                       </div>
//                       <div className="flex items-center mb-2">
//                         <div className="flex">
//                           {[0, 1, 2, 3, 4].map((averageRating) => (
//                             <StarIcon
//                               key={averageRating}
//                               className={`h-4 w-4 ${averageRating < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
//                             />
//                           ))}
//                         </div>
//                         <span className="ml-1 text-xs text-gray-500">({similarProduct.averageRating})</span>
//                       </div>
            
//                       {/* Flex row for price and material */}

//                       {/* <div className="mt-2 flex justify-between items-center">
//                         <p className="text-lg font-semibold text-gray-900">
//                           {formatCurrency(convertPrice(similarProduct.price, currency), currency)}
//                         </p>
//                         <span className="inline-flex px-3.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                           {similarProduct.material}
//                         </span>
//                       </div> */}
//                       <div className="flex justify-between items-center">
//                           <p className="text-sm font-light text-gray-900">
//                             {formatCurrency(convertPrice(similarProduct.price, currency), currency)}
//                           </p>
//                           {similarProduct.material && (
//                             <span className="text-xs text-gray-400 font-light">
//                               {similarProduct.material}
//                             </span>
//                           )}
//                         </div>
//                     </div>
//                   </div>
//                 </Link>               
//                 ))}
//               </div>
//             ) : (
//               <div className="bg-gray-50 border border-gray-200 text-gray-700 px-6 py-4 rounded-lg text-center">
//                 <p>No similar products found.</p>
//               </div>
//             )}
//           </section>
//         </section>
//       </main>
//     </>
//   );
// }