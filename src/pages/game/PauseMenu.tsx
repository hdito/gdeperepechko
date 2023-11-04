import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export const PauseMenu = ({ children }: Props) => {
  return (
    <div className="absolute left-0 top-0 h-full w-full p-4">
      <div className="m-auto flex max-w-[40ch] flex-col gap-4 rounded-2xl bg-white p-4">
        {children}
      </div>
    </div>
  );
};
