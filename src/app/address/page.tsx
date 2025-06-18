"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { CREATE_USER_ADDRESS } from "../../graphql/mutations"; // Make sure this mutation exists
import { useState } from "react";
import { useRouter } from "next/navigation";

type AddressFormInputs = {
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
};

export default function AddressForm() {
  const [createAddress] = useMutation(CREATE_USER_ADDRESS);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AddressFormInputs>();

  const onSubmit = async (data: AddressFormInputs) => {
    try {
      const variables = { input: data };
      const response = await createAddress({ variables });

      if (response?.data?.createUserAddress) {
        router.push("/auth/userprofile"); // Redirect wherever you want
      } else {
        setErrorMessage("Failed to save address. Please try again.");
      }
    } catch (error) {
      console.error("Address Error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">Add Your Address</h2>
        {errorMessage && <p className="mb-4 text-sm text-red-600 text-center">{errorMessage}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">Street Address</label>
            <input
              type="text"
              {...register("streetAddress", { required: "Street Address is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress.message}</p>}
          </div>

          <div className="col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">Street Address 2</label>
            <input
              type="text"
              {...register("streetAddress2")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              {...register("city", { required: "City is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              {...register("state", { required: "State is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              {...register("country", { required: "Country is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Zipcode</label>
            <input
              type="text"
              {...register("zipcode", { required: "Zipcode is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.zipcode && <p className="text-red-500 text-sm mt-1">{errors.zipcode.message}</p>}
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200 disabled:bg-gray-400"
            >
              {isSubmitting ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
