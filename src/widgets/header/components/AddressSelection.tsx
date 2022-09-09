import { addresses } from "@pages/ContactsPage/config";
import { $rus } from "@features/choose-dishes/models";
import classNames from "classnames";
import { createEvent, createStore } from "effector";
import { useStore } from "effector-react";
import { useEffect, useMemo } from "react";

import gpsIcon from "./gps.svg";

import styles from "./styles.module.scss";

export const onRestaurantSelection = createEvent<string | null>();

export const $restaurant = createStore<string | null>(null).on(
  onRestaurantSelection,
  (_, payload) => payload
);

export const onSetRestaurant = createEvent<string>();

export const $restaurantText = createStore<string | null>(null).on(
  onSetRestaurant,
  (_, payload) => payload
);

export const AddressSelection = ({ className }: { className?: string }) => {
  const isRus = useStore($rus);

  const label = useStore($restaurantText);

  const restaurant = useStore($restaurant);

  const addressesList = useMemo(
    () =>
      addresses
        .filter(({ country_label }) =>
          isRus ? country_label === "Россия" : country_label === "Казахстан"
        )
        .flatMap(({ regions }) => regions)
        .flatMap(({ region, addresses }) => ({
          region,
          addresses: addresses.flatMap(({ address, prefix, url }) => ({
            url,
            address,
            prefix,
          })),
        })),
    [isRus]
  );

  useEffect(() => {
    if (!restaurant) {
      const targetAddressList = addressesList.find((region) =>
        region.addresses.map(({ url }) => url).includes(window.location.origin)
      );

      const targetAddress = targetAddressList?.addresses.find(
        ({ url }) => url === window.location.origin
      );

      onRestaurantSelection(
        targetAddress?.address || addressesList[0].addresses[0].address
      );
    }
  }, [restaurant, addressesList]);

  return (
    <div className={classNames(className, styles.select, "flex")}>
      <img
        alt="gps"
        src={gpsIcon}
        className="mx-2 order-1 lg:order-0"
        width={15}
        height={18}
      />
      {label ? (
        <div className="text-body overflow-ellipsis text-sm w-full text-right lg:text-left bg-light">
          {label}
        </div>
      ) : (
        <select
          value={restaurant ?? undefined}
          onChange={(e) => onRestaurantSelection(e.target.value)}
          className={classNames(
            "text-body overflow-ellipsis text-sm w-full text-right lg:text-left bg-light"
          )}
        >
          {addressesList.map(({ region, addresses }) => (
            <optgroup key={region} label={region}>
              {addresses.map(({ address }) => (
                <option key={address} value={address}>
                  {address}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      )}
    </div>
  );
};
