export declare const apiRequest: ({ data, method, route, params, headers, }: {
    data: any;
    method: "GET" | "POST" | "PUT" | "DELETE";
    route: string;
    params?: any;
    headers?: any;
}) => Promise<import("axios").AxiosResponse<any, any>>;
