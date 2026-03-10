import { getJson } from "@/shared/api/http";

import { ProductSchema, productsArraySchema } from "@/entities/product/models/product.schema";
import type { Product } from "@/entities/product/models/type";

export async function getProducts(): Promise<Product[]> {

  const data = await getJson<Product[]>("/products")
  console.log("API Response data:", data);
  
  if (!data) {
    console.error("API returned undefined or null");
    return [];
  }
  
  return productsArraySchema.parse(data);
}

export async function getProductById(productId: number): Promise<Product> {
  const data = await getJson<Product>(`/products/${productId}`)
  
  if (!data) {
    throw new Error("Product data not found");
  }
  
  return ProductSchema.parse(data)
}