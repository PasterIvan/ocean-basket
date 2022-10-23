import {minSums} from "@entities/cart/components/cart-sidebar-view";
import {
    LOCATION_KZ_SUM,
    $addSums,
    freeSums,
    addSums,
} from "@entities/payment/components/Forms/PaymentProccessing";
import {prefixes} from "@shared/api/base";

export const deliveryCostConfig = {
    kz: {
        [prefixes.kz[1]]: (
            <ul>
                <li>
                    Доставка по городу в пределах зоны при заказе от{" "}
                    {(freeSums as any).kz[prefixes.kz[1]]} тенге — бесплатная.
                </li>
                <li>В пределах зоны доставки — {LOCATION_KZ_SUM.value} тенге.</li>
            </ul>
        ),
        [prefixes.kz[2]]: (
            <ul>
                <li>
                    Доставка по городу в пределах зоны при заказе от{" "}
                    {(freeSums as any).kz[prefixes.kz[2]]} тенге — бесплатная.
                </li>
                <li>В пределах зоны доставки — {LOCATION_KZ_SUM.value} тенге.</li>
            </ul>
        ),
        [prefixes.kz[3]]: (
            <ul>
                <li>
                    Доставка по городу в пределах зоны при заказе от{" "}
                    {(freeSums as any).kz[prefixes.kz[3]]} тенге — бесплатная.
                </li>
                <li>В пределах зоны доставки — {LOCATION_KZ_SUM.value} тенге.</li>
            </ul>
        ),
        default: (
            <ul>
                <li>
                    Доставка по городу в пределах зоны при заказе от{" "}
                    {(freeSums as any).kz[prefixes.kz[0]]} тенге — бесплатная.
                </li>
                <li>В пределах зоны доставки — {LOCATION_KZ_SUM.value} тенге.</li>
            </ul>
        ),
    },
    ru: {
        [prefixes.ru[1]]: (
            <ul>
                <li>
                    Доставка по городу в пределах МКАД при заказе от{" "}
                    {(freeSums as any).ru[prefixes.ru[1]]} р. — бесплатная.
                </li>
                <li>
                    {" "}
                    В пределах Третьего транспортного кольца —{" "}
                    {addSums[prefixes.ru[1]].trueSum} р.{" "}
                </li>
                <li> В пределах ЖК Шуваловский — бесплатная.</li>
            </ul>
        ),
        default: (
            <ul>
                <li>
                    Доставка по городу в пределах МКАД при заказе от{" "}
                    {freeSums.ru[prefixes.ru[0]]} р. — бесплатная.
                </li>
                <li>
                    {" "}
                    В пределах Третьего транспортного кольца —{" "}
                    {addSums[prefixes.ru[0]].trueSum} р.{" "}
                </li>
                <li> В пределах МКАД — {addSums[prefixes.ru[0]].falseSum} р.</li>
            </ul>
        ),
    },
};

export const takingOrdersConfig = {
    kz: {
        [prefixes.kz[1]]:
            "Прием заказов осуществляется с 10:00 до 22:30",
        [prefixes.kz[2]]:
            "Прием заказов осуществляется с 10:00 до 22:30",
        [prefixes.kz[3]]:
            "Прием заказов осуществляется: с понедельника по четверг с 10:00 до 22:30. с пятницы по воскресенье с 10:00 до 23:30",
        default: "Прием заказов осуществляется с 10:00 до 22:00",
    },
    ru: {
        default: "Прием заказов осуществляется во время работы ресторанов.",
    },
};

export const deliveryAreaConfig = {
    kz: {
        [prefixes.kz[1]]: "Доставка производится по всему городу Нур-Султан.",
        [prefixes.kz[2]]: "Доставка производится в г.Алматы в квадрате улиц: пр. Достык - пр. Аль-Фараби -  ул. Розыбакиева - ул. Толе би",
        [prefixes.kz[3]]: "Доставка производится по всему городу Нур-Султан.",

        default: "Доставка производится в г.Алматы в квадрате улиц: пр. Райымбека - ул. Калдаякова - ул. Сатпаева - ул. Ауэзова",
    },
    ru: {
        [prefixes.ru[1]]:
            "Мы доставляем по всей Москве в пределах МКАД. Заказы за МКАД принимаются по телефону ресторана.",
        default: "Мы доставляем по всей Москве.",
    },
};

