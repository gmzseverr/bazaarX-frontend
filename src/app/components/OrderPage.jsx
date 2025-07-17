"use client"; // Indicates this is a client component in Next.js App Router

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For Next.js routing
import { useAuth } from "@/context/AuthContext"; // Your authentication context
import api from "@/lib/api"; // Your Axios instance for backend API calls
import { toast } from "react-toastify"; // For displaying notifications to the user
import Link from "next/link"; // For navigation links
import OrderModal from "./OrderModal"; // Assuming OrderModal is in the same directory or accessible via this path

function OrderPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // --- State Management ---
  const [cartProducts, setCartProducts] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const [userPayments, setUserPayments] = useState([]);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // States for the OrderModal
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  // States for showing/hiding new address/payment forms and their data
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddressData, setNewAddressData] = useState({
    title: "",
    street: "",
    addressLine: "",
    city: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [newPaymentData, setNewPaymentData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    cardBrand: "", // Optional, can be derived on frontend or backend
  });

  // --- Data Fetching Effect: Loads user data and cart items on component mount ---
  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated || !user?.id) {
      toast.info("Please log in to complete your order.");
      router.push("/login");
      return;
    }

    const fetchCheckoutData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        // 1. Fetch Cart Contents
        const cartResponse = await api.get(`/user/cart`);
        const fetchedCartProducts = cartResponse.data.map((item) => ({
          ...item,
          quantity: item.quantity || 1, // Default to 1 if quantity is not provided by backend
        }));
        setCartProducts(fetchedCartProducts);

        if (fetchedCartProducts.length === 0) {
          toast.info(
            "Your cart is empty. Please add items to proceed with checkout."
          );
          router.push("/cart"); // Redirect to cart page if empty
          return;
        }

        // 2. Fetch User Addresses
        const addressResponse = await api.get(`/user/addresses`);
        setUserAddresses(addressResponse.data || []);
        if (addressResponse.data && addressResponse.data.length > 0) {
          // Select the first address as default for shipping
          setSelectedAddressId(addressResponse.data[0].id);
        }

        // 3. Fetch User Payment Methods
        const paymentResponse = await api.get(`/user/payments`);
        setUserPayments(paymentResponse.data || []);
        if (paymentResponse.data && paymentResponse.data.length > 0) {
          setSelectedPaymentMethodId(paymentResponse.data[0].id); // Select the first payment method by default
        }
      } catch (err) {
        console.error("Error fetching checkout data:", err);
        setFetchError(
          err.response?.data?.message ||
            "Failed to load checkout information. Please try again."
        );
        toast.error("Could not fetch checkout data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckoutData();
  }, [isAuthenticated, user, router]); // Dependencies for the effect

  // --- Cart Calculation Functions ---
  const calculateSubtotal = () => {
    return cartProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 50 ? 0 : 10; // Must match backend shipping logic
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  // --- Address Management Functions ---
  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("User ID is missing for address addition.");
      return;
    }

    try {
      const response = await api.post(`/user/addresses`, newAddressData);
      toast.success("Address added successfully!");
      setUserAddresses(response.data.addresses || []);
      if (response.data.addresses && response.data.addresses.length > 0) {
        // Select newly added address as default for shipping
        const newAddressId =
          response.data.addresses[response.data.addresses.length - 1].id;
        setSelectedAddressId(newAddressId);
      }
      setShowAddAddressForm(false);
      setNewAddressData({
        title: "",
        street: "",
        addressLine: "",
        city: "",
        zipCode: "",
        country: "",
        phone: "",
      }); // Clear form
    } catch (err) {
      console.error("Error adding address:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to add address. Please fill in all required fields."
      );
    }
  };

  // --- Payment Method Management Functions ---
  const handleNewPaymentChange = (e) => {
    const { name, value } = e.target;
    setNewPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("User ID is missing for payment addition.");
      return;
    }

    // Basic frontend validation for required payment fields
    if (
      !newPaymentData.cardholderName ||
      !newPaymentData.cardNumber ||
      !newPaymentData.expiryMonth ||
      !newPaymentData.expiryYear ||
      !newPaymentData.cvc
    ) {
      toast.error("Please fill in all required payment details.");
      return;
    }

    try {
      const response = await api.post(`/user/payments`, {
        cardholderName: newPaymentData.cardholderName,
        cardNumber: newPaymentData.cardNumber,
        expiryMonth: newPaymentData.expiryMonth,
        expiryYear: newPaymentData.expiryYear,
        cvc: newPaymentData.cvc,
        cardBrand: newPaymentData.cardBrand,
      });
      toast.success("Payment method added successfully!");
      setUserPayments(response.data.payments || []);
      if (response.data.payments && response.data.payments.length > 0) {
        setSelectedPaymentMethodId(
          response.data.payments[response.data.payments.length - 1].id
        );
      }
      setShowAddPaymentForm(false);
      setNewPaymentData({
        cardholderName: "",
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvc: "",
        cardBrand: "",
      }); // Clear form
    } catch (err) {
      console.error("Error adding payment method:", err);
      toast.error(
        err.response?.data?.message || "Failed to add payment method."
      );
    }
  };

  // Function to close the OrderModal
  const handleCloseOrderModal = () => {
    setShowOrderSuccessModal(false); // Hide the modal
    setPlacedOrderDetails(null); // Clear the order details (optional, but good practice)
    // You might also want to redirect the user after they close the modal, e.g.:
    // router.push("/orders"); // To a page listing all orders
  };

  // --- Place Order Function ---
  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !user?.id) {
      toast.error("Please log in to place your order.");
      return;
    }
    if (cartProducts.length === 0) {
      toast.error("Your cart is empty! Please add items.");
      router.push("/cart");
      return;
    }
    if (!selectedAddressId) {
      toast.error("Please select a shipping address.");
      return;
    }
    if (!selectedPaymentMethodId) {
      toast.error("Please select a payment method.");
      return;
    }

    setIsProcessingOrder(true); // Disable button while processing
    try {
      const orderRequest = {
        selectedAddressId,
        selectedPaymentMethodId,
      };

      const response = await api.post(`/user/orders`, orderRequest);

      if (response.status === 200 || response.status === 201) {
        toast.success("Your order has been placed successfully!");

        const mappedOrderItems = cartProducts.map((item) => ({
          productId: item.id, // Assuming item.id is the product ID
          productName: item.name, // Use item.name for productName
          quantity: item.quantity,
          price: item.price,
          imageUrl:
            item.images && item.images.length > 0 ? item.images[0] : null, // Use the first image if available
        }));

        setPlacedOrderDetails({
          id: response.data.id,
          orderItems: mappedOrderItems, // Use the newly mapped items here
          subtotal: calculateSubtotal(),
          shippingCost: calculateShipping(),
          totalAmount: calculateGrandTotal(),
        });
        setShowOrderSuccessModal(true); // This will make the modal visible

        setCartProducts([]); // Clear the cart after successful order
        // Do NOT redirect here if you want the modal to show first
        // router.push(`/order-success/${response.data.id}`); // This would prevent the modal from showing
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error(
        err.response?.data?.message ||
          "An unexpected error occurred while placing your order."
      );
    } finally {
      setIsProcessingOrder(false); // Re-enable button after processing
    }
  };

  // --- Loading and Error State Feedback ---
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 md:p-10 lg:p-12 text-center py-20">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Order Summary</h2>
        <p className="text-gray-600">Loading information...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container mx-auto p-6 md:p-10 lg:p-12 text-center py-20">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Order Summary</h2>
        <p className="text-red-600">Error: {fetchError}</p>
        <p className="text-gray-600 mt-2">
          Please try refreshing the page or logging in again.
        </p>
      </div>
    );
  }

  // Redirect or show message if cart is empty
  if (cartProducts.length === 0 && !showOrderSuccessModal) {
    // Add !showOrderSuccessModal to prevent redirect if modal is open
    return (
      <div className="container mx-auto p-6 md:p-10 lg:p-12 text-center py-20">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Order Summary</h2>
        <p className="text-gray-700 text-lg">
          Your cart is empty. Please add items to proceed to checkout.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block bg-gray-900 text-white py-3 px-8 rounded-sm hover:bg-gray-700 transition-colors duration-200"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // --- Main Component Render ---
  return (
    <div className="container mx-auto p-6 md:p-10 lg:p-12">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
        Complete Your Order
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Address and Payment Method Selection/Addition */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-900">
            <h3 className="text-xl font-semibold border-b border-gray-900 pb-4 mb-6 flex justify-between items-center text-gray-900">
              Shipping Address
              <button
                onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                className="text-sm text-gray-900 hover:opacity-75 transition-opacity duration-200"
              >
                {showAddAddressForm ? "Cancel" : "Add New Address"}
              </button>
            </h3>
            {showAddAddressForm && (
              <form
                onSubmit={handleAddAddress}
                className="space-y-4 mb-6 p-4 border border-gray-900 rounded-md bg-white"
              >
                <h4 className="text-lg font-semibold text-gray-900">
                  New Address Details
                </h4>
                <input
                  type="text"
                  name="title"
                  placeholder="Address Title (e.g., Home, Work)"
                  value={newAddressData.title}
                  onChange={handleNewAddressChange}
                  className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:border-gray-700"
                  required
                />
                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={newAddressData.street}
                  onChange={handleNewAddressChange}
                  className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:border-gray-700"
                  required
                />
                <input
                  type="text"
                  name="addressLine"
                  placeholder="Apartment / Unit No (Optional)"
                  value={newAddressData.addressLine}
                  onChange={handleNewAddressChange}
                  className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:border-gray-700"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={newAddressData.city}
                  onChange={handleNewAddressChange}
                  className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:border-gray-700"
                  required
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={newAddressData.zipCode}
                  onChange={handleNewAddressChange}
                  className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:border-gray-700"
                  required
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={newAddressData.country}
                  onChange={handleNewAddressChange}
                  className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:border-gray-700"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={newAddressData.phone}
                  onChange={handleNewAddressChange}
                  className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:border-gray-700"
                  required
                />
                <button
                  type="submit"
                  className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200 border border-gray-900"
                >
                  Save Address
                </button>
              </form>
            )}

            {userAddresses.length === 0 ? (
              !showAddAddressForm && (
                <p className="text-gray-900">
                  No saved addresses found. Please add a new address above.
                </p>
              )
            ) : (
              <div className="space-y-4">
                {userAddresses.map((address) => (
                  <label
                    key={address.id}
                    className="flex items-start p-4 border border-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <input
                      type="radio"
                      name="shippingAddress"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="mt-1 mr-3 accent-gray-900"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {address.title}
                      </p>
                      <p className="text-gray-900 text-sm">
                        {address.street},{" "}
                        {address.addressLine ? address.addressLine + ", " : ""}
                        {address.city}, {address.zipCode}
                      </p>
                      <p className="text-gray-900 text-sm">{address.country}</p>
                      <p className="text-gray-900 text-sm">
                        Phone: {address.phone}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-900">
            <h3 className="text-xl font-semibold border-b border-gray-900 pb-4 mb-6 flex justify-between items-center text-gray-900">
              Payment Method
              <button
                onClick={() => setShowAddPaymentForm(!showAddPaymentForm)}
                className="text-sm text-gray-900 hover:opacity-75 transition-opacity duration-200"
              >
                {showAddPaymentForm ? "Cancel" : "Add New Payment"}
              </button>
            </h3>
            {showAddPaymentForm && (
              <form
                onSubmit={handleAddPayment}
                className="space-y-4 mb-6 p-4 border border-gray-900 rounded-md bg-white"
              >
                <h4 className="text-lg font-semibold text-gray-900">
                  New Payment Details
                </h4>
                <input
                  type="text"
                  name="cardholderName"
                  placeholder="Cardholder Name"
                  value={newPaymentData.cardholderName}
                  onChange={handleNewPaymentChange}
                  className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:border-gray-700"
                  required
                />
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={newPaymentData.cardNumber}
                  onChange={handleNewPaymentChange}
                  className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:border-gray-700"
                  required
                  maxLength={19}
                />
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="expiryMonth"
                    placeholder="MM"
                    value={newPaymentData.expiryMonth}
                    onChange={handleNewPaymentChange}
                    className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:border-gray-700"
                    required
                    maxLength={2}
                  />
                  <input
                    type="text"
                    name="expiryYear"
                    placeholder="YY (e.g., 25)"
                    value={newPaymentData.expiryYear}
                    onChange={handleNewPaymentChange}
                    className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:border-gray-700"
                    required
                    maxLength={4}
                  />
                  <input
                    type="text"
                    name="cvc"
                    placeholder="CVC"
                    value={newPaymentData.cvc}
                    onChange={handleNewPaymentChange}
                    className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:border-gray-700"
                    required
                    maxLength={4}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200 border border-gray-900"
                >
                  Save Payment Method
                </button>
              </form>
            )}

            {userPayments.length === 0 ? (
              !showAddPaymentForm && (
                <p className="text-gray-900">
                  No saved payment methods found. Please add a new payment
                  method above.
                </p>
              )
            ) : (
              <div className="space-y-4">
                {userPayments.map((payment) => (
                  <label
                    key={payment.id}
                    className="flex items-center p-4 border border-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={payment.id}
                      checked={selectedPaymentMethodId === payment.id}
                      onChange={() => setSelectedPaymentMethodId(payment.id)}
                      className="mr-3 accent-gray-900"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {payment.cardholderName}
                      </p>
                      <p className="text-gray-900 text-sm">
                        {payment.cardBrand || "Card"} ending in:{" "}
                        {payment.lastFourDigits}
                      </p>
                      <p className="text-gray-900 text-sm">
                        Expires: {payment.expiryMonth}/{payment.expiryYear}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary and Place Order */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg border border-gray-900 h-fit sticky top-20">
          <h3 className="text-xl font-semibold border-b border-gray-900 pb-4 mb-6 text-gray-900">
            Order Summary
          </h3>
          <div className="flex justify-between text-lg font-medium mb-3 text-gray-900">
            <span>Subtotal ({cartProducts.length} items)</span>
            <span>£{calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-medium mb-6 text-gray-900">
            <span>Shipping</span>
            <span>
              {calculateShipping() === 0
                ? "Free"
                : `£${calculateShipping().toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t border-gray-900 pt-4 text-gray-900">
            <span>Total Amount</span>
            <span>£{calculateGrandTotal().toFixed(2)}</span>
          </div>
          <button
            onClick={handlePlaceOrder} // Call handlePlaceOrder when button is clicked
            disabled={
              isProcessingOrder ||
              !selectedAddressId ||
              !selectedPaymentMethodId ||
              cartProducts.length === 0
            }
            className={`w-full text-white py-3 rounded-sm mt-6 text-lg font-semibold border border-gray-900
              ${
                isProcessingOrder ||
                !selectedAddressId ||
                !selectedPaymentMethodId ||
                cartProducts.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-700 transition-colors duration-200"
              }`}
          >
            {isProcessingOrder ? "Processing Order..." : "Place Order"}
          </button>

          <Link
            href="/cart"
            className="w-full block text-center bg-white text-gray-900 py-2 rounded-sm mt-4 hover:bg-gray-100 transition-colors duration-200 text-sm font-medium border border-gray-900"
          >
            Back to Cart
          </Link>
        </div>
      </div>

      {/* OrderModal'ı doğrudan OrderPage içinde render ediyoruz */}
      {/* isOpen prop'u showOrderSuccessModal state'ine bağlı, onClose ise handleCloseOrderModal'a */}
      <OrderModal
        isOpen={showOrderSuccessModal}
        onClose={handleCloseOrderModal}
        orderDetails={placedOrderDetails}
      />
    </div>
  );
}

export default OrderPage;
