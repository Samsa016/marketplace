import { getProducts } from "@/shared/api/products";
import { Product } from "@/entities/product/models/type"   

export async function MainPage() {
  const products: Product[] = await getProducts()

  return (
    <div>
      <div>Главное меню</div>
      {products.map((product) => (
        <div key={product.id}>
          <div>{product.title}</div>
          <div>{product.price}</div>
          <div>{product.description}</div>
        </div>
      ))}
    </div>

  )

}