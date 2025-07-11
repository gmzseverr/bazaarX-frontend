import Link from "next/link";
import React from "react";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className=" cursor-pointer shadow hover:shadow-lg transition duration-300">
        <img
          src={product.images[0]}
          alt={product.name}
          className="object-cover  "
        />
        <div className="pt-5 flex justify-between flex-col gap-4 px-4">
          <div className="flex flex-col h-3/5">
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            <div className="flex gap-4 text-xs items-center justify-between">
              <p>Price</p>
              <h4 className="text-xl font-bold text-black mt-2">
                ${product.price.toFixed(2)}
              </h4>
            </div>
          </div>
          <div className="flex w- mb-4 gap-3">
            <button className="px-2 w-full text-sm bg-white text-black ring py-2 cursor-pointer hover:bg-neutral-400 transition">
              View Details
            </button>
            <button className="px-2 w-full text-sm bg-black text-white py-2 ring cursor-pointer hover:bg-neutral-700 transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
