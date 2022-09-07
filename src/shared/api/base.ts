import axios, { AxiosResponseTransformer } from "axios";

export const hosts = [
  'https://oceanbasket.kz',
  'https://oceanbasket.ru',
  'https://oceanbasket-shuv.ru',
];

export const prefixes = {
  kz: {
    0: "https://oceanbasket.kz/oceanBasket/public/",
  },
  ru: {
    0: "https://oceanbasket.ru/oceanBasket/public/",
    1: "https://oceanbasket-shuv.ru/oceanBasket/public/",
  },
} as const;

export const hostUrls = {
  [hosts[0]]: prefixes.kz[0],
  [hosts[1]]: prefixes.ru[0],
  [hosts[2]]: prefixes.ru[1],
} as const;

export const prefixToUrl = Object.fromEntries(
  Object.entries(hostUrls).map(([key, value]) => [value, key])
) as { [K in keyof typeof hostUrls as typeof hostUrls[K]]: K };

export const hostUrl: string =
  (hostUrls as any)[window.location.origin] || prefixes.ru[0];

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
