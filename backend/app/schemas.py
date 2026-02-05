from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

from datetime import datetime

class AdminResponse(BaseModel):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    date_created: Optional[datetime] = None
    date_updated: Optional[datetime] = None

    class Config:
        orm_mode = True

class AdminUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

class AdminSetPassword(BaseModel):
    password: str

class AdminCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    password: str