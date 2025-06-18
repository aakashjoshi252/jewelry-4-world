"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "../../../graphql/mutations";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type RegisterFormInputs = {
  username: string;
  email: string;
  password: string;
  contact: string;
};

export default function Register() {
  const [registerUser] = useMutation(REGISTER_MUTATION);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormInputs>();
  
  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const variables = {
        options: {
          ...data,
          contact: Number(data.contact), // Ensure contact is a number
        },
      };

      const response = await registerUser({ variables });

      if (response?.data?.register?.user) {
        router.push("/auth/verify"); // Redirect to verify page
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
     <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Create an account</h2>
      {errorMessage && <p className="mb-4 text-sm text-red-600 text-center">{errorMessage}</p>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
              Username
        </label>
        <input
              type="text"
              placeholder="Enter your username"
              {...register("username", { required: "Username is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>
        
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
                Email
          </label>
        <input 
          type="email" 
          placeholder="Email" 
          {...register("email", { required: "Email is required" })} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        
        <div>
           <label className="block mb-1 text-sm font-medium text-gray-700">
              Contact
           </label>
        <input 
          type="text" 
          placeholder="Contact Number" 
          {...register("contact", { required: "Contact is required", pattern: { value: /^[0-9]+$/, message: "Contact must be a valid number" } })} 
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200 disabled:bg-gray-400"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account? <Link href="/auth/login" className="text-blue-500">Login here</Link> or 
      </p>
      <p className="mt-4 text-center">
        <Link href="/auth/sellregister" className="text-blue-500">Create a business account</Link>
      </p>
    </div>
  </div>
  );
}
