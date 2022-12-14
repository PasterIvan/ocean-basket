import { useMemo, useState } from "react";
import { ValidationError } from "./place-order-action";
import Button, { ButtonProps } from "@shared/button";
import { createGate, useGate, useStore } from "effector-react";
import {
  $cart,
  $cartSizes,
  $isRestaurantOpen,
  fetchTimeValidateFx,
  PickedDish,
} from "@features/choose-dishes/models";
import { $form } from "./address-form";
import { $schedule } from "./schedule-grid";
import { $phone } from "./add-or-update";
import { combine, createEffect, restore, sample } from "effector";
import {
  EMPTY_STRING,
  OrderTypeParams,
  PaymentArguments,
  postOrder,
  postPaymentArguments,
  PaymentArgumentsParams,
} from "@shared/api/common";
import {
  $minSum,
  $promocode,
} from "@entities/cart/components/cart-sidebar-view";
import { toast } from "react-toastify";
import { $restaurant } from "@widgets/header/components/AddressSelection";
import { $freeSum, $grandTotal, $location, $merchantLogin } from "./PaymentProccessing";
import { createEvent, createStore } from "effector";
import { formatPrice } from "@entities/cart/components/Details/variation-groups";
import { useNavigate } from "react-router-dom";
import { RoutesConfig } from "@shared/lib/routes-config";
import { $rus } from "@features/choose-dishes/models";
import { $isConfirmed, setAdressModalOpen } from "@widgets/address-modal";

type SubmitFormParams = {
  form: Omit<OrderTypeParams, "InvoiceID" | "Signature">;
  paymentArguments: PaymentArgumentsParams;
  newTab: Window | null;
};

const gateAction = createGate<{
  onSuccess: (
    params: Partial<PaymentArguments> & {
      order_id?: number | undefined;
    }
  ) => void;
  onFail: () => void;
}>();

const postDetailsFx = createEffect<PaymentArgumentsParams, PaymentArguments>(
  postPaymentArguments
);
const submitFormFx = createEffect<OrderTypeParams, { order_id?: number }>(
  postOrder
);
const submitError = (error: { error: Error }) => {
  console.error(error);
  toast.error("Ошибка при отправке заказа, попробуйте еще раз");
};
postDetailsFx.fail.watch(submitError);
submitFormFx.fail.watch(submitError);

const onSubmitForm = createEvent<SubmitFormParams>();
const $submitForm = restore(onSubmitForm, null);

sample({
  source: $submitForm,
  clock: onSubmitForm,
  fn: (props) => {
    const { paymentArguments } = props ?? {};
    return paymentArguments as PaymentArgumentsParams;
  },
  target: postDetailsFx,
});

const errorHandlerFx = createEffect((newtab?: Window | null) =>
  newtab?.close()
);

sample({
  source: $submitForm,
  clock: [postDetailsFx.fail, submitFormFx.fail],
  fn: (props) => {
    const { newTab } = props ?? {};
    return newTab;
  },
  target: errorHandlerFx,
});

const $paymentArguments = restore(postDetailsFx.doneData, null);

sample({
  source: [$submitForm, $paymentArguments],
  clock: postDetailsFx.done,
  fn: ([$0, $1]) => {
    const { form } = $0 ?? {};
    const { InvoiceId, SignatureValue } = $1 ?? {};
    return {
      ...form,
      InvoiceID: InvoiceId,
      Signature: SignatureValue,
    } as OrderTypeParams;
  },
  target: submitFormFx,
});

const $submitInfo = createStore<
  (Partial<PaymentArguments> & { order_id?: number }) | null
>(null)
  .on(postDetailsFx.doneData, (store, response) => ({
    ...store,
    ...response,
  }))
  .on(submitFormFx.doneData, (store, response) => ({
    ...store,
    order_id: response?.order_id,
  }));

