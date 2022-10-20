import {onScrollPage} from "@shared/components/ScrollContainer";
import {formatPrice} from "@entities/cart/components/Details/variation-groups";
import {getFromStorage, setToStorage} from "@features/choose-dishes/api";
import {$cartSizes, $rus} from "@features/choose-dishes/models";
import {PaymentArguments} from "@shared/api/common";
import dayjs, {Dayjs} from "dayjs";
import {combine, createEvent, createStore, sample} from "effector";
import {useStore} from "effector-react";
import {useCallback, useState} from "react";
import {toast} from "react-toastify";
import {
    OrderDescriptionContainerCart
} from "../OrderDescription/OrderDescriptionContainerCart";
import {getPaymentLink} from "../OrderDescription/OrderDescriptionContainerFetch";
import AddOrUpdateCheckoutContact, {$phone} from "./add-or-update";
import AddressCard from "./address-card";
import AddressForm, {$form} from "./address-form";
import {BlocksGrid} from "./address-grid";
import {CheckAvailabilityAction} from "./check-availability-action";
import ContactCard from "./contact-card";
import Radio from "./forms/radio/radio";
import ScheduleGrid from "./schedule-grid";
import {RightSideView} from "./unverified-item-list";
import {getRestaurantFx} from "@widgets/address-modal";
import {$hostUrl} from "@shared/api/switchable";
import {hosts, prefixes} from "@shared/api/base";
import classNames from "classnames";
import {propsGetter} from "@pages/DetailsPage/lib";
import {addressFormMessage} from "@widgets/configAddressModal";

export const freeSums = {
    ru: {
        [prefixes.ru[0]]: 5000,
        [prefixes.ru[1]]: 4000,
    },
    kz: {
        [prefixes.kz[0]]: 15000,
        [prefixes.kz[1]]: 15000,
    },
};

export const $freeSum = createStore<number>(
    (freeSums as any)[$rus.getState() ? "ru" : "kz"]?.[
        ($hostUrl as any).getState() as any
        ] || 5000
);

sample({
    source: combine([$rus, $hostUrl]),
    clock: [$rus, $hostUrl],
    fn: ([rus, hostUrl]) => {
        return (freeSums as any)[rus ? "ru" : "kz"]?.[hostUrl] || 5000;
    },
    target: $freeSum,
});

export const makeTelegrammDescription = (
    size?: number,
    unicItemsNumber?: {
        [key: string]: number;
    }
) => {
    if (!size || !unicItemsNumber) {
        return null;
    }

    return `количество блюд - ${size}, количество уникальных блюд - ${
        Object.keys(unicItemsNumber).length
    }`;
    // return encodeURIComponent(
    //   dishes
    //     .map(
    //       ({ product: { name }, modifiers, count, totalPrice }) =>
    //         `${name}, ${modifiers.map(
    //           ({ name, option }) => `${name} ${option}`
    //         )} — ${count} шт, ${formatRub(totalPrice)}`
    //     )
    //     .join(";")
    // );
};

export const urlToMerchantLogins = {
    [hosts[0]]: "Ocean_Basket",
    [hosts[1]]: "OceanBasketShu",
    [hosts[2]]: "OceanBasketKZ",
    [hosts[3]]: "OceanBasket_mega",
};

const merchantLogins = {
    ru: {
        [prefixes.ru[0]]: "Ocean_Basket",
        [prefixes.ru[1]]: "OceanBasketShu",
    },
    kz: {
        [prefixes.kz[0]]: "OceanBasketKZ",
        [prefixes.kz[1]]: "OceanBasket_mega",
    },
};

export const $merchantLogin = createStore(
    urlToMerchantLogins[window.location.origin] || urlToMerchantLogins[hosts[0]]
).on(combine([$rus, $hostUrl]), (_, [rus, hostUrl]) => {
    return (
        (merchantLogins as any)[rus ? "ru" : "kz"]?.[hostUrl] || "Ocean_Basket"
    );
});

export enum AddressType {
    Billing = "billing",
    Shipping = "shipping",
}

export const LOCATION_KZ_SUM = {value: 2000};

export const addSums = {
    [prefixes.ru[0]]: {
        falseSum: 500,
        trueSum: 250,
    },
    [prefixes.ru[1]]: {
        falseSum: 0,
        trueSum: 350,
    },
    [prefixes.kz[0]]: {
        falseSum: 2000,
        trueSum: 1000,
    },
    [prefixes.kz[1]]: {
        falseSum: 2000,
        trueSum: 2000,
    },
};

export const $addSums = createStore<{ falseSum: number; trueSum: number }>(
    (addSums as any)[($hostUrl as any).getState() as any] || {
        falseSum: 500,
        trueSum: 250,
    }
);

