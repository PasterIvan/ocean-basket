import cn from "classnames";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/css/OverlayScrollbars.css";

type ScrollbarProps = {
  options?: OverlayScrollbars.Options;
  style?: React.CSSProperties;
  className?: string;
};

export const Scrollbar: React.FC<ScrollbarProps> = ({
  options,
  className,
  style,
  ...props
}) => {
  return (
    <OverlayScrollbarsComponent
      options={{
        className: cn("os-theme-thin-dark", className),
        scrollbars: {
          autoHide: "scroll",
        },
        ...options,
      }}
      style={style}
      {...props}
    />
  );
};
