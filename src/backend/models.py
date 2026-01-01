from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
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