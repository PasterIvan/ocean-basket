import axios, { AxiosResponseTransformer } from "axios";

export const hosts = [
  'https://oceanbasket.ru',
  'https://oceanbasket-shuv.ru',
  'https://oceanbasket.kz',
  'https://oceanbasket-msw.kz',
];

export const prefixes = {
  ru: {
    0: "https://oceanbasket.ru/oceanBasket/public/",
    1: "https://oceanbasket-shuv.ru/oceanBasket/public/",
  },
  kz: {
    0: "https://oceanbasket.kz/oceanBasket/public/",
    1: "https://oceanbasket-msw.kz/oceanBasket/public/",
  },
} as const;

export const hostUrls = {
  [hosts[0]]: prefixes.ru[0],
  [hosts[1]]: prefixes.ru[1],
  [hosts[2]]: prefixes.kz[0],
  [hosts[3]]: prefixes.kz[1],
} as const;

export const prefixToUrl = Object.fromEntries(
  Object.entries(hostUrls).map(([key, value]) => [value, key])
) as { [K in keyof typeof hostUrls as typeof hostUrls[K]]: K };

export const hostUrl: string =
  (hostUrls as any)[window.location.origin] || prefixes.kz[1];

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
