from fastapi import FastAPI, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, Dict, Union, List
from auth import get_current_user, User, router as auth_router, get_current_user, ProductInBasket, ProductInFavorite, ProductInHistory
from fastapi.middleware.cors import CORSMiddleware
import httpx
from sqlalchemy.orm import Session
from database import SessionLocal, engine, get_db
from models import BasketDB
import models
from datetime import datetime
import uuid
from yookassa import Configuration, Payment

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

class OrderItemProduct(BaseModel):
    product_id: int
    quantity: int
    price: float
    title: Optional[str]
class Order(BaseModel):
    id: Optional[int] = None
    date: str
    total: float
    items: List[OrderItemProduct]

class PaymentResponse(BaseModel):
    order_id: int
    payment_url: str

app = FastAPI()

Configuration.account_id = '1241051'
Configuration.secret_key = 'test_Ozla4iYb52zfA4m8ubajDiW_x1mEhcgfYSc35Y_GeZs'

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
        

@app.get("/product/myorders", response_model=List[Order])
async def check_myorder(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(models.OrderDB).filter(current_user.id == models.OrderDB.user_id).all()
    
    final_orders = []
    
    async with httpx.AsyncClient() as client:
        for order in orders:
            current_order = []

            for item in order.items:

                product_title = "Товар удален"
    
                try:
                    response = await client.get(f"https://dummyjson.com/products/{item.product_id}")
                    if response.status_code == 200:
                        data = response.json()
                        product_title = data.get("title", "Unknown")
                except Exception:
                    pass

                current_order.append(OrderItemProduct(
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price=item.price_at_purchase,
                    title=product_title
                ))

            final_orders.append(Order(
                id=order.id,
                date=str(order.date),
                total=order.total_price,
                items=current_order
            ))
            
    return final_orders

@app.post("/product/buy", response_model=PaymentResponse)
async def create_order(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(models.UserDB).filter(models.UserDB.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    basket = db.query(models.BasketDB).filter(models.BasketDB.user_id == user.id).all()
    if not basket:
        raise HTTPException(status_code=400, detail="Basket is empty")

    tot_price = 0.0
    order_items_to_save = []

    async with httpx.AsyncClient() as client:
        for item in basket:
            try:
                response = await client.get(f"https://dummyjson.com/products/{item.product_id}")
                if response.status_code == 200:
                    data = response.json()
                    p_price = float(data.get("price", 0))
                    tot_price += p_price * item.quantity
                    
                    order_items_to_save.append({
                        "product_id": item.product_id,
                        "quantity": item.quantity,
                        "price_at_purchase": p_price
                    })
            except Exception as e:
                print(f"Error: {e}")

    new_order = models.OrderDB(
        user_id=user.id,
        total_price=tot_price,
        date=datetime.utcnow(),
        status="Pending" 
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for data in order_items_to_save:
        new_item = models.OrderItemDB(
            order_id=new_order.id,
            product_id=data["product_id"],
            quantity=data["quantity"],
            price_at_purchase=data["price_at_purchase"]
        )
        db.add(new_item)

    try:
        idempotence_key = str(uuid.uuid4())
        payment = Payment.create({
            "amount": {
                "value": str(tot_price),
                "currency": "USD"
            },
            "confirmation": {
                "type": "redirect",
                "return_url": "http://localhost:5173/payment-success"
            },
            "capture": True,
            "description": f"Заказ №{new_order.id}"
        }, idempotence_key)
        new_order.payment_id = payment.id
        db.commit()

        db.query(models.BasketDB).filter(models.BasketDB.user_id == user.id).delete()
        db.commit()

        return PaymentResponse(
                order_id=new_order.id,
                payment_url=payment.confirmation.confirmation_url
        )
    
    except Exception as e:
        print(f"Ошибка ЮКассы: {e}")
        db.delete(new_order) 
        db.commit()
        raise HTTPException(status_code=500, detail="Не удалось создать платеж")

@app.post("/webhook")
async def yookassa_webhook(request: Request, db: Session = Depends(get_db)):
    event = await request.json()
    print("Получен вебхук", event)

    if event.get("event") == "payment.succeeded":

        payment_data = event.get("object", {})
        payment_id = payment_data.get("id")

        print(f"Оплата прошла номер заказа №{payment_id}")

        order = db.query(models.OrderDB).filter(payment_id == models.OrderDB.payment_id).first()

        if order:
            order.status = "Paid"
            db.commit()
            print(f"Статус заказа {order.id} изменен на Paid")
        else:
            print("Заказ с таким payment_id не найден в базе")
    return {"status": "ok"}

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