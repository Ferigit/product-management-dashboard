import { http, HttpResponse, delay } from "msw";
import { mockProducts } from "./data";
import type { Product, PaginatedResponse, ProductFormData } from "../types";

const products = [...mockProducts];

export const handlers = [
  http.get("/api/products", async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase();
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");

    let filtered = [...products];

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search),
      );
    }

    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filtered.slice(start, end);

    return HttpResponse.json<PaginatedResponse<Product>>({
      data,
      total,
      page,
      pageSize,
      totalPages,
    });
  }),

  http.get("/api/products/:id", async ({ params }) => {
    await delay(200);
    const product = products.find((p) => p.id === params.id);

    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(product);
  }),

  http.get("/api/products/check-sku/:sku", async ({ params }) => {
    await delay(500);
    const exists = products.some((p) => p.sku === params.sku);
    return HttpResponse.json({ available: !exists });
  }),

  http.post("/api/products", async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as ProductFormData;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.unshift(newProduct);
    return HttpResponse.json(newProduct, { status: 201 });
  }),

  http.put("/api/products/:id", async ({ params, request }) => {
    await delay(400);
    const body = (await request.json()) as ProductFormData;
    const index = products.findIndex((p) => p.id === params.id);

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    products[index] = {
      ...products[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(products[index]);
  }),

  http.delete("/api/products/:id", async ({ params }) => {
    await delay(300);
    const index = products.findIndex((p) => p.id === params.id);

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    products.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
