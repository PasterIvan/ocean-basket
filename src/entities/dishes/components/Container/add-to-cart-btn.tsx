import cn from "classnames";
import { CartIcon } from "./cart";
import { PlusIcon } from "./plus-icon";

type Props = {
  className?: string;
  variant?: "helium" | "neon" | "argon" | "oganesson" | "single" | "big";
  onClick(event: React.MouseEvent<HTMLButtonElement | MouseEvent>): void;
  disabled?: boolean;
};

const AddToCartBtn: React.FC<Props> = ({ className, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "py-4 px-5 w-full flex items-center justify-center text-xs font-light text-light bg-green-600 hover:bg-accent-hover transition-colors duration-300 focus:outline-none focus:bg-accent-hover",
        className,
        {
          "border !bg-gray-300 hover:!bg-gray-300 border-border-400 !text-body cursor-not-allowed":
            disabled,
        }
      )}
    >
      <span>В корзину</span>
    </button>
  );
};

export default AddToCartBtn;
