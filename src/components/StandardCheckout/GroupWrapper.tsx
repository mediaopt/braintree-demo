import type { FC, PropsWithChildren } from "react";

export const GroupWrapper: FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => {
  return (
    <div className="p-2 mx-auto w-full">
      <h1 className="text-lg text-center mb-4">{title}</h1>
      {children}
    </div>
  );
};
