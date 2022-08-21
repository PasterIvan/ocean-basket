import AddressForm, {
  $coords,
  $form,
  inputOnlyFormKeys,
  onCoordsChange,
  onSubmitForm,
} from "@entities/payment/components/Forms/address-form";
import Modal from "@entities/payment/components/Forms/modal";
import { getRestaurant } from "@shared/api/common";
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  restore,
  sample,
} from "effector";
import { useStore } from "effector-react";
import { toast } from "react-toastify";
import { getIsKz } from "@shared/lib/functional-utils";
import { onChangeHostUrl } from "@shared/api/switchable";
import { $rus } from "@features/choose-dishes/models";
import { onSetRestaurant } from "./header/components/AddressSelection";
import { prefixToUrl } from "@shared/api/base";
import { useEffect, useState } from "react";
import { RoutesConfig } from "@shared/lib/routes-config";
import { useNavigate } from "react-router-dom";

const onConfirm = createEvent();

export const $isConfirmed = createStore(getIsKz()).on(onConfirm, () => true);

export const getRestaurantFx = createEffect(getRestaurant);

getRestaurantFx.failData.watch(() => {
  toast.error("Ошибка при отправке адреса");
});

sample({
  source: combine([restore(getRestaurantFx.doneData, null), $coords, $form]),
  clock: getRestaurantFx.done,
}).watch(([data, coords, form]) => {
  if (typeof data?.prefix === "string") {
    onChangeHostUrl(data?.prefix);

    if (
      data?.prefix &&
      (prefixToUrl as any)[data?.prefix] &&
      window.location.origin !== (prefixToUrl as any)[data?.prefix] &&
      !(prefixToUrl as any)[data?.prefix].startsWith(window.location.origin)
    ) {
      const href = new URL((prefixToUrl as any)[data?.prefix]);
      href.pathname = RoutesConfig.Menu;
      href.searchParams.set("gps", JSON.stringify(coords));

      form &&
        inputOnlyFormKeys.forEach((key) => {
          href.searchParams.set(key, form[key]?.toString() || "");
        });

      // window.location.replace(href);

      return;
    }

    onConfirm();
  }

  if (typeof data?.restaurant === "string") {
    onSetRestaurant(data.restaurant);
  }
});

export const setAdressModalOpen = createEvent<boolean>();

export const $isAdressModalOpen = createStore(false).on(
  setAdressModalOpen,
  (_, payload) => payload
);

onConfirm.watch(() => {
  setAdressModalOpen(false);
});

export const isGpsValid = (gps: any) => {
  return (
    Array.isArray(gps) &&
    gps.length === 2 &&
    gps.every((coord) => typeof coord === "number" || coord === null)
  );
};

export const AddressModal = () => {
  const navigate = useNavigate();

  const [initCoords, setInitCoords] =
    useState<[number | null, number | null]>();
  const isRus = useStore($rus);

  const isOpen = useStore($isAdressModalOpen);
  const isLoading = useStore(getRestaurantFx.pending);

  const onSubmitHandler = (coords: (number | null)[]) => {
    if (isLoading) return;
    if (typeof coords[0] !== "number" || typeof coords[1] !== "number") {
      toast.error("Адрес заполнен неккоректно");
      return;
    }

    getRestaurantFx({
      latitude: coords[0]!.toString(),
      longtitude: coords[1]!.toString(),
    });
  };

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);

    if (search.has("gps")) {
      try {
        const gps = JSON.parse(search.get("gps") as string);

        if (!isGpsValid(gps)) {
          return;
        }

        onCoordsChange(gps);
        setInitCoords(gps);
      } catch {}
    }
  }, []);

  return (
    <Modal
      ignoreAniation
      showClose={false}
      open={isOpen}
      onClose={() => void 0}
    >
      <AddressForm
        initialCoords={initCoords}
        subLabel={
          isRus
            ? "Мы доставляем наши блюда по всей Москве в пределах МКАД. Если ваш адрес доставки находится за пределами МКАД, ресторан оформит возврат денежных средств и отменит заказ. Заказы за МКАД оформляются по номеру телефона в индивидуальном порядке. Благодарим за понимание."
            : "Мы доставляем наши блюда в пределах зоны: пр. Райымбека - ул. Калдаякова - ул. Сатпаева - ул. Ауезова. Если ваш адрес доставки находится вне зоны, ресторан оформит возврат денежных средств и отменит заказ. Заказы вне зоны оформляются по номеру телефона в индивидуальном порядке. Благодарим за понимание."
        }
        isLoading={isLoading}
        switchIconEnabled={false}
        onSubmit={onSubmitHandler}
        onAdressChange={(coords, form) => {
          if (!initCoords) {
            return;
          }

          if (coords[0] !== initCoords[0] || coords[1] !== initCoords[1]) {
            return;
          }

          const targetForm = { ...form };

          const search = new URLSearchParams(window.location.search);
          if (search.has("gps")) {
            search.delete("gps");
          }
          inputOnlyFormKeys.forEach((key) => {
            if (search.has(key)) {
              (targetForm as any)[key] = search.get(key) as string;
              search.delete(key);
            }
          });

          onSubmitForm(targetForm);
          onCoordsChange(coords as [number | null, number | null]);

          navigate(`${window.location.pathname}?${search.toString()}`, {
            replace: true,
          });

          onSubmitHandler(coords);
        }}
      />
    </Modal>
  );
};
