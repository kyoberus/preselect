from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from . import database, models, schemas, security

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.Admin).filter(models.Admin.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/auth/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    # Swagger UI sends username/password as form data
    admin = db.query(models.Admin).filter(models.Admin.email == form_data.username).first()
    if not admin or not security.verify_password(form_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = security.create_access_token(data={"sub": admin.email})
    return {"access_token": access_token, "token_type": "bearer"}

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

@router.post("/admins", response_model=schemas.AdminResponse)
def create_admin(admin: schemas.AdminCreate, current_user: models.Admin = Depends(get_current_user), db: Session = Depends(database.get_db)):
    # Check if existing
    db_admin = db.query(models.Admin).filter(models.Admin.email == admin.email).first()
    if db_admin:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = security.get_password_hash(admin.password)
    new_admin = models.Admin(
        email=admin.email,
        hashed_password=hashed_password,
        first_name=admin.first_name,
        last_name=admin.last_name,
        phone=admin.phone
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin

@router.get("/admins", response_model=list[schemas.AdminResponse])
def get_admins(current_user: models.Admin = Depends(get_current_user), db: Session = Depends(database.get_db)):
    admins = db.query(models.Admin).order_by(models.Admin.id).all()
    return admins

@router.get("/admins/{admin_id}", response_model=schemas.AdminResponse)
def get_admin(admin_id: int, current_user: models.Admin = Depends(get_current_user), db: Session = Depends(database.get_db)):
    admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")
    return admin

@router.put("/admins/{admin_id}", response_model=schemas.AdminResponse)
def update_admin(admin_id: int, admin_update: schemas.AdminUpdate, current_user: models.Admin = Depends(get_current_user), db: Session = Depends(database.get_db)):
    admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")
    
    if admin_update.first_name is not None:
        admin.first_name = admin_update.first_name
    if admin_update.last_name is not None:
        admin.last_name = admin_update.last_name
    if admin_update.phone is not None:
        admin.phone = admin_update.phone
    
    db.commit()
    db.refresh(admin)
    return admin

@router.post("/admins/{admin_id}/password", response_model=schemas.AdminResponse)
def set_password(admin_id: int, password_data: schemas.AdminSetPassword, current_user: models.Admin = Depends(get_current_user), db: Session = Depends(database.get_db)):
    admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")
    
    admin.hashed_password = security.get_password_hash(password_data.password)
    db.commit()
    db.refresh(admin)
    return admin