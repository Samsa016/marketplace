from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Union, List
from auth import get_current_user, User, router as auth_router, get_current_user, ProductInBasket, ProductInFavorite, ProductInHistory
from fastapi.middleware.cors import CORSMiddleware
import httpx
from sqlalchemy.orm import Session
from database import SessionLocal, engine, get_db
from models import BasketDB
import models

class Review(BaseModel):
    reviewerName: str
    date: str
    rating: float
    comment: str

class Product(BaseModel):
    id: Optional[int] = None
    title: str
    price: float
    images: Optional[List[str]] = None
    description: Optional[str] = None
    rating: Optional[float] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    reviews: Optional[List[Review]] = None
    tags: Optional[Union[str, List[str]]] = None
    stock: Optional[int] = None
    discountPercentage: Optional[float] = None
    sku: Optional[str] = None
    weight: Optional[float] = None
    dimensions: Optional[Dict[str, Optional[float]]] = None
    warrantyInformation: Optional[str] = None
    shippingInformation: Optional[str] = None
    availabilityStatus: Optional[str] = None
    returnPolicy: Optional[str] = None
    minimumOrderQuantity: Optional[int] = None
    meta: Optional[Dict[str, Optional[str]]] = None
    quantity: Optional[int] = None
    
class Order(BaseModel):
    id: Optional[int] = None
    date: str
    total: float
    items: List[dict]
    customer: dict

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
async def read_root():
    return {"message": "API работает"}

@app.get("/products", response_model=List[Product])
async def get_products():
    return await get_products_from_api("https://dummyjson.com/products")

product_base = get_products()

@app.get("/products/{productid}")
async def read_product(productid: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://dummyjson.com/products/{productid}")
        if response.status_code == 200:
            data = response.json()
            return Product(**data)
        else:
            raise HTTPException(status_code=response.status_code, detail="Product not found")
@app.get("/categories/{categoryid}")
async def read_category(categoryid: int):
    return ("Category ID requested:", categoryid)

async def get_products_from_api(url: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            if response.status_code == 200:
                data = response.json()
                return [Product(**item) for item in data.get("products", [])]
            else:
                return []
        except Exception as e:
            print(f"Error: {e}")
            return []
        
orders: List[Order] = []

@app.get("/product/myorders")
async def get_my_orders(current_user: User = Depends(get_current_user)):
    return {
        "message": "Это мои заказы",
        "user": current_user.username,
        "items": orders
    }

@app.post("/product/buy")
async def create_order(current_user: User = Depends(get_current_user)):
    return {
        "message": "Заказ создан",
        "user": current_user.username
    }


@app.post("/basket/add")
async def add_to_basket(item: ProductInBasket, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    basket_item = db.query(BasketDB).filter(
        BasketDB.user_id == current_user.id,
        BasketDB.product_id == item.product_id
    ).first()
    if basket_item:
        basket_item.quantity += item.quantity
    else:
        new_basket_item = BasketDB(
            user_id = current_user.id,
            product_id = item.product_id,
            quantity = item.quantity
        )
        db.add(new_basket_item)

    db.commit()
    return {"message": "Товар добавлен в корзину"}

@app.post("/basket/remove")
async def remove_from_basket(item: ProductInBasket, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    basket_items = db.query(BasketDB).filter(
        BasketDB.product_id == item.product_id,
        BasketDB.user_id == current_user.id
        ).first()

    if not basket_items:
        raise HTTPException(status_code=404, detail="Товар не найден в корзине")
    if basket_items:
        basket_items.quantity -= item.quantity
        if basket_items.quantity <= 0:
            db.delete(basket_items)
    db.commit()
    return {"message": "Товар удален из корзины"}

@app.get("/basket", response_model=List[Product])
async def get_basket(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    basket_items = db.query(BasketDB).filter(BasketDB.user_id == current_user.id).all()
    products_in_basket = []
    async with httpx.AsyncClient() as client:
        for item in basket_items:
                try:
                    response = await client.get(f"https://dummyjson.com/products/{item.product_id}")

                    if response.status_code == 200:
                        data = response.json()
                        product = Product(**data)
                        product.quantity = item.quantity 
                        products_in_basket.append(product)
                except Exception as e:
                    print(f"Ошибка получения товара {item.product_id}: {e}")

    return products_in_basket

@app.get("/favorites", response_model=List[Product])
async def get_favorites(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    favorite_items = db.query(models.FavoriteDB).filter(models.FavoriteDB.user_id == current_user.id).all()
    product_in_favorites = []
    async with httpx.AsyncClient() as client:
        for item in favorite_items:
            try:
                response = await client.get(f"https://dummyjson.com/products/{item.product_id}")

                if response.status_code == 200:
                    data = response.json()
                    product = Product(**data)
                    product_in_favorites.append(product)
            except Exception as e:
                print(f"Ошибка получения товара {item.product_id}: {e}")
    return product_in_favorites

@app.post("/favorites/add")
async def add_to_favorites(item: ProductInFavorite, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    favorite_item = db.query(models.FavoriteDB).filter(
        models.FavoriteDB.user_id == current_user.id,
        models.FavoriteDB.product_id == item.product_id
    ).first()
    if not favorite_item:
        new_favorite_item = models.FavoriteDB(
            user_id = current_user.id,
            product_id = item.product_id
        )
        db.add(new_favorite_item)
        db.commit()

@app.post("/favorites/remove")
async def remove_from_favorites(item: ProductInFavorite, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    favorite_item = db.query(models.FavoriteDB).filter(
        models.FavoriteDB.user_id == current_user.id,
        models.FavoriteDB.product_id == item.product_id
    ).first()

    if not favorite_item:
        raise HTTPException(status_code=404, detail="Товар не найден в избранном")

    db.delete(favorite_item)
    db.commit()
    return {"message": "Товар удален из избранного"}

@app.get("/history", response_model=List[Product])
async def get_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    history_items = db.query(models.HistoryDB).filter(models.HistoryDB.user_id == current_user.id).order_by(models.HistoryDB.viewed_at.desc()).all()
    products_in_history = []
    async with httpx.AsyncClient() as client:
        for item in history_items:
            try:
                response = await client.get(f"https://dummyjson.com/products/{item.product_id}")

                if response.status_code == 200:
                    data = response.json()
                    product = Product(**data)
                    products_in_history.append(product)
            except Exception as e:
                print(f"Ошибка получения товара {item.product_id}: {e}")
    return products_in_history

@app.post("/history/add")
async def add_to_history(item: ProductInHistory, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    history_item = db.query(models.HistoryDB).filter(
        models.HistoryDB.user_id == current_user.id,
        models.HistoryDB.product_id == item.product_id
    ).first()
    if history_item:
        db.delete(history_item)
        db.commit()
    new_history_item = models.HistoryDB(
        user_id=current_user.id,
        product_id=item.product_id
    )

    db.add(new_history_item)
    db.commit()
    return {"message": "История обновлена"}
    

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Авторизация"],
)