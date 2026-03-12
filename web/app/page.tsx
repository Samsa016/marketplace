import { getProducts } from "@/entities/product/api/products";
import { FilteredProductList } from "@/widgets/filtered-product-list/ui/FilteredProductList";
import { RecentlyViewed } from "@/widgets/recently-viewed/ui/RecentlyViewed";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main style={{ 
        padding: '40px 20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        fontFamily: 'Montserrat, sans-serif'
    }}>
      <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 700, 
          color: '#111827', 
          marginBottom: '32px' 
      }}>
          Каталог товаров
      </h1>
      
      <FilteredProductList initialProducts={products} />

      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '40px' }} />
      <RecentlyViewed />
    </main>
  );
}