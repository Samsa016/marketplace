export interface Product {
    id: number;
    title: string;
    price: number;
    description?: string;
    images?: string[];
    category?: string;
    rating?: number;
    brand?: string;
    reviews?: Review[];
    tags?: string[] | string;
    stock?: number;
    discountPercentage?: number;
    sku?: string;
    weight?: number;
    dimensions?: {
         width: number,
         height: number,
         depth: number,
       },
    warrantyInformation?: string,
    shippingInformation?: string,
    availabilityStatus?: string,
    returnPolicy?: string,
    minimumOrderQuantity?: number,
    meta?: {
    createdAt?: string,
    updatedAt?: string,
    barcode?: string,
    qrCode?: string,
    thumbnail?: string,
    },


}

export interface Review {
    reviewerName: string;
    date: string;
    rating: number;
    comment: string;
}

