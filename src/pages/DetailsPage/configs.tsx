import { minSums } from "@entities/cart/components/cart-sidebar-view";
import {
  LOCATION_KZ_SUM,
  $addSums,
  freeSums,
  addSums,
} from "@entities/payment/components/Forms/PaymentProccessing";
import { prefixes } from "@shared/api/base";

export const deliveryCostConfig = {
  kz: {
    default: (
      <ul>
        <li>
          Доставка по городу в пределах зоны при заказе от{" "}
          {freeSums.kz[prefixes.kz[0]]} тенге — бесплатная.
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
          {freeSums.ru[prefixes.ru[1]]} р. — бесплатная.
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
    default: "Прием заказов осуществляется с 10:00 до 22:00",
  },
  ru: {
    default: "Прием заказов осуществляется во время работы ресторанов.",
  },
};

export const deliveryAreaConfig = {
  kz: {
    default: (
      <ul>
        <li>Доставка производится в г.Алматы в квадрате улиц:</li>
        <li>пр. Райымбека - ул. Калдаякова - ул. Сатпаева - ул. Ауэзова</li>
      </ul>
    ),
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
  },
  ru: {
    default: `${minSums.ru[prefixes.ru[0]]} РУБ*`,
    [prefixes.ru[1]]: `${minSums.ru[prefixes.ru[0]]} РУБ*`,
  },
};

export const freeDeliveryConfig = {
  kz: {
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
