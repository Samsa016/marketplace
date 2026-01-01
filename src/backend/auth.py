from fastapi import HTTPException, Depends, APIRouter
from pydantic import BaseModel
from typing import Optional, List
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
import models


SECRET_KEY = "31a4c2591e72b555daf29f91d96eb8fa"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserBase(BaseModel):
    username: str
    email: str
    
class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    password_hash: str
    class Config:
        from_attributes = True

class ProductInBasket(BaseModel):
    product_id: int
    quantity: int

class ProductInFavorite(BaseModel):
    product_id: int

class ProductInHistory(BaseModel):
    product_id: int

class UserLogin(BaseModel):
    username: str
    password: str
    localstorage_basket: Optional[List[ProductInBasket]] = None
    localstorage_favorites: Optional[List[ProductInFavorite]] = None
    localstorage_history: Optional[List[ProductInHistory]] = None

class Token(BaseModel):
    access_token: str
    token_type: str


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:

        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        
        user_id: int = int(payload.get("sub"))
        if not user_id:
            raise credentials_exception
        
        user = db.query(models.UserDB).filter(models.UserDB.id == user_id).first()
        if user is None:
            raise credentials_exception
        return user

    except JWTError:
        raise credentials_exception


router = APIRouter()

@router.post("/register", response_model=User)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    users_db = db.query(models.UserDB).filter((models.UserDB.email == user.email)).first()
    if users_db:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_pasword = get_password_hash(user.password)

    new_user_db = models.UserDB(
        username=user.username,
        email=user.email,
        password_hash=hashed_pasword
    )

    db.add(new_user_db)
    db.commit()
    db.refresh(new_user_db)

    return new_user_db

@router.post("/login", response_model=Token)
async def login_user(user: UserLogin, db: Session = Depends(get_db)):

    user_db = db.query(models.UserDB).filter(models.UserDB.username == user.username).first()
    if not user_db or not verify_password(user.password, user_db.password_hash):
        raise HTTPException(status_code=400, detail="The user was not found")

    if user.localstorage_history:
        for product in user.localstorage_history:
            history_item = db.query(models.HistoryDB).filter(
                models.HistoryDB.user_id == user_db.id,
                models.HistoryDB.product_id == product.product_id
            ).first()
            if not history_item:
                new_history_item = models.HistoryDB(
                    user_id=user_db.id,
                    product_id=product.product_id
                )
                db.add(new_history_item)

    if user.localstorage_favorites:
        for product in user.localstorage_favorites:
            favorite_item = db.query(models.FavoriteDB).filter(
                models.FavoriteDB.user_id == user_db.id,
                models.FavoriteDB.product_id == product.product_id
            ).first()
            if not favorite_item:
                new_favorite_item = models.FavoriteDB(
                    user_id=user_db.id,
                    product_id=product.product_id
                )
                db.add(new_favorite_item)

    if user.localstorage_basket:
        for product in user.localstorage_basket:
            basket_item = db.query(models.BasketDB).filter(
                models.BasketDB.user_id == user_db.id,
                models.BasketDB.product_id == product.product_id
            ).first()

            if basket_item:
                basket_item.quantity += product.quantity
            else:
                new_basket_item = models.BasketDB(
                    user_id=user_db.id,
                    product_id=product.product_id,
                    quantity=product.quantity
                )
                db.add(new_basket_item)
        
    db.commit()
    
    
            
    access_token_expire = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": str(user_db.id)}, expires_delta=access_token_expire)
    return {"access_token": access_token, "token_type": "bearer"}