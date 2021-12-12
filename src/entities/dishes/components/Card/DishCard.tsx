import cn from "classnames";
import { AddToCart } from "../../../cart/components/Buttons/AddToCart";
import productIcon from "@assets/product.svg";

import usePrice, { formatPrice } from "@entities/cart/lib/use-price";
import { Dish, DishStatus } from "@shared/api/dishes";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { useSortedPrices } from "@entities/cart/components/Details/variation-price";
import { onDishModalOpen } from "@entities/cart/components/Details/add-dish-modal";
import { hostUrl } from "@shared/api/base";

type DishCardProps = {
  product: Dish;
  className?: string;
};

export const useObserver = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isStartLoading, setIsStartLoading] = useState<boolean>(false);

  const [oberver, setObserver] = useState<IntersectionObserver | null>(null);

  const containerRef = useCallback(
    (ref: HTMLElement | null) => {
      if (oberver && ref) {
        oberver.unobserve(ref);
        oberver.observe(ref);
      }
    },
    [oberver]
  );

  useEffect(() => {
    const intObs = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setIsVisible(true);
        setIsStartLoading(true);
      } else {
        setIsVisible(false);
      }
    });

    setObserver(intObs);

    return () => {
      intObs.disconnect();
    };
  }, []);

  return useMemo(
    () => ({
      containerRef,
      isVisible,
      isStartLoading,
    }),
    [containerRef, isVisible, isStartLoading]
  );
};

export const DishCard = React.memo(({ product, className }: DishCardProps) => {
  const { name, photo, description, status, prices } = product ?? {};

  const mappedPrices = useSortedPrices(prices);

  const price = useMemo(() => {
    if (mappedPrices.length === 0) return;

    const price = formatPrice({
      amount: mappedPrices[0].rouble_price,
      currencyCode: "RUB",
      locale: "ru",
    });

    return mappedPrices.length > 1 ? `от ${price}` : price;
  }, []);

  const [isDisplaying, setIsDisplaying] = useState<boolean>(true);

  const { containerRef, isVisible, isStartLoading } = useObserver();

  const onImgaeErrorHandle = useCallback(() => {
    setIsDisplaying(false);
  }, []);

  function handleProductQuickView() {
    onDishModalOpen(product);
  }

  return (
    <article
      ref={containerRef}
      className={cn(
        "product-card cart-type-helium border border-border-200 h-full bg-light overflow-hidden transition-shadow duration-200 hover:shadow-sm flex flex-col rounded-2xl",
        className
      )}
    >
      <div
        onClick={handleProductQuickView}
        role="button"
        className="relative flex items-center justify-center w-auto h-48 sm:h-52"
      >
        <span className="sr-only">{name}</span>
        <img
          src={
            isDisplaying && isStartLoading && photo
              ? `${hostUrl}/${photo}`
              : productIcon
          }
          onError={onImgaeErrorHandle}
          alt={name}
          className={classNames(
            "product-image w-full h-full object-cover",
            !isVisible && "hidden"
          )}
        />
        {/* {isDiscount && (
          <div className="absolute top-3 end-3 md:top-4 md:end-4">
            <GiftIcon />
          </div>
          )} */}
      </div>
      {/* End of product image */}

      <header className="p-3 md:py-6 md:p-5 relative flex flex-col justify-between flex-grow">
        <div>
          <h3
            onClick={handleProductQuickView}
            className="text-md text-body font-bold truncate mb-1"
          >
            {name}
          </h3>
          <p className={classNames("text-muted text-xs mb-3 font-medium")}>
            {description}
          </p>
        </div>
        {/* <h3
          onClick={handleProductQuickView}
          className="text-md font-bold truncate mb-2"
        >
          {deliveryFee ? `${deliveryPrice} доставка` : "Бесплатная доставка"}
        </h3> */}
        {/* End of product info */}

        <div className="flex items-center justify-between min-h-6 mt-4 md:mt-3 relative">
          <div className="relative">
            {/* {discount && (
              <del className="text-xs text-muted text-opacity-75 absolute -top-4 md:-top-5 italic">
                {discountPrice}
              </del>
            )} */}
            <span className="text-body font-medium text-sm  md:text-lg">
              {price}
            </span>
          </div>
          {status === DishStatus.Active && Boolean(mappedPrices.length) ? (
            <AddToCart data={product} />
          ) : (
            <div className="text-muted bg-gray-100 rounded-full text-xs py-2 px-4">
              Нет в наличии
            </div>
          )}
          {/* End of product price */}
        </div>
      </header>
    </article>
  );
});
