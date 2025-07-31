"use client"; // Bu component'in client tarafında çalıştığını belirtir

import api from "@/lib/api"; // API servisiniz
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import LikeToggle from "./LikeToggle"; // LikeToggle bileşenini import edin
import AddToCart from "./AddToCart";

function ProductDetail({ params }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [isLiked, setIsLiked] = useState(false); // Favori durumu

  useEffect(() => {
    const fetchProductAndFavoriteStatus = async () => {
      if (!id) return;

      try {
        // Ürün detaylarını çek
        const productResponse = await api.get(`/products/${id}`);
        setProduct(productResponse.data);

        if (
          productResponse.data.images &&
          productResponse.data.images.length > 0
        ) {
          setSelectedImage(productResponse.data.images[0]);
        }

        // Favori statüsünü çek (yalnızca kullanıcı giriş yapmışsa)
        // JWT'nizin Axios interceptor'ları aracılığıyla gönderildiğini varsayıyoruz.
        try {
          // Backend'deki endpoint'inizin /user/{userId}/favorites/status/{productId}
          // veya /user/favorites/status/{productId} (eğer userId JWT'den alınıyorsa) olduğundan emin olun.
          // Mevcut kodunuzda /user/favorites/status/${id} şeklinde çağrılmış, bu iyi.
          const favoriteStatusResponse = await api.get(
            `/user/favorites/status/${id}`
          );
          // Backend'den { isLiked: true/false } şeklinde bir yanıt bekliyoruz
          setIsLiked(favoriteStatusResponse.data.isLiked);
        } catch (favErr) {
          // Eğer kullanıcı giriş yapmamışsa veya API 401 döndürürse, varsayılan olarak favori değil
          if (favErr.response && favErr.response.status === 401) {
            console.warn(
              "User not authenticated for favorite status check. Defaulting to not liked."
            );
            setIsLiked(false);
          } else {
            console.error("Error fetching favorite status:", favErr);
            setIsLiked(false); // Diğer hatalarda da varsayılan olarak favori değil
          }
        }
      } catch (err) {
        setError("Product Not Found or API Error");
        console.error("API error fetching product:", err);
      }
    };

    fetchProductAndFavoriteStatus();
  }, [id]);

  if (error) {
    return (
      <p className="text-center text-red-500 py-8 text-xl font-semibold">
        {error}
      </p>
    );
  }

  if (!product) {
    return <p className="text-center py-8 text-xl font-semibold">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6 md:p-10 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* images -right side*/}
      <div className="lg:w-1/2 flex flex-col items-center">
        {/* büyük */}
        <div className="relative w-full overflow-hidden pb-4">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt={product.name}
              // Next.js Image component'i kullanmak daha iyidir
              // layout="fill" // Eğer Image component kullanıyorsanız
              // objectFit="contain" // Eğer Image component kullanıyorsanız
              className="shadow-sm w-full h-auto" // width ve height ayarlamasını Tailwind ile yapabilirsiniz
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
              Not Found
            </div>
          )}
        </div>

        {/* küçük */}
        {product.images && product.images.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 ">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`
                  relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 // Boyutları biraz daha belirginleştirdim
                  cursor-pointer overflow-hidden rounded-md
                  ${
                    selectedImage === image
                      ? "ring-2 ring-blue-500 shadow-md"
                      : "ring-0"
                  } // Seçili olanı daha belirgin yapalım
                `}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`${product.name} - image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* product info - left side */}
      <div className="lg:w-1/2 flex flex-col p-4">
        <h1 className="text-3xl md:text-4xl font-bold  dark:text-white light:text-black mb-2">
          {product.name}
        </h1>
        <p className="light:text-neutral-400 dark:text-neutral-100 py-1 text-md ">
          <span>{product.category}</span>
        </p>
        <p className="py-1 italic text-neutral-800 dark:text-neutral-50  ">
          <span className="font-semibold text-lg">{product.brand}</span>
        </p>

        {/* price */}
        {product.discount > 0 && product.discount !== null ? (
          <div className="mb-4">
            {/* discounted*/}
            <p className="text-3xl md:text-4xl pb-0.5 font-bold text-black text-shadow-2xs">
              £
              {(
                product.price -
                (product.price * product.discount) / 100
              ).toFixed(2)}
            </p>
            <div className="flex items-baseline ">
              {/* org price */}
              <span className="text-neutral-400 dark:text-white line-through text-md mr-2">
                £{product.price.toFixed(2)}
              </span>
              {/* discount rate */}
              <span className="text-sm text-red-700 ">
                %{product.discount} discount
              </span>
            </div>
          </div>
        ) : (
          // without discount
          <p className="text-3xl md:text-4xl font-bold dark:text-white  text-gray-900 mb-4">
            £{product.price.toFixed(2)}
          </p>
        )}

        {product.sku && (
          <p className="text-sm light:text-gray-700 dark:text-neutral-200 pb-4">
            SKU: <span className="font-mono">{product.sku}</span>
          </p>
        )}

        {/*size and stock */}
        {product.size && product.size.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {product.size.map((detail, index) => (
                <span
                  key={index}
                  className={`
                    px-4 py-2 border shadow-sm text-sm font-medium 
                    ${
                      detail.stockStatus === "OUT_OF_STOCK"
                        ? "bg-gray-100 text-black cursor-not-allowed line-through border-neutral-300"
                        : "bg-white text-black border-black cursor-pointer hover:bg-black hover:text-white"
                    }
                  `}
                >
                  {detail.value} ({detail.stockStatus.replace(/_/g, " ")})
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-4 items-center">
          {" "}
          <AddToCart productId={id} />
          <LikeToggle productId={id} initialIsLiked={isLiked} />
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
