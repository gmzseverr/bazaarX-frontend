"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "react-toastify";
import OrderModal from "./OrderModal";

const AccordionItem = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="rounded-md shadow-sm mb-2 bg-white">
      <button
        onClick={onClick}
        className="flex justify-between items-center bg-white w-full px-4 py-3 font-semibold text-black hover:bg-transparent-50 cursor-pointer transition-colors rounded-md"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          &#9660;
        </span>
      </button>
      {isOpen && (
        <div className="px-4 py-3 text-sm text-gray-800">{children}</div>
      )}
    </div>
  );
};

function ProfilePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const [activeAccordion, setActiveAccordion] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [addressRes, paymentRes, ordersRes] = await Promise.all([
          api.get("/user/addresses"),
          api.get("/user/payments"),
          api.get("/user/orders"),
        ]);

        setAddresses(addressRes.data || []);
        setPayments(paymentRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (err) {
        setError("Failed to load data.");
        toast.error("Error loading profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, router]);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-600">Loading profile...</div>
    );
  }

  if (error) {
    return <div className="p-10 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6  dark:bg-black  light:bg-white min-h-screen font-sans">
      <div className="border-b  border-black mb-8 pb-6 text-center">
        <h1 className="text-3xl font-semibold dark:text-white text-gray-900 mb-1">
          {user?.fullName || "User"}
        </h1>
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/user/favorites"
          className="
          border rounded-md p-4 text-center font-semibold transition
          text-black border-black
          hover:bg-black hover:text-white
          dark:text-white dark:border-white
          dark:hover:bg-white dark:hover:text-black
        "
        >
          Favorites
        </Link>

        <Link
          href="/settings"
          className="
          border rounded-md p-4 text-center font-semibold transition
          text-black border-black
          hover:bg-black hover:text-white
          dark:text-white dark:border-white
          dark:hover:bg-white dark:hover:text-black
        "
        >
          Account Settings
        </Link>

        <button
          onClick={handleLogout}
          className="
          border rounded-md p-4 text-center font-semibold transition
          text-black border-black
          hover:bg-black hover:text-white
          dark:text-white dark:border-white
          dark:hover:bg-white dark:hover:text-black
        "
        >
          Logout
        </button>
      </div>

      {/* Accordions */}
      <AccordionItem
        title="Addresses"
        isOpen={activeAccordion === 0}
        onClick={() => toggleAccordion(0)}
      >
        {addresses.length === 0 ? (
          <p className="italic text-gray-500">No addresses found.</p>
        ) : (
          <ul className="space-y-3">
            {addresses.map((address, i) => (
              <li
                key={i}
                className="text-sm shadow-md text-black p-3 rounded-md"
              >
                <div className="font-bold">{address.title}</div>
                <div className="italic">
                  {address.street}, {address.city}, {address.zipCode}
                </div>
              </li>
            ))}
          </ul>
        )}
      </AccordionItem>

      <AccordionItem
        title="Payment Methods"
        isOpen={activeAccordion === 1}
        onClick={() => toggleAccordion(1)}
      >
        {payments.length === 0 ? (
          <p className="italic text-gray-500">No payment methods found.</p>
        ) : (
          <ul className="space-y-3">
            {payments.map((card, i) => (
              <li
                key={i}
                className="text-sm border border-black p-3 rounded-md"
              >
                {card.cardBrand} •••• {card.lastFourDigits} — {card.expiryMonth}
                /{card.expiryYear}
              </li>
            ))}
          </ul>
        )}
      </AccordionItem>

      <AccordionItem
        title="Orders"
        isOpen={activeAccordion === 2}
        onClick={() => toggleAccordion(2)}
      >
        {orders.length === 0 ? (
          <p className="italic text-gray-500">No orders found.</p>
        ) : (
          <ul className="space-y-3">
            {orders.map((order, i) => (
              <li
                key={i}
                className="shadow-md p-3 rounded-md flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-lg">Order #{order.id}</div>
                  <div className="text-black text-sm">
                    {new Date(order.orderDate).toLocaleDateString()} — £
                    {order.totalAmount?.toFixed(2) || "0.00"}
                  </div>
                </div>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedOrder(order);
                  }}
                  className="text-sm text-black underline hover:text-black transition"
                >
                  Details
                </Link>
              </li>
            ))}
          </ul>
        )}
      </AccordionItem>

      {/* Modal */}
      {selectedOrder && (
        <OrderModal
          isOpen={!!selectedOrder}
          orderDetails={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default ProfilePage;
