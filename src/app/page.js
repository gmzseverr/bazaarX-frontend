"use client";

import FeaturedProducts from "./components/FeaturedProducts";

import Slider from "./components/Slider";

export default function Home() {
  return (
    <div>
      <Slider />
      <FeaturedProducts />
    </div>
  );
}
