from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    is_active: bool = True
    role: str = "viewer"


# Properties to receive on user creation
class UserCreate(UserBase):
    password: str


# Properties to receive on user update
class UserUpdate(UserBase):
    password: Optional[str] = None
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[str] = None


# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Properties to return to client
class User(UserInDBBase):
    pass


# Properties stored in DB, with password
class UserInDB(UserInDBBase):
    password_hash: str 