$addSums.on($hostUrl, (_, payload) => {
    return (addSums as any)[payload];
});

export const onLocation = createEvent<boolean>();
export const $location = createStore<boolean | null>(
    getFromStorage("location", false)
)
    .on(onLocation, (_, value) => value)
    .on($hostUrl, (location, prefix) => {
        if (prefix === prefixes.ru[1] && location === null) {
            return true;
        }
    });

$location.watch((value) => setToStorage("location", value));

export const getDeliveryFee = (locationInitial: boolean | null): number => {
    return locationInitial === true
        ? $addSums.getState().trueSum
        : locationInitial === false
            ? $addSums.getState().falseSum
            : 0;
};
export const getDeliveryFeeName = (
    totalAmount: number | null,
    isRub: boolean,
    location?: boolean | null
): string => {
    return (totalAmount ?? 0) >= $freeSum.getState()
        ? "Бесплатно"
        : !isRub
            ? formatPrice(LOCATION_KZ_SUM.value, isRub)
            : location === true
                ? formatPrice($addSums.getState().trueSum, isRub)
                : location === false
                    ? formatPrice($addSums.getState().falseSum, isRub)
                    : "";
};

const locationInitial = $location.getState();
const deliveryInitial = getDeliveryFee(locationInitial);

export const $grandTotal = createStore<number>(
    ($cartSizes.getState().totalAmount ?? 0) + deliveryInitial
);

sample({
    source: combine([$cartSizes, $location, $rus, $freeSum]),
    clock: [$cartSizes, $location, $rus, $freeSum],
    fn: ([cartSizes, location, isRus, freeSum]) => {
        const totalAmount = cartSizes?.totalAmount ?? 0;

        if (totalAmount >= (freeSum || 0)) {
            return totalAmount;
        }

        const locationFee = !isRus
            ? LOCATION_KZ_SUM.value
            : location === true
                ? $addSums.getState().trueSum
                : location === false
                    ? $addSums.getState().falseSum
                    : 0;

        return totalAmount + locationFee;
    },
    target: $grandTotal,
});

const textes = {
    [prefixes.ru[0]]: [
        `Указанный адрес входит в зону доставки ВНУТРИ ТТК + ${formatPrice(
            addSums[prefixes.ru[0]].trueSum,
            true
        )}.`,
        `Указанный адрес входит в зону доставки от МКАД до ТТК + ${formatPrice(
            addSums[prefixes.ru[0]].falseSum,
            true
        )}.`,
    ],
    [prefixes.ru[1]]: [
        `Заказ ниже ${freeSums.ru[prefixes.ru[1]]} р. — + ${formatPrice(
            addSums[prefixes.ru[1]].trueSum,
            true
        )}.`,
        `“Я живу в ЖК Шуваловский” — бесплатная доставка.`,
    ],
};

