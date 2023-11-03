import { ComponentProps, PropsWithChildren } from "react";

type Props = PropsWithChildren<ComponentProps<"footer">>;

export const Footer = (props: Props) => {
  return (
    <footer
      {...props}
      className={`bg-black px-8 py-4 text-white ${props.className}`}
    >
      {props.children}
    </footer>
  );
};
