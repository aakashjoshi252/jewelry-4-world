"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../../../graphql/mutations";
import { useState } from "react";
import Link from "next/link";

type LoginFormInputs = {
  username: string;
  password: string;
  email: string;
};

export default function Login() {
  const [login] = useMutation(LOGIN_MUTATION);
  const [showPassword,setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await login({ variables: { options: data } });

      if (response.data?.login?.user) {
        window.location.href = "/";
      } else {
        setErrorMessage(
          response.data?.login?.errors?.[0]?.message || "Login failed"
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Login to Your Account
        </h2>

        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
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
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200 disabled:bg-gray-400"
          >
            {isSubmitting ? "Logging In..." : "Login"}
          </button>
          <p className="mt-4 text-center">
            <Link href="/auth/register" className="text-blue-500">Create a new account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
