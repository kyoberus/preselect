from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import database, models, schemas, security

router = APIRouter()

@router.post("/auth/login", response_model=schemas.Token)
def login(request: schemas.LoginRequest, db: Session = Depends(database.get_db)):
    # 1. ค้นหา Admin จาก Email
    admin = db.query(models.Admin).filter(models.Admin.email == request.email).first()
    
    # 2. ตรวจสอบว่ามี user หรือไม่ และ Password ตรงไหม
    if not admin or not security.verify_password(request.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # 3. บันทึก Log ลง Table admin_logs
    new_log = models.AdminLog(admin_id=admin.id, action="login_success")
    db.add(new_log)
    db.commit()

    # 4. สร้าง JWT Token (อายุ 1 วันตาม config)
    access_token = security.create_access_token(data={"sub": admin.email})

    return {"access_token": access_token, "token_type": "bearer"}