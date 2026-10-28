"use client";

import HomePage from "../page";

// The main storefront is the canonical product catalogue. Keep /products usable
// for existing links while sharing the same filters and cart state.
export default function ProductsIndexPage() {
  return <HomePage />;
}
