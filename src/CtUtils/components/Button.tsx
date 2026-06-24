import type { FC } from "react";

export const Button: FC<{
  title: string;
  action: () => void | Promise<void>;
  disabled?: boolean;
  className?: string;
}> = ({ title, action, disabled, className }) => {
  return (
    <button
      className={`w-fit rounded-md border border-gray-900 cursor-pointer p-2 disabled:cursor-not-allowed disabled:bg-gray-400 ${className ? ` ${className}` : ""}`}
      onClick={action}
      disabled={disabled}
    >
      {title}
    </button>
  );
};
