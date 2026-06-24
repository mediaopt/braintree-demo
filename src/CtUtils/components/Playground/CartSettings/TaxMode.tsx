import { type FC, useState } from "react";
import type { TaxMode as TaxModeType } from "@commercetools/platform-sdk";
import type { OnLocalCartUpdate } from "../../../../types";
import { RadioGroup } from "./RadioGroup";

const TAX_MODES: TaxModeType[] = ["Platform", "External"];

const OPTIONS = TAX_MODES.map((m) => ({ value: m, label: m }));

interface TaxModeProps {
  onCartUpdate: OnLocalCartUpdate;
}

export const TaxMode: FC<TaxModeProps> = ({ onCartUpdate }) => {
  const [value, setValue] = useState<TaxModeType>(TAX_MODES[0]);

  const handleChange = (mode: string) => {
    setValue(mode as TaxModeType);
    onCartUpdate({ taxMode: mode as TaxModeType });
  };

  return (
    <RadioGroup
      legend="Tax Mode"
      name="taxMode"
      options={OPTIONS}
      value={value}
      onChange={handleChange}
    />
  );
};
