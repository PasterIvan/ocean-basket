import axios, { AxiosResponseTransformer } from "axios";

export const hosts = [
  'https://oceanbasket.ru',      //0
  'https://oceanbasket-shuv.ru', //1
  'https://oceanbasket.kz',      //2
  'https://oceanbasket-msw.kz',  //3
  'https://oceanbasket-dp.kz',   //4
  'https://oceanbasket-laz.kz',  //5
];

export const prefixes = {
  ru: {
    0: "https://oceanbasket.ru/oceanBasket/public/",
    1: "https://oceanbasket-shuv.ru/oceanBasket/public/",
  },
  kz: {
    0: "https://oceanbasket.kz/oceanBasket/public/",
    1: "https://oceanbasket-msw.kz/oceanBasket/public/",
    2: "https://oceanbasket-dp.kz/oceanBasket/public/",
    3: "https://oceanbasket-laz.kz/oceanBasket/public/",
  },
} as const;

export const hostUrls = {
  [hosts[0]]: prefixes.ru[0],
  [hosts[1]]: prefixes.ru[1],
  [hosts[2]]: prefixes.kz[0],
  [hosts[3]]: prefixes.kz[1],  //Силк
  [hosts[4]]: prefixes.kz[2],  //Достык
  [hosts[5]]: prefixes.kz[3],  //Лазурка
} as const;

export const prefixToUrl = Object.fromEntries(
  Object.entries(hostUrls).map(([key, value]) => [value, key])
) as { [K in keyof typeof hostUrls as typeof hostUrls[K]]: K };

export const hostUrl: string =
  (hostUrls as any)[window.location.origin] || prefixes.kz[3];

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
