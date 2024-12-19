import { createContext, useContext, useReducer } from "react";
import { filterReducer } from "../reducers";

const filterInitialState = {
  productList: [],
  lowStockOnly: false, // New flag for low stock filtering
  sortBy: null, // For sorting by price or discount
  ratings: null, // For filtering by rating
};

const FilterContext = createContext(filterInitialState);

export const FilterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, filterInitialState);

  // Initialize product list
  function initialProductList(products) {
    dispatch({
      type: "PRODUCT_LIST",
      payload: {
        products: products,
      },
    });
  }

  // Filter for products with low stock
  function lowStock(products) {
    return state.lowStockOnly ? products.filter((product) => product.stock < 10) : products;
  }

  // Sort products by discount or price
  function sort(products) {
    if (state.sortBy === "discount") {
      return products.sort((a, b) => {
        const discountA = ((a.price - a.discountedPrice) / a.price) * 100 || 0;
        const discountB = ((b.price - b.discountedPrice) / b.price) * 100 || 0;
        return discountB - discountA; // Highest discount first
      });
    }
    if (state.sortBy === "lowtohigh") {
      return products.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (state.sortBy === "hightolow") {
      return products.sort((a, b) => Number(b.price) - Number(a.price));
    }
    return products;
  }

  // Filter products by rating
  function rating(products) {
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
  }

  // Apply all filters
  const filteredProductList = rating(sort(lowStock(state.productList)));

  const value = {
    state,
    dispatch,
    products: filteredProductList,
    initialProductList,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  return context;
};
