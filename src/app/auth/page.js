"use client";

import AuthForm from "../components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-md border rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">bazaarX</h1>
        <AuthForm />
      </div>
    </div>
  );
}
