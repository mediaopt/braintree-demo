import { type FC, useState } from "react";
import type { TaxCalculationMode as TaxCalculationModeType } from "@commercetools/platform-sdk";
import type { OnLocalCartUpdate } from "../CartWrapper";
import { RadioGroup } from "./RadioGroup";

const TAX_CALCULATION_MODES: TaxCalculationModeType[] = ["LineItemLevel", "UnitPriceLevel"];

const OPTIONS = TAX_CALCULATION_MODES.map((m) => ({ value: m, label: m }));

interface TaxCalculationModeProps {
  onCartUpdate: OnLocalCartUpdate;
}

export const TaxCalculationMode: FC<TaxCalculationModeProps> = ({ onCartUpdate }) => {
  const [value, setValue] = useState<TaxCalculationModeType>(TAX_CALCULATION_MODES[0]);

  const handleChange = (mode: string) => {
    setValue(mode as TaxCalculationModeType);
    onCartUpdate({ taxCalculationMode: mode as TaxCalculationModeType });
  };

  return (
    <RadioGroup
      legend="Tax Calculation Mode"
      name="taxCalculationMode"
      options={OPTIONS}
      value={value}
      onChange={handleChange}
    />
  );
};
