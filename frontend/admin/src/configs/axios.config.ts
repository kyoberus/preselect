import { cookies } from "next/headers";
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
import { redirect } from "next/navigation";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    multipart?: boolean;
}

const apiInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API || process.env.API_URL || 'http://localhost:8000',
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

const onRequestFulfilled = async (configs: CustomAxiosRequestConfig) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_TOKEN);
    if (token && configs.headers) {
        configs.headers["Authorization"] = `Bearer ${token["value"]}`;
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