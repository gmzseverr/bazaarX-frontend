"use client";

import BrandSlider from "./components/BrandSiler";
import FeaturedProducts from "./components/FeaturedProducts";

import Slider from "./components/Slider";

export default function Home() {
  return (
    <div>
      <Slider />
      <BrandSlider />
      <FeaturedProducts />
    </div>
  );
}
