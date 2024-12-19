import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTitle } from "../hooks/useTitle";
import { Rating } from "../components";
import { useCart } from "../context";
import { getProduct } from "../services";
import logoUser from "../assets/logo.png";

export const ProductDetail = () => {
  const { cartList, addToCart, removeFromCart } = useCart();
  const [inCart, setInCart] = useState(false);
  const [product, setProduct] = useState({});
  const { id } = useParams();
  useTitle(product.title);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        toast.error(error.message, {
          closeButton: true,
          position: "bottom-center",
        });
      }
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const productInCart = cartList.find((item) => item.id === product.id);
    if (productInCart) {
      setInCart(true);
    } else {
      setInCart(false);
    }
  }, [cartList, product.id]);

  return (
    <main>
      <section>
        <h1 className="mt-10 mb-5 text-4xl text-center font-bold text-gray-900 dark:text-slate-200">
          {product.title}
        </h1>
        <p className="mb-5 text-lg text-center text-gray-900 dark:text-slate-200">
          {product.description}
        </p>
        <div className="flex flex-wrap justify-between gap-6">
          <div className="max-w-xl my-3">
            <img
              className="rounded w-full"
              src={product.thumbnail}
              alt={product.title}
            />
          </div>
          <div className="max-w-xl my-3">
            <p className="text-3xl font-bold text-gray-900 dark:text-slate-200">
              <span className="mr-1">$</span>
              <span>{product.price}</span>
            </p>
            <p className="my-3">
              <Rating rating={product.rating} />
            </p>
            <p className="my-4 select-none">
              <span className="font-semibold text-amber-500 border bg-amber-50 rounded-lg px-3 py-1 mr-2">
                {product.availabilityStatus}
              </span>
              <span className="font-semibold text-blue-500 border bg-slate-100 rounded-lg px-3 py-1 mr-2">
                {product.weight}g
              </span>
            </p>
            <p className="text-lg text-gray-900 dark:text-slate-200">
              <strong>Category:</strong> {product.category}
            </p>
            <p className="text-lg text-gray-900 dark:text-slate-200">
              <strong>Brand:</strong> {product.brand}
            </p>
            <p className="text-lg text-gray-900 dark:text-slate-200">
              <strong>SKU:</strong> {product.sku}
            </p>
            <p className="text-lg text-gray-900 dark:text-slate-200">
              <strong>Warranty Information:</strong>{" "}
              {product.warrantyInformation}
            </p>
            <p className="text-lg text-gray-900 dark:text-slate-200">
              <strong>Shipping Information:</strong>{" "}
              {product.shippingInformation}
            </p>
            <p className="text-lg text-gray-900 dark:text-slate-200">
              <strong>Return Policy:</strong> {product.returnPolicy}
            </p>
            <p className="text-lg text-gray-900 dark:text-slate-200">
              <strong>Minimum Order Quantity:</strong>{" "}
              {product.minimumOrderQuantity}
            </p>
            <div className="mt-5">
              {product.tags && product.tags.length > 0 && (
                <p className="text-lg text-gray-900 dark:text-slate-200">
                  <strong>Tags:</strong>
                  <span className="ml-2">{product.tags.join(", ")}</span>
                </p>
              )}
            </div>
            <div className="mt-5">
              {product.dimensions && (
                <p className="text-lg text-gray-900 dark:text-slate-200">
                  <strong>Dimensions:</strong>
                  <span className="ml-2">
                    Width: {product.dimensions.width} cm
                  </span>
                  <span className="ml-2">
                    Height: {product.dimensions.height} cm
                  </span>
                  <span className="ml-2">
                    Depth: {product.dimensions.depth} cm
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 w-full">
          {product.reviews && product.reviews.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-200 mb-6">
                Customer Reviews
              </h2>
              <div className="space-y-8">
                {product.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 w-full"
                  >
                    <div className="flex items-center mb-5">
                      <img
                        className="w-12 h-12 mr-4 rounded-full"
                        src={review.reviewerProfilePic || logoUser}
                        alt="Reviewer"
                      />
                      <div className="font-medium dark:text-white">
                        <p>{review.reviewerName}</p>
                        <time
                          datetime={review.date}
                          className="block text-sm text-gray-500 dark:text-gray-400"
                        >
                          Reviewed on {review.date}
                        </time>
                      </div>
                    </div>
                    <div className="flex items-center mb-3 space-x-2 rtl:space-x-reverse">
                      {[...Array(5)].map((_, starIndex) => (
                        <svg
                          key={starIndex}
                          className={`w-5 h-5 ${
                            starIndex < review.rating
                              ? "text-yellow-300"
                              : "text-gray-300 dark:text-gray-500"
                          }`}
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                      ))}
                      <h3 className="ms-2 text-sm font-semibold text-gray-900 dark:text-white">
                        {review.rating >= 4
                          ? "Thinking to buy another one!"
                          : "Could be better!"}
                      </h3>
                    </div>
                    <p className="mb-3 text-gray-500 dark:text-gray-400">
                      {review.comment}
                    </p>
                    <p className="mb-4 text-gray-500 dark:text-gray-400">
                      {review.additionalFeedback}
                    </p>
                    <Link
                      href="#"
                      className="block mb-6 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Read more
                    </Link>
                    <aside>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {review.helpfulCount} people found this helpful
                      </p>
                      <div className="flex items-center mt-4">
                        <Link
                          href="#"
                          className="mr-3 px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                          Helpful
                        </Link>
                        <Link
                          href="#"
                          className="ps-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 border-gray-200 ms-5 border-s md:mb-0 dark:border-gray-600"
                        >
                          Report abuse
                        </Link>
                      </div>
                    </aside>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-lg text-gray-600 dark:text-slate-400">
              No reviews yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};
