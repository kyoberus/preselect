import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# อ่านค่าจาก Environment
USER = os.getenv("DB_USER", "postgres")
PASSWORD = os.getenv("DB_PASSWORD", "password")
HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "preselect_db")

SQLALCHEMY_DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency สำหรับใช้ใน Router
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()