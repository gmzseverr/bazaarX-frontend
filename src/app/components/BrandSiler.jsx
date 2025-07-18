import Link from "next/link";

const brands = [
  {
    name: "Asos",
    logo: "/brands/asos-logo_brandlogos.net_kcl9w.png",
    link: "/shop?brand=ASOS",
  },
  {
    name: "Pull and Bear",
    logo: "/brands/pull&bear-logo-brandlogos.net.png",
    link: "/shop?brand=Pull%26Bear",
  },
  {
    name: "Calvin Klein",
    logo: "/brands/calvin_klein-logo_brandlogos.net_qltp5.png",
    link: "/shop?brand=Calvin%20Klein",
  },
  {
    name: "Columbia",
    logo: "/brands/columbia_sportswear-logo-brandlogo.net.png",
    link: "/shop?brand=Columbia",
  },
  {
    name: "Tommy",
    logo: "/brands/Tommy Hilfiger USA_iduPAxbf0C_1.png",
    link: "/shop?brand=Tommy%20Jeans",
  },
  {
    name: "Hugo",
    logo: "/brands/hugo-boss-2012-vector-logo.png",
    link: "/shop?brand=HUGO",
  },
  {
    name: "Stradivarius",
    logo: "/brands/idQHuaQdFt_1752848186694.png",
    link: "/shop?brand=Stradivarius",
  },

  {
    name: "Levis",
    logo: "/brands/levis-vector-logo.png",
    link: "/shop?brand=Levi%27s",
  },
  {
    name: "Mango",
    logo: "/brands/mango-logo-brandlogos.net.png",
    link: "/shop?brand=Mango",
  },
  {
    name: "Nike",
    logo: "/brands/nike-logo_brandlogos.net_4q4hy.png",
    link: "/shop?brand=Nike",
  },
  {
    name: "Ralph Laurent",
    logo: "/brands/polo-ralph-lauren-logo-vector.png",
    link: "/shop?brand=Ralph%20Lauren",
  },
  {
    name: "NA-KD",
    logo: "/brands/NA-KD_idVQixcC-u_1.png",
    link: "/shop?brand=NA-KD",
  },
];

export default function BrandSlider() {
  return (
    <div className="overflow-hidden relative w-full">
      <div
        className="flex items-center pt-18 px-12 space-x-8 animate-slide"
        style={{ width: `${brands.length * 150}px` }}
      >
        {[...brands, ...brands].map((brand, index) => (
          <Link
            key={`${brand.name}-${index}`} // index ile key benzersiz olsun
            href={brand.link}
            className="flex-shrink-0 cursor-pointer transition-transform duration-300 hover:scale-110"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              width={120}
              height={120}
              style={{
                objectFit: "contain",
                width: "120px",
                height: "120px",
                display: "block",
              }}
              priority={true}
            />
          </Link>
        ))}
      </div>

      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-150px * ${brands.length}));
          }
        }

        .animate-slide {
          animation: slide 20s linear infinite;
        }

        .animate-slide:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
