import axios, { AxiosResponseTransformer } from "axios";

export const prefixes = {
  kz: {
    0: "https://oceanbasket.kz/oceanBasket/public",
  },
  ru: {
    0: "https://oceanbasket.ru/oceanBasket/public",
    1: "https://oceanbasket-shuv.ru/public",
  },
};

export const hostUrls = {
  "https://oceanbasket.kz/": prefixes.kz[0],
  "https://oceanbasket.ru/": prefixes.ru[0],
  "https://oceanbasket-shuv.ru/": prefixes.ru[1],
};

export const prefixToUrl = {
  [prefixes.kz[0]]: "https://oceanbasket.kz/",
  [prefixes.ru[0]]: "https://oceanbasket.ru/",
  [prefixes.ru[1]]: "https://oceanbasket-shuv.ru/",
};

export const hostUrl =
  (hostUrls as any)[window.location.href] || prefixes.ru[0];

export const transformResponse: AxiosResponseTransformer[] = [
  (data) => {
    const {
      data: responseData,
      message,
      status,
    } = JSON.parse(data) as ResponseType;

    if (status < 200 || status >= 300) {
      throw new Error(message!);
    }

    return responseData;
  },
];

export type ResponseType = {
  status: number;
  data: unknown;
  message?: string;
};
export const baseApi = axios.create({
  baseURL: hostUrl,
  transformResponse: transformResponse,
});
