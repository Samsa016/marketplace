import { getJson } from "./http";
import { productSchema, productsArraySchema } from "@/entities/product/models/product.schema";
import type { Product } from "@/entities/product/models/type";

export async function getProducts(): Promise<Product[]> {
  return getJson("/products", productsArraySchema);
}

export async function getProductById(productId: number): Promise<Product> {
  return getJson(`/products/${productId}`, productSchema);
}