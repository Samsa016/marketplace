import { getProducts } from "@/entities/product/api/products";
import { ProductCard } from "@/widgets/product-card/ui/ProductCard";

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
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '24px' 
      }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}