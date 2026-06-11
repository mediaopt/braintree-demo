import { type FC, useState } from "react";
import type { OnLocalCartUpdate } from "../Playground";
import { RadioGroup } from "./RadioGroup";
import { ADDRESSES } from "../../../../constants.ts";

const OPTIONS = [
  { value: "DE", label: "Germany" },
  { value: "US", label: "USA" },
  { value: "NL", label: "Netherlands" },
];

interface CountryProps {
  onCartUpdate: OnLocalCartUpdate;
}

export const Country: FC<CountryProps> = ({ onCartUpdate }) => {
  const [value, setValue] = useState("DE");

  const handleChange = (country: string) => {
    setValue(country);
    const address = ADDRESSES[country] ?? { country };
    onCartUpdate({
      billingAddress: address,
      shippingAddress: address,
    });
  };

  return (
    <RadioGroup
      legend="Country"
      name="country"
      options={OPTIONS}
      value={value}
      onChange={handleChange}
    />
  );
};
