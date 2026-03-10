import { z } from "zod";

export const ProductSchema = z.object({
    id: z.number(),
    title: z.string(),
    price: z.number(),

    images: z.array(z.string()).optional().default([]),
    description: z.string().optional().nullable(),
    rating: z.number().optional().nullable(),
    category: z.string().optional().nullable(),
    brand: z.string().optional().nullable(),

    stock: z.number().optional().nullable(),
    discountPercentage: z.number().optional().nullable(),
    sku: z.string().optional().nullable(),
    weight: z.number().optional().nullable(),

    dimensions: z
        .object({
        width: z.number().optional().nullable(),
        height: z.number().optional().nullable(),
        depth: z.number().optional().nullable(),
        })
        .optional()
        .nullable(),

    warrantyInformation: z.string().optional().nullable(),
    shippingInformation: z.string().optional().nullable(),
    availabilityStatus: z.string().optional().nullable(),
    returnPolicy: z.string().optional().nullable(),
    minimumOrderQuantity: z.number().optional().nullable(),

    meta: z.unknown().optional().nullable(),

    quantity: z.number().optional().nullable(),
    
    reviews: z.unknown().optional().nullable(),
    tags: z.unknown().optional().nullable(),
}).strip();

export const productsArraySchema = z.array(ProductSchema);