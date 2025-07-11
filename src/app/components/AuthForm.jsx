// components/AuthForm.jsx
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function AuthForm() {
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "", // Bu alan adını backend'deki LoginRequest ile eşleştiriyoruz
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setFormData({ email: "", password: "", name: "" });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        console.log("to log in with Email:", formData.email);
        const res = await axios.post("http://localhost:8080/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        const { id, fullName, email } = res.data;

        if (fullName && email) {
          authLogin({ id, fullName, email }, null);
          toast.success("Login successful! Welcome, " + fullName);
          console.log("Login successful! User:", fullName, "Email:", email);
          router.push("/");
        } else {
          const errorMessage =
            "Login successful but user data missing from response.";
          toast.error(errorMessage);
          console.error(errorMessage, res.data);
        }
      } else {
        console.log(
          "to register new user: Full Name:",
          formData.name,
          "Email:",
          formData.email
        );
        const res = await axios.post("http://localhost:8080/auth/register", {
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
        });

        toast.success(
          res.data.message || "Registration successful! Please log in."
        );
        console.log("Registration successful! Response:", res.data);
        router.push("/auth");
      }
    } catch (err) {
      console.error("Authentication Error:", err);
      console.error("Backend Error Response Data:", err.response?.data);

      let errorMessage = "An error occurred, please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error === "Bad Request") {
        errorMessage =
          "Invalid input or missing fields. Please check your data.";
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl border border-gray-100 mt-10 mb-10">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex justify-center mb-8 border-b border-gray-200">
        <button
          onClick={toggleMode}
          className={`w-1/2 py-3 text-lg font-semibold transition-colors duration-200 ${
            isLogin
              ? "text-black border-b-2 border-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Login
        </button>
        <button
          onClick={toggleMode}
          className={`w-1/2 py-3 text-lg font-semibold transition-colors duration-200 ${
            !isLogin
              ? "text-black border-b-2 border-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <input
            name="name"
            placeholder="Full Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-black text-white rounded-md font-semibold hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading
            ? isLogin
              ? "Logging in..."
              : "Registering..."
            : isLogin
            ? "Login"
            : "Sign Up"}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-6">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={toggleMode}
          className="underline font-medium text-black hover:text-gray-800 transition-colors"
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}
