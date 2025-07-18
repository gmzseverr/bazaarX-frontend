"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "New Brand Alert: Tommy Hilfiger",
    description: "Discover the latest collection from Tommy Hilfiger.",
    img: "https://img01.ztat.net/article/spp-media-p1/782b41b66c434f66affba25045e5ff80/0e2df7f7bc714c7bb684b77c3cfa3efc.jpg?imwidth=1800",
    url: "/shop?brand=Tommy%20Jeans",
    background: "bg-gradient-to-r from-blue-50 to-red-50",
  },
  {
    id: 2,
    title: "Active Wear",
    description: "Comfort and style for your active lifestyle.",
    img: "https://img01.ztat.net/article/spp-media-p1/a726ca6f088d45d5b21071120d131162/c0ef54f075c04dc595bce56335ab6052.jpg?imwidth=1800",
    url: "/shop?category=sportswear",
    background: "bg-gradient-to-r from-pink-50 to-yellow-50",
  },
  {
    id: 3,
    title: "Summer Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "https://i.pinimg.com/736x/25/a5/c9/25a5c983a9db18b7e2762360a10c77f5.jpg",
    url: "/shop?category=dresses%20%26%20jumpsuits",
    background: "bg-gradient-to-r from-pink-50 to-blue-50",
  },
];

function Slider() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="md:h-[calc(100vh-80px)] h-[calc(100vh-3px)] overflow-hidden relative">
      <div
        className="w-max h-full flex transition-transform duration-1000"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`${slide.background} w-screen h-full flex flex-col md:flex-row items-center justify-center    md:py-0`}
          >
            <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center md:items-start justify-center py-4 gap-4 px-8 md:gap-8 text-center md:text-left ">
              <h2 className="text-xl lg:text-3xl xl:text-5xl text-gray-700">
                {slide.description}
              </h2>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                {slide.title}
              </h1>
              <Link href={slide.url}>
                <button className="py-2.5 px-6 bg-black text-white rounded-md cursor-pointer hover:bg-gray-800 transition-all text-lg font-medium">
                  SHOP NOW
                </button>
              </Link>
            </div>

            <div className="w-screen md:w-1/2 h-1/2 md:h-full flex items-center justify-center">
              <img
                src={slide.img}
                alt={slide.title}
                className="w-screen h-full object-cover "
              />
            </div>
          </div>
        ))}
      </div>

      {/* buttons */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              current === index ? "bg-black" : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
