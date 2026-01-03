from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    basket_items = relationship("BasketDB", back_populates="owner")
    favorite_items = relationship("FavoriteDB", back_populates="owner")
    history_items = relationship("HistoryDB", back_populates="owner")
    orders = relationship("OrderDB", back_populates="owner")

class BasketDB(Base):
    __tablename__ = "baskets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, index=True) 
    quantity = Column(Integer, default=1)

    owner = relationship("UserDB", back_populates="basket_items")

class FavoriteDB(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, index=True)

    owner = relationship("UserDB", back_populates="favorite_items")

class HistoryDB(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, index=True)
    viewed_at = Column(DateTime, default=datetime.utcnow) 

    owner = relationship("UserDB", back_populates="history_items")

class OrderDB(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key= True, index= True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    total_price = Column(Float, default=0.0)
    status = Column(String, default="Processing")

    owner = relationship("UserDB", back_populates="orders")
    items = relationship("OrderItemDB", back_populates="order")

class OrderItemDB(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, index=True)
    quantity = Column(Integer, default=1)
    price_at_purchase = Column(Float, default=0.0)

    order = relationship("OrderDB", back_populates="items")