export type onResponseFullfillType = {
    payload?: any;
    success: boolean;
    status?: number;
}

export type onResponseRejectedType = {
    payload?: any;
    success: boolean;
    status: number | undefined;
}

export type responseResolveType = {
    data: any;
}