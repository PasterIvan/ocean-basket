import { NotFound } from "@entities/dishes/components/NotFound";
import Spinner from "@shared/components/spinner/spinner";
import { getPlurals } from "@shared/lib/functional-utils";
import { RoutesConfig } from "@shared/lib/routes-config";
import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Details } from "./Details";
import { OrderDescriptionContainer } from "./OrderDescriptionContainer";
import { getDeliveryFeeName } from "../Forms/PaymentProccessing";

dayjs.locale("ru");

export function OrderDescription({
  orderNumber,
  orderDate,
  status = "ordered",
  positionsNumber,
  isLoading,
  isNotFound,
  retryButton,
  total = "0",
  schedule,
  address,
  savedPromocode = null,
  location,
}: {
  orderNumber?: number;
  orderDate?: Dayjs | null;
  status?: "success" | "failrue" | "ordered";
  positionsNumber?: number;
  isLoading?: boolean;
  isNotFound?: boolean;
  retryButton?: ReactNode;
  total?: string;
  schedule?: string;
  address?: string | null;
  savedPromocode?: {
    promocode: string;
    promocodeText: string | null;
  } | null;
  location?: boolean | null;
}) {
  const navigate = useNavigate();

  if (isNotFound) {
    return (
      <OrderDescriptionContainer>
        <NotFound text={"Страница не найдена"} className="w-7/12 mx-auto" />
      </OrderDescriptionContainer>
    );
  }

  return (
    <OrderDescriptionContainer>
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="pt-4 sm:pt-0 order-1 sm:order-0">
          {status === "success" ? (
            <>
              <div className="font-bold text-green-400 text-2xl">
                Заказ оплачен
              </div>
              <div className="mt-1">Спасибо. Ваш заказ готовится</div>
            </>
          ) : status === "failrue" ? (
            <>
              <div className="font-bold text-2xl text-red-600">
                Оплата не прошла
              </div>
              <div className="mt-1">
                Попробуйте ещё раз, или обратесь в{" "}
                <span
                  className="underline cursor-pointer hover:text-accent"
                  onClick={() => navigate(RoutesConfig.Contacts)}
                >
                  поддержку
                </span>
              </div>
              {retryButton}
            </>
          ) : (
            <>
              <div className="font-bold text-2xl">Заказ получен</div>
              <div className="mt-1">Спасибо. Ваш заказ получен</div>
            </>
          )}
        </div>
        <div className="w-full sm:w-auto ml-auto order-0 sm:order-1 sm:-mt-8 md:-mr-9">
          <button
            onClick={() => navigate(RoutesConfig.Dashboard)}
            className="w-full sm:w-auto text-body text-sm py-3 px-8 border border-current rounded-xl hover:bg-accent hover:text-light"
          >
            Вернуться на главную
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96 bg-light relative md:rounded-xl mx-auto">
          <Spinner text="Загрузка" />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-between pt-8">
            {[
              { label: "Номер заказа", text: orderNumber || "" },
              {
                label: "Дата",
                text: orderDate?.format("DD MMMM YYYY г.") || "",
              },
              { label: "Итого", text: total },
              { label: "Метод оплаты", text: "Картой онлайн" },
            ].map(({ label, text }, idx) => (
              <div
                className={classNames(
                  "mt-3",
                  idx && "border-l border-border-200 min-w-150 pl-3"
                )}
                key={idx}
              >
                <div className="text-base font-bold">{label}</div>
                <div className="mt-3">{text}</div>
              </div>
            ))}
          </div>
          <Details
            className="max-w-xl mt-16"
            label="Детали заказа"
            items={[
              [
                "Всего товаров",
                `${positionsNumber} ${getPlurals(positionsNumber ?? 0, [
                  "позиция",
                  "позиции",
                  "позиций",
                ])}`,
              ],
              [
                "Время заказа",
                orderDate?.format("HH:mm DD MMMM YYYY г.") ?? "",
              ],
              ["Срок доставки", schedule ?? ""],
              ["Место доставки", address ?? ""],
              Boolean(savedPromocode) && [
                "Промокод",
                `${savedPromocode!.promocode}${
                  savedPromocode!.promocodeText
                    ? ", " + savedPromocode!.promocodeText
                    : ""
                }`,
              ],
            ]}
          />

          <Details
            className="max-w-xl mt-16"
            label="Общая сумма"
            items={[
              ["Итого", total],
              ["Метод оплаты", "Картой онлайн"],
              ["Доставка", getDeliveryFeeName(parseInt(total), location)],
            ]}
          />
        </>
      )}
    </OrderDescriptionContainer>
  );
}
