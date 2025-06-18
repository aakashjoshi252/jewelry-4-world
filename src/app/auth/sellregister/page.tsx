/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { REGISTER_COMPANY } from "../../../graphql/mutations";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type BusinessRegisterForm = {
  username: string;
  cname: string;
  email: string;
  contact: number;
  password: string;
  location: string;
};

export default function BusinessRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser] = useMutation(REGISTER_COMPANY);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessRegisterForm>();

  const onSubmit = async (data: BusinessRegisterForm) => {
    try {
      const variables = {
        options: {
          ...data,
          contact: Number(data.contact),
        },
      };

      const response = await registerUser({ variables });

      if (response?.data?.registerCompany?.company) {
        router.push("/auth");
      } else {
        const errors = response?.data?.registerCompany?.errors;
        if (errors && errors.length > 0) {
          const messages = errors.map((e: any) => `${e.message}`);
          setErrorMessage(messages);
        } else {
          setErrorMessage(["Registration failed. Please check your inputs."]);
        }
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setErrorMessage(["Something went wrong. Please try again."]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Business Account Registration</h2>
      
      {errorMessage.length > 0 && (
        <div className="mb-4 text-sm text-red-600 text-center">
          {errorMessage.map((msg, idx) => (
            <p key={idx}>{msg}</p>
          ))}
        </div>
      )}
  
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            {...register("username", {
              required: "Username is required",
              minLength: { value: 4, message: "Must be at least 4 characters" },
            })}
            className="w-full p-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Company name
          </label>
          <input
            type="text"
            placeholder="Company Name"
            {...register("cname", {
              required: "Company name is required",
              minLength: { value: 4, message: "Must be at least 4 characters" },
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.cname && <p className="text-red-500 text-sm mt-1">{errors.cname.message}</p>}
        </div>

        <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="Business Email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            placeholder="Enter Business Location"
            {...register("location", { required: "Location is required" })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
        </div>

        <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
            Contact
          </label>
          <input
            type="text"
            placeholder="Enter Contact Number"
            {...register("contact", {
              required: "Contact number is required",
              pattern: { value: /^[0-9]+$/, message: "Must be a valid number" },
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
        </div>

        <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password", { required: "Password is required" })} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-50 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm focus:outline-none"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link href="/auth/selllogin" className="text-blue-500">Login here</Link>
      </p>
    </div>
   </div>
  );
}
