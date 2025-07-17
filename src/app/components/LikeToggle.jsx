// components/LikeToggle.jsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

import AuthModal from "./AuthModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons"; // Dolu kalp için
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";

export default function LikeToggle({ productId, initialIsLiked }) {
  const { isAuthenticated, user } = useAuth();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  const checkLikeStatus = async () => {
    if (!isAuthenticated || !user?.id) {
      setIsLiked(false);
      return;
    }
    try {
      const response = await api.get(`/user/favorites/status/${productId}`);
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.error("Failed to check like status:", error);
      setIsLiked(false);
    }
  };

  useEffect(() => {
    checkLikeStatus();
  }, [isAuthenticated, user, productId]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      if (isLiked) {
        await api.delete(`/user/favorites/${productId}`);
        setIsLiked(false);
        toast.success("Removed from favorites!");
      } else {
        await api.post(`/user/favorites/${productId}`);
        setIsLiked(true);
        toast.success("Added to favorites!");
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleToggleLike}
        disabled={loading}
        className={`
      cursor-pointer
          py-0.5 px-2 text-2xl text-black border-2
          transition-all duration-200 ease-in-out 

          ${
            isLiked
              ? " bg-black text-white  "
              : "bg-white text-black border border-blac hover:scale-110  "
          }
        `}
      >
        {isLiked ? (
          <FontAwesomeIcon icon={faSolidHeart} className="" />
        ) : (
          <FontAwesomeIcon icon={faRegularHeart} className="" />
        )}
      </button>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
