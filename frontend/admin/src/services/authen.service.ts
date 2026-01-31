'use server';

import { cookies } from "next/headers";
import { loginBodyType } from "@/@types/request.type";
import { onResponseFullfillType } from "@/@types/axios.type";
import { loginAPI } from "@/app/api/auth.api";
import { ACCESS_TOKEN } from "@/constants";

export const loginService = async (
    loginDetails: loginBodyType,
): Promise<onResponseFullfillType> => {
    const cookieStore = await cookies();
    const { success, payload, status } = await loginAPI(loginDetails);
    if (success) {
        cookieStore.set(ACCESS_TOKEN, payload[ACCESS_TOKEN], {
            path: '/',
            httpOnly: false, // Set to true for security if JS doesn't need it (user code implies false previously)
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
        });
    }
    return { success, status };
};

export const logout = async () => {
    const cookieStore = await cookies();
    cookieStore.delete(ACCESS_TOKEN);
};