const submitHandleFx = createEffect<
  [
    (
      | (Partial<PaymentArguments> & {
          order_id?: number | undefined;
        })
      | null
    ),
    SubmitFormParams | null,
    {
      onSuccess: (
        params: Partial<PaymentArguments> & {
          order_id?: number | undefined;
        },
        newTab?: Window | null
      ) => void;
    }
  ],
  void
>(([$0, form, { onSuccess }]) => {
  const { newTab } = form ?? {};
  if ($0) onSuccess($0, newTab);
});

sample({
  source: [$submitInfo, $submitForm, gateAction.state],
  clock: submitFormFx.done,
  target: submitHandleFx,
});

gateAction.state.on(submitFormFx.fail, ({ onFail }) => onFail());

const $pending = combine({
  submitFormPending: submitFormFx.pending,
  postDetailsPending: postDetailsFx.pending,
  timeFetchingPending: fetchTimeValidateFx.pending,
}).map((store) => Object.values(store).some((value) => value === true));

const formatDish = ({
  product,
  priceObj,
  modifiers,
  count,
}: PickedDish): OrderTypeParams["dishes"] => {
  const parsedWeight = parseInt(priceObj.weight);
  const parsedRoublePrice = parseInt(priceObj.rouble_price);
  const parsedTengePrice = parseInt(priceObj.tenge_price);

  const dish: OrderTypeParams["dishes"][number] = {
    name: product.name,
    weight: (isNaN(parsedWeight) ? EMPTY_STRING : parsedWeight) as number,
    rouble_price: (isNaN(parsedRoublePrice)
      ? EMPTY_STRING
      : parsedRoublePrice) as number,
    tenge_price: (isNaN(parsedTengePrice)
      ? EMPTY_STRING
      : parsedTengePrice) as number,
    modifiers: modifiers
      .filter(({ option }) => option)
      .map(({ option, name, price }) => ({
        key: name,
        value: option as string,
        amount: price as number,
      })),
    comment: product.comment,
  };

  return Array(count)
    .fill(dish)
    .map((obj) => ({ ...obj }));
};

export const CheckAvailabilityAction: React.FC<
  Omit<ButtonProps, "onSubmit"> & {
    onSubmit: (
      params: Partial<PaymentArguments> & {
        order_id?: number | undefined;
      },
      newTab?: Window | null
    ) => void;
  }
