import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function POST(request: Request) {
  try {
    // 1. รับข้อมูลจากหน้าบ้าน (Frontend)
    const body = await request.json();
    const { username, password } = body;

    // 2. ดึง URL Backend
    // เช็ค .env.local ดีๆ ว่า API_URL คือ http://localhost:8000 หรือ host.docker.internal
    const backendUrl = "http://localhost:8000"; 

    // 3. ยิงไปหา Backend ด้วย Axios
    // ตรงกับ Curl: -H 'Content-Type: application/json' -d '{ "email": "...", "password": "..." }'
    const response = await axios.post(
      `${backendUrl}/auth/login`,
      {
        email: username, // **สำคัญ: Map จาก 'username' ของหน้าเว็บ เป็น 'email' ตามที่ Backend ต้องการ**
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    console.log("Backend Response:", response.data);

    // 4. ส่งผลลัพธ์กลับไปให้หน้าบ้าน (กรณี Success 200)
    return NextResponse.json(response.data, { status: 200 });

  } catch (error: any) {
    // 5. จัดการ Error ของ Axios
    if (axios.isAxiosError(error)) {
      console.error("Backend Error:", error.response?.data);
      
      // ส่ง Status Code และ Error Message จาก Backend กลับไป
      return NextResponse.json(
        error.response?.data || { message: 'Backend login failed' },
        { status: error.response?.status || 500 }
      );
    }

    console.error("Server Error:", error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}