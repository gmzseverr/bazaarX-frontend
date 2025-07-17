"use client";
import { useRouter } from "next/navigation";

export default function AuthModal({ isOpen, onClose }) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLoginClick = () => {
    router.push("/auth");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold mb-4">
          You need an account to do that!
        </h2>
        <p className="text-gray-700 mb-6">
          Please sign in or create an account to add items to your favorites.
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleLoginClick}
            className="w-full py-2.5 bg-black text-white rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            Sign In / Sign Up
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300 transition-colors"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