> = ({ onSubmit, ...props }) => {
  useGate(gateAction, { onSuccess: onSubmit, onFail: () => {} });

  const isConfirmed = useStore($isConfirmed);

  const navigate = useNavigate();

  const isRub = useStore($rus);
  const { size, totalAmount } = useStore($cartSizes);
  const cart = useStore($cart);
  const form = useStore($form);
  const schedule = useStore($schedule);
  const phone = useStore($phone);
  const promocode = useStore($promocode);
  const restaurant = useStore($restaurant);
  const location = useStore($location);
  const grandTotal = useStore($grandTotal);
  const isOpen = useStore($isRestaurantOpen);
  const minSum = useStore($minSum);
  const freeSum = useStore($freeSum);

  const isLoading = useStore($pending);
  const merchantLogin = useStore($merchantLogin);

  const [errorMessage, setError] = useState<string>();
  const [isShownError, setIsShownError] = useState<boolean>();
  const [isPrivacyPolicy, setIsPrivacyPolicy] = useState<boolean>(false);
  const [isInDeliveryKzZone, setIsInDeliveryKzZone] = useState<boolean>(false);

  const isValid = useMemo(() => {
    setIsShownError(false);

    if (isOpen === false) {
      setError("Ресторан закрыт до 10:00");
      return false;
    }

    if (!cart) {
      setError("Выберите блюда");
      return false;
    }

    if ((totalAmount ?? 0) < minSum) {
      setError(`Заказ должен быть на сумму от ${formatPrice(minSum, isRub)}`);
      return false;
    }

    if (!form) {
      setError("Необходимо заполнить адрес");
      return false;
    }

    if (isRub && (totalAmount ?? 0) < freeSum && location === null) {
      setError("Необходимо выбрать зону доставки");
      return false;
    }

    if (!phone) {
      setError("Необходимо ввести телефонный номер");
      return false;
    }

    if (!schedule) {
      setError("Необходимо выбрать время доставки");
      return false;
    }

    return true;
  }, [cart, form, schedule, phone, totalAmount, isOpen, location, isRub]);

  function handleVerifyCheckout() {
    if (!isValid) {
      setIsShownError(true);
      return;
    }
    if (isLoading) return;

    if (!isConfirmed) {
      setAdressModalOpen(true);
      return;
    }

    const newTab = window.open();

    const formattedDishes = cart.flatMap(formatDish);

    if ((window as any).isMock) {
      console.log("price mock enabled");
    }

    //@ts-ignore
    dataLayer?.push?.({
      event: "event-to-ga",
      eventCategory: "click",
      eventAction: "success_zakaz",
    });

    onSubmitForm({
      form: {
        ...form!,
        payment: "payment",
        restaurant: restaurant as string,
        time: schedule!.title,
        phone: `+${phone!}`,
        promocode: promocode?.promocode!,
        dishes: formattedDishes,
        MerchantLogin: merchantLogin,
        location: (totalAmount ?? 0) >= $freeSum.getState() ? null : location,
      },
      paymentArguments: {
        OutSum: (window as any).isMock ? 1 : grandTotal,
      },
      newTab,
    });
  }

  return (
    <div>
      <div className="px-5 lg:px-0">
        <span
          className="pr-2 cursor-pointer"
          onClick={() => setIsInDeliveryKzZone(!isInDeliveryKzZone)}
        >
          <input
            className="pointer-events-none"
            type="checkbox"
            checked={isInDeliveryKzZone}
          />
        </span>
        <span
          className="cursor-pointer"
          onClick={() => setIsInDeliveryKzZone(!isInDeliveryKzZone)}
        >
          Я нахожусь в{" "}
        </span>
        <a
          className="cursor-pointer underline hover:text-accent"
          onClick={() => {
            window.scrollTo(0, 0);
            navigate(RoutesConfig.Details);
          }}
        >
          зоне доставки
        </a>{" "}
        <span
          className="cursor-pointer"
          onClick={() => setIsInDeliveryKzZone(!isInDeliveryKzZone)}
        >
          ресторана
        </span>
      </div>
      <div className="px-5 pt-2 lg:px-0">
        <span
          className="pr-2 cursor-pointer"
          onClick={() => setIsPrivacyPolicy(!isPrivacyPolicy)}
        >
          <input
            className="pointer-events-none"
            type="checkbox"
            checked={isPrivacyPolicy}
          />
        </span>
        <span
          className="cursor-pointer"
          onClick={() => setIsPrivacyPolicy(!isPrivacyPolicy)}
        >
          Я принимаю условия{" "}
        </span>
        <a
          className="underline hover:text-accent"
          target="_blank"
          href={isRub ? "/privacy-polytic-rus.pdf" : "/privacy-polytic-kz.docx"}
        >
          пользовательского соглашения
        </a>{" "}
        <span
          className="cursor-pointer"
          onClick={() => setIsPrivacyPolicy(!isPrivacyPolicy)}
        >
          и даю согласие на{" "}
        </span>
        <a
          className="underline hover:text-accent cursor-pointer"
          target="_blank"
          href={
            isRub
              ? "/privacy-polytic-rus.pdf#page=5"
              : "/privacy-polytic-kz.docx#page=5"
          }
        >
          обработку персональных данных
        </a>
      </div>
      <Button
        loading={isLoading}
        className="text-body hover:bg-accent w-full mt-5"
        onClick={handleVerifyCheckout}
        disabled={!isInDeliveryKzZone || !isPrivacyPolicy || !size}
        {...props}
      />
      {isShownError && !isValid && (
        <div className="mt-3">
          <ValidationError message={errorMessage} />
        </div>
      )}
    </div>
  );
};
