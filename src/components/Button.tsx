import { ComponentProps, PropsWithChildren } from "react";

type Props = PropsWithChildren<ComponentProps<"button">>;

export const Button = (props: Props) => {
  return (
    <button
      {...props}
      className={`rounded bg-black px-2 py-1 text-white transition-opacity hover:opacity-70 ${props.className}`}
    >
      {props.children}
    </button>
  );
};
