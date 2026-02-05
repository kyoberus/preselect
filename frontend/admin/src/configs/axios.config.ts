// import { cookies } from "next/headers"; // Removed for Universal compatibility
import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import {
    transformAxiosResponse,
    transformErrorResponse,
} from "@/helpers/axios.helper";
import {
    ACCESS_TOKEN,
    REFRESH_TOKEN,
    USER_INFO,
    AUTH_401,
    AUTH_403,
} from "@/constants/index";
import { onResponseRejectedType } from "@/@types/axios.type";
import { USER_TYPE } from "@/constants/index";
// import { redirect } from "next/navigation";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    multipart?: boolean;
}

const apiInstance = axios.create({
    baseURL: (typeof window === 'undefined' && process.env.API_URL)
        ? process.env.API_URL
        : (process.env.NEXT_PUBLIC_API || 'http://localhost:8000'),
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

const onRequestFulfilled = async (configs: CustomAxiosRequestConfig) => {
    let token: string | undefined;

    if (typeof window === 'undefined') {
        // Server-side
        try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            const tokenObj = cookieStore.get(ACCESS_TOKEN);
            if (tokenObj) {
                token = tokenObj.value;
            }
        } catch (error) {
            console.error("Error accessing cookies on server:", error);
        }
    } else {
        // Client-side
        const Cookies = (await import("js-cookie")).default;
        token = Cookies.get(ACCESS_TOKEN);
    }

    if (token && configs.headers) {
        configs.headers["Authorization"] = `Bearer ${token}`;
    }
    return configs;
};
const onResponseFulfilled = (response: AxiosResponse): Promise<any> => {
    return Promise.resolve(transformAxiosResponse(response));
};

const onResponseRejected = (error: AxiosError): Promise<any> => {
    return Promise.resolve(transformErrorResponse(error));
};

apiInstance.interceptors.request.use(onRequestFulfilled);
apiInstance.interceptors.response.use(onResponseFulfilled, onResponseRejected);
export { apiInstance };