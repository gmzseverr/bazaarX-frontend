import Link from "next/link";

function OrderModal({ isOpen, onClose, orderDetails }) {
  if (!isOpen || !orderDetails) return null;

  const order = orderDetails;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 relative animate-fade-in-up border border-neutral-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl text-neutral-500 hover:text-neutral-800 transition"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-center mb-1">Order Summary</h2>
        <p className="text-center text-sm text-neutral-600 mb-4">
          Thank you for your purchase! Your order ID is{" "}
          <span className="font-semibold text-black">{order.id}</span>
        </p>

        {order.shippingAddress && (
          <div className="text-center italic text-sm text-neutral-600 mb-6">
            {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.zipCode}
          </div>
        )}

        <div className="max-h-64 overflow-y-auto space-y-4 mb-6 border-y border-neutral-200 py-4">
          {order.items?.length > 0 ? (
            order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start gap-4"
              >
                <div className="flex gap-4">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-14 h-14 rounded-lg object-cover border border-neutral-300"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-xs text-neutral-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-semibold text-neutral-800">
                  £{(item.priceAtOrder * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-neutral-500">No items found.</p>
          )}
        </div>

        <div className="space-y-2 text-sm text-neutral-700 mb-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              £
              {order.items
                ? order.items
                    .reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0)
                    .toFixed(2)
                : "0.00"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {order.totalAmount && order.items
                ? order.totalAmount -
                    order.items.reduce(
                      (sum, i) => sum + i.priceAtOrder * i.quantity,
                      0
                    ) ===
                  0
                  ? "Free"
                  : `£${(
                      order.totalAmount -
                      order.items.reduce(
                        (sum, i) => sum + i.priceAtOrder * i.quantity,
                        0
                      )
                    ).toFixed(2)}`
                : "0.00"}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold border-t pt-3 border-neutral-300">
            <span>Total</span>
            <span>£{order.totalAmount?.toFixed(2) || "0.00"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/shop"
            onClick={onClose}
            className="w-full text-center border border-neutral-300 py-3 rounded-md font-semibold hover:bg-neutral-100 transition text-neutral-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
export default OrderModal;
