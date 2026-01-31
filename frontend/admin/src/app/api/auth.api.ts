import { onResponseFullfillType, onResponseRejectedType } from "@/@types/axios.type";
import { loginBodyType } from "@/@types/request.type";
import { apiInstance } from "@/configs/axios.config";

const prefix = '/auth/login';

export const loginAPI = (body: loginBodyType): Promise<onResponseFullfillType> | Promise<onResponseRejectedType> => {
    return apiInstance.post(`${prefix}`, body);
}