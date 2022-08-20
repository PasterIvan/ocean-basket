import axios, { AxiosResponseTransformer } from "axios";

export const prefixes = {
  kz: {
    0: "https://oceanbasket.kz/",
  },
  ru: {
    0: "https://oceanbasket.ru/",
    1: "https://oceanbasket-shuv.ru/",
  },
} as const;

export const hostUrls = {
  "https://oceanbasket.kz": prefixes.kz[0],
  "https://oceanbasket.ru": prefixes.ru[0],
  "https://oceanbasket-shuv.ru": prefixes.ru[1],
} as const;

export const prefixToUrl = Object.fromEntries(
  Object.entries(hostUrls).map(([key, value]) => [value, key])
) as { [K in keyof typeof hostUrls as typeof hostUrls[K]]: K };
export const hostUrl =
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
