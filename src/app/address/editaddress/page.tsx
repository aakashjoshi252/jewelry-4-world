"use client";

import { UPDATE_ADDRESS } from "../../../graphql/mutations";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type AddressFormInputs = {
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
};

type Props = {
  defaultValues: AddressFormInputs;
  addressId: string;
};

export default function EditAddressForm({ defaultValues, addressId }: Props) {
  const router = useRouter();
  const [updateAddress] = useMutation(UPDATE_ADDRESS);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormInputs>({ defaultValues });

  const onSubmit = async (data: AddressFormInputs) => {
    try {
      await updateAddress({
        variables: {
          updateUserAddressId: addressId,
          input: data,
        },
      });
      router.push("/auth/userprofile");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update address.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gray-100 pt-30 px-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">Update Address</h2>
        {errorMessage && <p className="mb-4 text-sm text-red-600 text-center">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* fields here (unchanged) */}
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
              {isSubmitting ? "Updating..." : "Update Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
