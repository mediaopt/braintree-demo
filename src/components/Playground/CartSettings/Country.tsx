import { type FC, useState } from "react";
import type { OnLocalCartUpdate } from "../CartWrapper";
import { RadioGroup } from "./RadioGroup";

const OPTIONS = [
  { value: "DE", label: "Germany" },
  { value: "US", label: "USA" },
];

interface CountryProps {
  onCartUpdate: OnLocalCartUpdate;
}

export const Country: FC<CountryProps> = ({ onCartUpdate }) => {
  const [value, setValue] = useState("DE");

  const handleChange = (country: string) => {
    setValue(country);
    onCartUpdate({
      billingAddress: { country },
      shippingAddress: { country },
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
