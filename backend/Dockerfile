# ใช้ Python Image พื้นฐาน
FROM python:3.10-slim

# ตั้งค่า Working Directory
WORKDIR /app

# ป้องกัน Python เขียนไฟล์ .pyc และให้แสดง log ทันที
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# ติดตั้ง Dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# คัดลอกโค้ดทั้งหมดเข้า Container
COPY . .

# ติดตั้งเครื่องมือสำหรับตรวจสอบว่า Postgres พร้อมรับการเชื่อมต่อ
RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# รอให้ฐานข้อมูลพร้อม แล้วรัน Uvicorn
CMD ["sh", "-c", "until pg_isready -h ${DB_HOST:-localhost} -p 5432 -U ${DB_USER:-postgres}; do echo waiting for db; sleep 1; done; uvicorn app.main:app --host 0.0.0.0 --port 8000"]