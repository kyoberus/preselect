import { apiInstance } from "../configs/axios.config";
import { Admin } from "../@types/admin.type";
import { onResponseFullfillType } from "../@types/axios.type";

export const getAdmins = async (): Promise<Admin[]> => {
    const response = await apiInstance.get("/admins") as unknown as onResponseFullfillType;
    return response.payload;
};

export const updateAdmin = async (id: number, data: Partial<Admin>): Promise<Admin> => {
    const response = await apiInstance.put(`/admins/${id}`, data) as unknown as onResponseFullfillType;
    return response.payload;
};

export const setPassword = async (id: number, password: string): Promise<void> => {
    await apiInstance.post(`/admins/${id}/password`, { password }) as unknown as onResponseFullfillType;
};

export const createAdmin = async (data: Omit<Admin, 'id' | 'date_created' | 'date_updated'> & { password: string }): Promise<Admin> => {
    const response = await apiInstance.post("/admins", data) as unknown as onResponseFullfillType;
    return response.payload;
};

