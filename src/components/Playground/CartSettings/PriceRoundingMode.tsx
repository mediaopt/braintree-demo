import { type FC, useState } from "react";
import type { OnLocalCartUpdate } from "../CartWrapper";
import { RadioGroup } from "./RadioGroup";

const PRICE_ROUNDING_MODES = ["HalfEven", "HalfUp", "HalfDown"] as const;
type PriceRoundingMode = (typeof PRICE_ROUNDING_MODES)[number];

const OPTIONS = PRICE_ROUNDING_MODES.map((m) => ({ value: m, label: m }));

interface PriceRoundingModeProps {
  onCartUpdate: OnLocalCartUpdate;
}

export const PriceRoundingMode: FC<PriceRoundingModeProps> = ({ onCartUpdate }) => {
  const [value, setValue] = useState<PriceRoundingMode>(PRICE_ROUNDING_MODES[0]);

  const handleChange = (mode: string) => {
    setValue(mode as PriceRoundingMode);
    onCartUpdate({ priceRoundingMode: mode as PriceRoundingMode });
  };

  return (
    <RadioGroup
      legend="Price Rounding Mode"
      name="priceRoundingMode"
      options={OPTIONS}
      value={value}
      onChange={handleChange}
    />
  );
};