export function PaymentProccessing() {
    const cartSizes = useStore($cartSizes);
    const isRus = useStore($rus);
    const isLoading = useStore(getRestaurantFx.pending);

    const [isOrdered, setIsOrdered] = useState(false);
    const [orderNumber, setOrderNumber] = useState<undefined | number>(undefined);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
    const [orderDate, setOrderDate] = useState<Dayjs | null>(null);

    const hostUrl = useStore($hostUrl);
    const freeSum = useStore($freeSum);
    const form = useStore($form);
    const phone = useStore($phone);
    const location = useStore($location);
    const {totalAmount} = useStore($cartSizes);
    const merchantLogin = useStore($merchantLogin);

    const prefix = useStore($hostUrl);
    const text = propsGetter(addressFormMessage, isRus, prefix)?.toString()

    const isRightMode = false;

    const onSubmitHandler = useCallback(
        (
            {
                InvoiceId,
                OutSum,
                SignatureValue,
                order_id,
            }: Partial<PaymentArguments> & {
                order_id?: number | undefined;
            },
            newTab?: Window | null
        ) => {
            const url = getPaymentLink(
                merchantLogin,
                `${OutSum}`,
                `${InvoiceId}`,
                SignatureValue,
                makeTelegrammDescription(cartSizes.size, cartSizes.unicItemsNumber),
                order_id
            );

            if (newTab && !newTab.closed) {
                newTab.location.replace(url);
                newTab.focus();
            } else {
                console.log("cant open new tab");
                newTab?.close();

                try {
                    window.location.replace(url);
                } catch (e) {
                    console.error(e);
                    toast.error("Ошибка при совершении оплаты, попробуйте еще раз");
                }
                return;
            }

            setOrderNumber(order_id);
            setOrderDate(dayjs());
            setIsOrdered(true);
            onScrollPage();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [merchantLogin]
    );

    const showOptions = isRus && (totalAmount ?? 0) < freeSum;

    return !isOrdered ? (
        <>
            <div
                className="py-8 sm:px-4 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20 bg-gray-100">
                <div
                    className="flex flex-col lg:flex-row items-center lg:items-start m-auto w-full max-w-6xl">
                    <div className="lg:max-w-2xl w-full space-y-6 order-1 lg:order-0">
                        <BlocksGrid
                            addLabel="Добавить адрес"
                            editLabel="Изменить адрес"
                            className="shadow-700 bg-light p-5 md:p-8"
                            label="Адрес доставки"
                            subLabel={text}
                            //     isRub
                            //         ? "Мы доставляем наши блюда по всей Москве в пределах МКАД. Если ваш адрес доставки находится за пределами МКАД, ресторан оформит возврат денежных средств и отменит заказ. Заказы за МКАД оформляются по номеру телефона в индивидуальном порядке. Благодарим за понимание."
                            //         : "Мы доставляем наши блюда в пределах зоны: пр. Райымбека - ул. Калдаякова - ул. Сатпаева - ул. Ауезова. Если ваш адрес доставки находится вне зоны, ресторан оформит возврат денежных средств и отменит заказ. Заказы вне зоны оформляются по номеру телефона в индивидуальном порядке. Благодарим за понимание."
                            // }
                            count={1}
                            form={AddressForm}
                            data={form}
                            card={AddressCard}
                            isModalOpen={isAddressModalOpen}
                            onEdit={() => setIsAddressModalOpen(true)}
                            isLoading={isLoading}
                            onSubmit={(coords) => {
                                if (isLoading) return;
                                if (
                                    typeof coords[0] !== "number" ||
                                    typeof coords[1] !== "number"
                                ) {
                                    toast.error("Адрес заполнен неккоректно");
                                    return;
                                }

                                setIsAddressModalOpen(false);

                                getRestaurantFx({
                                    latitude: coords[0]!.toString(),
                                    longtitude: coords[1]!.toString(),
                                });
                            }}
                            emptyMessage="Адрес не заполнен"
                            after={
                                !showOptions ? undefined : (
                                    <div className="flex gap-3 flex-wrap">
                                        <div className="w-[16rem] text-xs flex">
                                            {!isRightMode && (
                                                <Radio
                                                    checked={location === true}
                                                    onClick={() => onLocation(true)}
                                                    className="pt-2"
                                                    isBig
                                                    name={"inside TTK"}
                                                    id={"inside TTK"}
                                                />
                                            )}
                                            <div
                                                className={classNames(
                                                    isRightMode && "text-center",
                                                    "cursor-pointer select-none flex items-center"
                                                )}
                                                onClick={() => onLocation(true)}
                                            >
                                                {(textes as any)[hostUrl]?.[0]}
                                            </div>
                                        </div>
                                        <div className="w-[16rem] text-xs flex">
                                            <Radio
                                                checked={location === false}
                                                onClick={() => {
                                                    if (isRightMode) {
                                                        onLocation(!location);
                                                        return;
                                                    }
                                                    onLocation(false);
                                                }}
                                                className="pt-2"
                                                isBig
                                                name={"outside TTK"}
                                                id={"outside TTK"}
                                            />
                                            <div
                                                className="cursor-pointer select-none flex items-center"
                                                onClick={() => {
                                                    if (isRightMode) {
                                                        onLocation(!location);
                                                        return;
                                                    }

                                                    onLocation(false);
                                                }}
                                            >
                                                {(textes as any)[hostUrl]?.[1]}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        />
                        <ScheduleGrid
                            className="shadow-700 bg-light p-5 md:p-8"
                            label="Время доставки"
                            count={2}
                        />
                        <BlocksGrid
                            addLabel="Добавить телефон"
                            editLabel="Изменить телефон"
                            className="shadow-700 bg-light p-5 md:p-8"
                            count={3}
                            label="Контактный телефон"
                            card={ContactCard}
                            form={AddOrUpdateCheckoutContact}
                            data={phone}
                            isModalOpen={isPhoneModalOpen}
                            onEdit={() => setIsPhoneModalOpen(true)}
                            onSubmit={() => setIsPhoneModalOpen(false)}
                            emptyMessage="Телефон не заполнен"
                        />
                        <CheckAvailabilityAction onSubmit={onSubmitHandler}>
                            Оформить заказ
                        </CheckAvailabilityAction>
                    </div>
                    <div
                        className="mb-10 sm:mb-12 lg:mb-0 lg:mt-10 lg:ml-16 order-0 lg:order-1 px-5 sm:px-0 max-w-full min-w-full md:min-w-[450px]">
                        <RightSideView/>
                    </div>
                </div>
            </div>
        </>
    ) : (
        <OrderDescriptionContainerCart
            orderNumber={orderNumber}
            orderDate={orderDate}
        />
    );
}
