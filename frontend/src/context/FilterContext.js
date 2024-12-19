import { createContext, useContext, useReducer, useCallback } from "react";
import { filterReducer } from "../reducers";

const filterInitialState = {
  productList: [],
  lowStockOnly: false, // Filter for low stock
  sortBy: null, // Sorting by price or discount
  ratings: null, // Filtering by rating
};

const FilterContext = createContext(filterInitialState);

export const FilterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, filterInitialState);

  // Initialize product list with useCallback
  const initializeProductList = useCallback((products) => {
    dispatch({
      type: "PRODUCT_LIST",
      payload: { products },
    });
  }, []);

  // Filter for products with low stock
  const filterLowStock = useCallback(
    (products) => {
      return state.lowStockOnly
        ? products.filter((product) => product.stock < 10)
        : products;
    },
    [state.lowStockOnly]
  );

  // Sort products by discount or price
  const sortProducts = useCallback(
    (products) => {
      if (state.sortBy === "discount") {
        return [...products].sort((a, b) => {
          const discountA =
            ((a.price - a.discountedPrice) / a.price) * 100 || 0;
          const discountB =
            ((b.price - b.discountedPrice) / b.price) * 100 || 0;
          return discountB - discountA; // Sort by highest discount
        });
      }
      if (state.sortBy === "lowtohigh") {
        return [...products].sort((a, b) => Number(a.price) - Number(b.price));
      }
      if (state.sortBy === "hightolow") {
        return [...products].sort((a, b) => Number(b.price) - Number(a.price));
      }
      return products;
    },
    [state.sortBy]
  );

  // Filter products by rating
  const filterByRating = useCallback(
    (products) => {
      if (state.ratings === "4STARSABOVE") {
        return products.filter((product) => product.rating >= 4);
      }
      if (state.ratings === "3STARSABOVE") {
        return products.filter((product) => product.rating >= 3);
      }
      if (state.ratings === "2STARSABOVE") {
        return products.filter((product) => product.rating >= 2);
      }
      if (state.ratings === "1STARSABOVE") {
        return products.filter((product) => product.rating >= 1);
      }
      return products;
    },
    [state.ratings]
  );

  // Apply all filters in sequence
  const filteredProductList = filterByRating(
    sortProducts(filterLowStock(state.productList))
  );

  const value = {
    state,
    dispatch,
    products: filteredProductList,
    initializeProductList, // Stabilized with useCallback
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
