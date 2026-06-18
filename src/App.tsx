// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ProductList } from "./features/products/ProductList";
import { ProductDetail } from "./features/products/ProductDetail";
import { CreateProduct } from "./features/products/CreateProduct";
import { EditProduct } from "./features/products/EditProduct";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<CreateProduct />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/products/:id/edit" element={<EditProduct />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
