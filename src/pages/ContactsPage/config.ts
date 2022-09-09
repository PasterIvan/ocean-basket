import {hosts, prefixes} from "@shared/api/base";

export type Address = {
    prefix: string;
    address: string;
    number: string;
    gps: number[];
    email?: string;
    url?: string;
};

export type Region = {
    region_label: string | null;
    region: string;
    addresses: Address[];
};

export type Country = {
    country_label: string | null;
    regions: Region[];
    defaultEmail: string;
};

export const addresses: Country[] = [
        {
            country_label: "Россия",
            regions: [
                {
                    region_label: "Москва",
                    region: "Москва",
                    addresses: [
                        {
                            url: hosts[0],
                            prefix: prefixes.ru[0],
                            address: "ул. Мясницкая, д. 11, м. Лубянка",
                            number: "+7 (977) 456 2221",
                            gps: [55.761677, 37.632745],
                            email: "marketing@oceanbasket.ru",
                        },
                        {
                            url: hosts[1],
                            prefix: prefixes.ru[1],
                            address:
                                "Мичуринский проспект, д. 7, м. Ломоносовский проспект / м. Раменки",
                            number: "+7 (495) 589 2266",
                            gps: [55.70255756078396, 37.50947297004879],
                            email: "info@oceanbasket.ru",
                        },
                    ],
                },
            ],
            defaultEmail: "marketing@oceanbasket.ru",
        },
        {
            country_label: "Казахстан",
            regions: [
                {
                    region_label: "Алматы",
                    region: "Алматы",
                    addresses: [
                        {
                            url: hosts[2],
                            prefix: prefixes.kz[0],
                            address:
                                "Алмалинский район, ул. Казыбек би, дом 50, почтовый индекс 050000",
                            number: "+7 (705) 449 7744",
                            gps: [43.256069, 76.945169],
                        },

                        // {
                        //   address: "мкр. Самал-2, 111, ТРЦ Dostyk Plaza, 3-й этаж",
                        //   number: "+8 (777) 246 6878",
                        //   gps: [43.23388, 76.957239],
                        // },
                        // {
                        //   address:
                        //     "ул. Розыбакиева 247А, ТРЦ Mega Center, 3-й этаж, Галерея ресторанов",
                        //   number: "+8 (777) 240 1122",
                        //   gps: [43.202449, 76.89197],
                        // },
                    ],
                },
                {
                    region_label: "Нур-Султан",
                    region: "Нур-Султан",
                    addresses:
                        [
                            {
                                url: hosts[3],
                                prefix: prefixes.kz[1],
                                address: " ул.проспект Кабанбай Батыра, дом 62, ТРЦ “Mega Silk Way”",
                                number: "+7 (700) 777 96 97",
                                gps: [51.08921, 71.40666],
                            },

                            //     {
                            //       address: "ул. Сарайшык 7",
                            //       number: "+8 (777) 888 9221",
                            //       gps: [51.135321, 71.42623],
                            //     },
                            //     {
                            //       address: "MEGA Silk Way, просп. Кабанбай Батыра, 62",
                            //       number: "+8 (700) 777 9697",
                            //       gps: [51.08921, 71.40666],
                            //     },
                        ],
                },
            ],
            defaultEmail: "info@oceanbasket.kz",
        },
    ]
;
