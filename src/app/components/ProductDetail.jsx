import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/${id}`
        );
        setProduct(response.data);

        if (response.data.images && response.data.images.length > 0) {
          setSelectedImage(response.data.images[0]);
        }
      } catch (err) {
        setError("Not found");
        console.error("API error:", err);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    console.log(`Ürün ${isLiked ? "disliked" : "liked"}`);
  };

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
        <div className="relative w-full    overflow-hidden pb-4">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt={product.name}
              layout="fill"
              objectFit="contain"
              className="shadow-sm"
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
                  relative  w-18 
                  cursor-pointer  overflow-hidden 
                  ${selectedImage === image ? "ring shadow-md" : "ring-0"}
                `}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`${product.name} - image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className=""
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* product info - left side */}
      <div className="lg:w-1/2 flex flex-col p-4  ">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
          {product.name}
        </h1>
        <p className="  text-neutral-400 py-1 text-md ">
          <span className="">{product.category}</span>
        </p>
        <p className=" py-1 italic text-neutral-800 ">
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
              <span className="text-neutral-400 line-through text-md mr-2">
                £{product.price.toFixed(2)}
              </span>
              {/* discount rate */}
              <span className="text-sm  text-neutral-500 ">
                %{product.discount} discount
              </span>
            </div>
          </div>
        ) : (
          // without discount
          <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            £{product.price.toFixed(2)}
          </p>
        )}

        {product.sku && (
          <p className="text-sm text-gray-700 pb-4">
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
        <div className="flex">
          <button className="bg-black text-white py-3 px-6  text-lg font-semibold hover:bg-neutral-800  cursor-pointer transition duration-300 shadow-md self-start">
            Add to Cart
          </button>
          <button
            onClick={handleLikeClick}
            className={`
              flex items-center justify-center gap-2 px-6 py-3  
              transition duration-300 shadow-md
              ${
                isLiked
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-white text-black border border-black hover:bg-gray-100"
              }
            `}
          >
            <span role="img" aria-label="heart">
              {isLiked ? "❤️" : "🤍"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
