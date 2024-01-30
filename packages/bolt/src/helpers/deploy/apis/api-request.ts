import { getStoreData } from "../../get-store-data";
import axios from "axios";
import { BOX_SERVER_URL } from "../../../config";

export const apiRequest = async ({
  data,
  method,
  route,
  params,
  headers,
}: {
  data: any;
  method: "GET" | "POST" | "PUT" | "DELETE";
  route: string;
  params?: any;
  headers?: any;
}) => {
  const accessKey: string = await getStoreData("access_key");
  const secretKey: string = await getStoreData("secret_key");

  const requestHeaders = {
    ["Access-Key"]: accessKey,
    ["Secret-Key"]: secretKey,
    ...headers,
  };

  params = params ? getParamString(params) : "";

  const config: any = {
    method: method,
    url: `${BOX_SERVER_URL}/deployment${route}${params}`,
    headers: requestHeaders,
    data: data,
  };

  return await axios.request(config);
};

const getParamString = (params: any) => {
  let paramString = "?";
  for (const [key, value] of Object.entries(params)) {
    paramString += `${key}=${value}&`;
  }
  return paramString;
};
