import { onResponseFullfillType, onResponseRejectedType } from "@/@types/axios.type";
import { AxiosError, AxiosResponse } from "axios";

export const transformAxiosResponse = (response: AxiosResponse): onResponseFullfillType => {
    const { data: payload } = response;
    return {
        payload,
        status: response ? response.status : undefined,
        success: true
    };
};

export const transformErrorResponse = (errResponse: AxiosError): onResponseRejectedType => {
    if (!errResponse) {
        return {
            payload: undefined,
            status: undefined,
            success: false
        };
    }

    const { response } = errResponse;
    let payload;
    payload = response ? response.data : undefined;
    return {
        payload,
        status: response ? response.status : undefined,
        success: false
    };
};