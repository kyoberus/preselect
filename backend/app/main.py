from fastapi import FastAPI
from .database import engine, SessionLocal
from . import models, security
from .api_router import router as api_router

# สร้าง Table ใน Database (ถ้ายังไม่มี)
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Register Router
app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "System Ready"}

# --- Script ชั่วคราวสำหรับสร้าง Admin คนแรก (ลบออกได้ภายหลัง) ---
@app.on_event("startup")
def create_initial_admin():
    db = SessionLocal()
    email = "admin@example.com"
    password = "password123"
    
    user = db.query(models.Admin).filter(models.Admin.email == email).first()
    if not user:
        print(f"Creating initial admin: {email}")
        hashed_pw = security.get_password_hash(password)
        new_admin = models.Admin(email=email, hashed_password=hashed_pw)
        db.add(new_admin)
        db.commit()
    db.close()