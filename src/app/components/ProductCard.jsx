import Link from "next/link";
import React from "react";
import LikeToggle from "./LikeToggle";
import AddToCart from "./AddToCart";

export default function ProductCard({ product }) {
  return (
    <div className=" cursor-pointer shadow hover:shadow-lg bg-white transition duration-300">
      <div className="relative flex flex-col">
        <div className="absolute top-0 right-0 z-10 p-2"> </div>
        <Link href={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="object-cover w-full h-auto"
          />
        </Link>
      </div>
      <div className="pt-5 flex justify-between flex-col gap-4 px-4">
        <Link href={`/product/${product.id}`}>
          <div className="flex flex-col h-3/5">
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            <div className="flex gap-4 text-xs text-black items-center justify-between">
              <p>Price</p>
              <h4 className="text-xl font-bold text-black mt-2">
                ${product.price.toFixed(2)}
              </h4>
            </div>
          </div>
        </Link>
        <div className="flex justify-between items-center gap-4 py-3 ">
          <AddToCart productId={product.id} />
          <LikeToggle productId={product.id} initialIsLiked={product.isLiked} />
        </div>
      </div>
    </div>
  );
}
