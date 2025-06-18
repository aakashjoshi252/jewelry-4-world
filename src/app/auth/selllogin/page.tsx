"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { LOGIN_COMPANY } from "../../../graphql/mutations";
import { useState } from "react";

type SellLoginFormInputs = {
  cname: string;
  password: string;
  email: string;
};

export default function Login() {
    
  const [login] = useMutation(LOGIN_COMPANY);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SellLoginFormInputs>();

  const onSubmit = async (data: SellLoginFormInputs) => {
    try {
      const response = await login({ variables: { options: data } });

      if (response.data?.loginCompany?.company) {
        window.location.href = "/dashboard"; 
      } else {
        setErrorMessage(response.data?.loginCompany?.errors?.[0]?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err); 
      setErrorMessage("An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Login</h2>
      {errorMessage && <p className="mb-4 text-sm text-red-600 text-center">{errorMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Company name
        </label>
        <input 
          type="text" 
          placeholder="Enter Company name" 
          {...register("cname", { required: "Username is required" })} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-50"
        />
        {errors.cname && <p className="text-red-500 text-sm mt-1">{errors.cname.message}</p>}

        <label className="block mb-1 text-sm font-medium text-gray-700">
          Email
        </label>
        <input 
          type="text" 
          placeholder="Email" 
          {...register("email", { required: "Email is required" })} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-50"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        
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
          {isSubmitting ? "Logging In..." : "Login"}
        </button>
      </form>
    </div>
   </div> 
  );
}