export const minOrderPriceConfig = {
    kz: {
        default: `${minSums.kz[prefixes.kz[0]]} тенге*`,
        [prefixes.kz[1]]: `${minSums.kz[prefixes.kz[1]]} тенге*`,
        [prefixes.kz[2]]: `${minSums.kz[prefixes.kz[2]]} тенге*`,
        [prefixes.kz[3]]: `${minSums.kz[prefixes.kz[3]]} тенге*`,
    },
    ru: {
        default: `${minSums.ru[prefixes.ru[0]]} РУБ*`,
        [prefixes.ru[1]]: `${minSums.ru[prefixes.ru[1]]} РУБ*`,
    },
};

export const freeDeliveryConfig = {
    kz: {
        [prefixes.kz[1]]: `При заказе выше ${freeSums.kz[prefixes.kz[1]]} тенге.`,
        [prefixes.kz[2]]: `При заказе выше ${freeSums.kz[prefixes.kz[2]]} тенге.`,
        [prefixes.kz[3]]: `При заказе выше ${freeSums.kz[prefixes.kz[3]]} тенге.`,
        default: `При заказе выше ${freeSums.kz[prefixes.kz[0]]} тенге.`,
    },
    ru: {
        [prefixes.ru[1]]: `При заказе выше ${freeSums.ru[prefixes.ru[1]]} р.`,
        default: `При заказе выше ${freeSums.ru[prefixes.ru[0]]} руб.`,
    },
};

export const returnConditionsConfig = {
    kz: {
        default:
            "Условия возврата рассматриваются в индивидуальном порядке. Свяжитесь с нами по электронной почте  info@oceanbasket.kz, если у Вас есть какие-либо жалобы и предложения по поводу качества Продукта.",
    },
    ru: {
        default:
            "Eсли вас не устроила доставка, качество блюд, вы можете напрямую позвонить в ресторан по номеру +7 (977) 456 2221 (цифра 1), а также написать письмо на почту marketing@oceanbasket.ru. Мы оперативно ответим и решим проблему.",
        [prefixes.ru[1]]:
            "Eсли вас не устроила доставка, качество блюд, вы можете напрямую позвонить в ресторан по номеру +7 (495) 589 2266, а также написать письмо на почту info@oceanbasket.ru. Мы оперативно ответим и решим проблему.",
    },
};

export const legalAddressConfig = {
    kz: {
        [prefixes.kz[1]]: (
            'Республика Казахстан, город Нур-Султан, район Есиль, проспект Кабанбай батыра, здание 62,  почтовый индекс 010000'
        ),
        [prefixes.kz[2]]: (
            'Республика Казахстан, город Алматы, район Медеуский, микрорайон Самал-2, дом 111,  почтовый индекс 050000'
        ),
        [prefixes.kz[3]]: (
            'Республика Казахстан, город Нур-Султан, район Есиль, улица Сарайшык, дом 7,н.п. 24,  почтовый индекс 010000'
        ),
        default:
            "Казахстан, город Алматы, Алмалинский район, улица КАЗЫБЕК БИ, дом 50, почтовый индекс 050000",
    },
    ru: {
        [prefixes.ru[1]]: (
            <ul>
                <li>ООО «ОБ АВИАПАРК»</li>
                <li>125167, г. Москва, ул. Мичуринский проспект, 7</li>
                <li>ИНН 7706466163 ОГРН 1197746057200</li>
            </ul>
        ),
        default: (
            <ul>
                <li>ООО ОБ Мясницкая</li>
                <li>
                    101000, г. Москва, ул. Мясницкая, д.11, этаж 1, помещение V, комната 6
                </li>
                <li>ИНН 7708376250 ОГРН 1207700108219</li>
            </ul>
        ),
    },
};

export const gettingOrderConfig = {
    kz: {
        default: "Доставка осуществляется курьерскими службами.",
    },
    ru: {
        [prefixes.ru[1]]: "Доставка осуществляется курьерскими службами.",
        default: "Доставка осуществляется курьерскими службами.",
    },
};
