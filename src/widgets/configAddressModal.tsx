import {prefixes} from "@shared/api/base";

export const addressFormMessage = {
    kz: {[prefixes.kz[1]]: (
            'Мы доставляем наши блюда по всему городу Нур-Султан. Если ваш адрес доставки находится вне зоны, ресторан оформит возврат денежных средств и отменит заказ. Заказы вне зоны оформляются по номеру телефона в индивидуальном порядке. Благодарим за понимание.'
        ),
        [prefixes.kz[2]]: (
            'Доставка производится в г.Алматы в квадрате улиц: пр. Достык - пр. Аль-Фараби -  ул. Розыбакиева - ул. Толе би'
        ),
        [prefixes.kz[3]]: (
            'Мы доставляем наши блюда по всему городу Нур-Султан.'
        ),
        default: (
           'Мы доставляем наши блюда в пределах зоны: пр. Райымбека - ул. Калдаякова - ул. Сатпаева - ул. Ауезова. Если ваш адрес доставки находится вне зоны, ресторан оформит возврат денежных средств и отменит заказ. Заказы вне зоны оформляются по номеру телефона в индивидуальном порядке. Благодарим за понимание.'
        ),
    },
    ru: {
        default: (
           'Мы доставляем наши блюда по всей Москве в пределах МКАД. Если ваш адрес доставки находится за пределами МКАД, ресторан оформит возврат денежных средств и отменит заказ. Заказы за МКАД оформляются по номеру телефона в индивидуальном порядке. Благодарим за понимание.'
        ),
    },
};

