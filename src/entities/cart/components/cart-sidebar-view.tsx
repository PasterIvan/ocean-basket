import { motion, AnimateSharedLayout } from "framer-motion";
import cartLogo from "./icons/cart.svg";
import { CloseIcon } from "./icons/close-icon";
import CartItem from "./cart-item";
import { fadeInOut } from "../lib/fade-in-out";
import usePrice from "../lib/use-price";
import { useStore } from "effector-react";
import classNames from "classnames";
import { Scrollbar } from "@shared/components/Scrollbar";
import { $cartSizes, $cartItems } from "@features/choose-dishes/models";

export const EmptyCartPanel = ({
  noGutters = false,
}: {
  noGutters?: boolean;
}) => {
  return (
    <motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      variants={fadeInOut(0.25)}
      className="w-full flex items-center justify-center"
    >
      <img
        className={classNames(
          "justify-self-start mr-auto",
          !noGutters ? "pl-8" : "pl-4"
        )}
        src={cartLogo}
      />
      <h4 className="text-base mr-auto font-bold pr-8">Корзина пуста</h4>
    </motion.div>
  );
};

export const CartSidebarView = ({
  onSubmit,
  onClose,
  isFlat = false,
}: {
  onSubmit: () => void;
  onClose?: () => void;
  isFlat?: boolean;
}) => {
  const cartSizes = useStore($cartSizes);
  const cartItems = useStore($cartItems);

  console.log("cartSizes", cartSizes);

  function handleCheckout() {
    if (!cartSizes.size) return;
    onSubmit?.();
  }

  const { price: totalPrice } = usePrice({
    amount: cartSizes.totalAmount ?? 0,
  });
  return (
    <section className="flex flex-col h-full relative">
      <header
        className={classNames(
          !isFlat ? "fixed py-4" : "py-7",
          "max-w-md w-full top-0 z-10 bg-light px-6 flex items-center justify-between border-b border-border-200 border-opacity-75"
        )}
      >
        <div className="flex text-body text-lg font-bold">
          <span className="flex">
            {isFlat ? `${cartSizes.size} позиций` : "Корзина:"}
          </span>
        </div>
        {!isFlat && (
          <button
            onClick={() => onClose?.()}
            className="w-7 h-7 ms-3 -me-2 flex items-center justify-center rounded-full text-muted bg-gray-100 transition-all duration-200 focus:outline-none hover:bg-accent focus:bg-accent hover:text-light focus:text-light"
          >
            <span className="sr-only">Закрыть</span>
            <CloseIcon className="w-3 h-3" />
          </button>
        )}
      </header>
      {/* End of cart header */}

      <AnimateSharedLayout>
        <motion.div
          layout
          className={classNames("flex-grow", !isFlat && "pt-16")}
        >
          {cartItems.length > 0 ? (
            <Scrollbar className="w-full h-full">
              {cartItems.map((item) => (
                <CartItem
                  isCounter={isFlat}
                  item={item}
                  key={item.product.id}
                />
              ))}
            </Scrollbar>
          ) : (
            <div className="pt-8 pb-3">
              <EmptyCartPanel />
            </div>
          )}
        </motion.div>
      </AnimateSharedLayout>
      {/* End of cart items */}

      <footer
        className={classNames(
          !isFlat && "sticky",
          "start-0 bottom-0 w-full py-5 px-6 z-10 bg-light"
        )}
      >
        <button
          className={classNames(
            "flex text-body justify-between w-full h-12 md:h-14 p-1 text-sm font-bold bg-current rounded-full shadow-700 transition-colors focus:outline-none hover:bg-accent-hover focus:bg-accent-hover",
            !cartSizes.size
              ? "bg-gray-300 hover:bg-gray-300 border-border-400 cursor-not-allowed"
              : ""
          )}
          onClick={handleCheckout}
        >
          <span className="flex flex-1 items-center  h-full px-5 text-light">
            Заказать
          </span>
          <span className="flex items-center flex-shrink-0 h-full bg-light text-body rounded-full px-5">
            {totalPrice}
          </span>
        </button>
      </footer>
      {/* End of footer */}
    </section>
  );
};
