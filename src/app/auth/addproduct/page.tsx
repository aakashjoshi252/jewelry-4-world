/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_PRODUCT } from "../../../graphql/mutations";
import { GET_PARENT_CATEGORIES, ME_QUERY, GET_SUBCATEGORIES } from "../../../graphql/queries";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import AnotherHeader from "../../../components/anotherheader";
import Footer from "../../../components/Footer";

type Variation = {
  size: string;
  color: string;
  price: number;
};

type AddProductFormInputs = {
  name: string;
  description: string;
  price: string;
  material: string;
  size: string;
  weight: string;
  category: string;
  subcategory: string;
  variations?: Variation[];
};

export default function AddProduct() {
  const [addProduct] = useMutation(CREATE_PRODUCT);
  const { data: cdata, loading: cloading } = useQuery(ME_QUERY);
  const [selectedParentCategory, setSelectedParentCategory] = useState<string | null>(null);
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_PARENT_CATEGORIES);
  const [errorMessage, setErrorMessage] = useState("");
  const [variations, setVariations] = useState<Variation[]>([]);

  useEffect(() => {
    if (!cloading && (!cdata || !cdata.me)) {
      redirect("/");
    }
  }, [cdata, cloading]);

  const { data: subcategoriesData, loading: subcategoriesLoading } = useQuery(GET_SUBCATEGORIES, {
    variables: { parentCategoryId: selectedParentCategory },
    skip: !selectedParentCategory,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddProductFormInputs>();

  const addVariation = () => {
    setVariations([...variations, { size: "", color: "", price: 0 }]);
  };

  const updateVariation = (index: number, field: keyof Variation, value: string | number) => {
    setVariations((prev) =>
      prev.map((v, i) =>
        i === index
          ? {
              ...v,
              [field]: field === "price" ? Number(value) : String(value),
            }
          : v
      )
    );
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: AddProductFormInputs) => {
    for (const [index, variation] of variations.entries()) {
      if (!variation.size || !variation.color || variation.price === 0 || isNaN(variation.price)) {
        setErrorMessage(`Please fill all fields for variation #${index + 1}`);
        return;
      }
    }

    try {
      const response = await addProduct({
        variables: {
          input: {
            ...data,
            price: parseFloat(data.price),
            variations,
          },
        },
      });

      if (response.data?.createProduct?.id) {
        window.location.href = "/dashboard";
      } else {
        setErrorMessage(response.data?.createProduct?.errors?.[0]?.message || "Error");
      }
    } catch (err) {
      console.error("Error:", err);
      setErrorMessage("An error occurred");
    }
  };

  return (
    <>
    <AnotherHeader/> 
    <div className="h-px w-5/6 mx-auto bg-gray-400 my-6" />
    <div className="max-w-4xl mx-auto mt-5 p-8 bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-8">Complete Your Listing</h1>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Photos */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Photos</h2>
          <div className="w-full h-40 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 bg-gray-50 rounded">
            Drag & drop product images here
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            placeholder="e.g., 925 Sterling Silver Ring/Size 6.5"
            {...register("name", { required: "Title is required" })}
            className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Category */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Category</h2>
          <select
            {...register("category", { required: "Category is required" })}
            onChange={(e) => setSelectedParentCategory(e.target.value)}
            className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors"
          >
            <option value="">Select a Category</option>
            {categoriesLoading ? (
              <option disabled>Loading categories...</option>
            ) : (
              categoriesData?.parentCategories?.map((cat: any) => (
                <option key={cat.id} value={cat.id} className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors">
                  {cat.name}
                </option>
              ))
            )}
          </select>

          {selectedParentCategory && (
            <select
              {...register("subcategory", { required: "Subcategory is required" })}
              className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors mt-3"
            >
              <option value="">Select a Subcategory</option>
              {subcategoriesLoading ? (
                <option disabled>Loading subcategories...</option>
              ) : (
                subcategoriesData?.subcategories?.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))
              )}
            </select>
          )}
        </div>

        {/* Item Specifics */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Item Specifics</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Material"
              {...register("material", { required: "Material is required" })}
              className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors mt-3"
            />
            <input
              type="text"
              placeholder="Size"
              {...register("size", { required: "Size is required" })}
              className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors mt-3"
            />
            <input
              type="text"
              placeholder="Weight (optional)"
              {...register("weight")}
              className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors mt-3"
            />
            <input
              type="text"
              placeholder="Price"
              {...register("price", { required: "Price is required" })}
              className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors mt-3"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <textarea
            rows={5}
            placeholder="Write a detailed description of your item."
            {...register("description", { required: "Description is required" })}
            className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors mt-3"
          />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>

        {/* Variations */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Variations</h2>
          {variations.map((variation, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 mb-2 items-center">
              <input
                type="text"
                placeholder="Size"
                value={variation.size}
                onChange={(e) => updateVariation(index, "size", e.target.value)}
                className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors mt-3"
              />
              <input
                type="text"
                placeholder="Color"
                value={variation.color}
                onChange={(e) => updateVariation(index, "color", e.target.value)}
                className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors mt-3"
              />
              <input
                type="text"
                placeholder="Price"
                value={variation.price}
                onChange={(e) => updateVariation(index, "price", e.target.value)}
                className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors mt-3"
              />
              <button type="button" onClick={() => removeVariation(index)} className="text-red-500 font-bold">
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariation}
            className="mt-2 bg-blue-500 text-white align-left px-4 py-2 rounded-xl hover:bg-blue-600"
          >
            Add Variation
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {isSubmitting ? "Submitting..." : "List It"}
        </button>
      </form>
    </div>
    <Footer/>
    </>
  );
}
