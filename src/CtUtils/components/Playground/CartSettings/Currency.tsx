import { type FC, useState } from "react";
import type { OnLocalCartUpdate } from "../../../../types";
import { RadioGroup } from "./RadioGroup";

const OPTIONS = [
  { value: "PLN", label: "PLN" },
  { value: "EUR", label: "EUR" },
];

interface CurrencyProps {
  onCartUpdate: OnLocalCartUpdate;
}

export const Currency: FC<CurrencyProps> = ({ onCartUpdate }) => {
  const [value, setValue] = useState("PLN");

  const handleChange = (currency: string) => {
    setValue(currency);
    onCartUpdate({ currency });
  };

  return (
    <RadioGroup
      legend="Currency"
      name="currency"
      options={OPTIONS}
      value={value}
      onChange={handleChange}
    />
  );
};
