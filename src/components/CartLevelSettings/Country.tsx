import { type FC, useState } from "react";
import type { OnLocalCartUpdate } from "../CartWrapper";
import { RadioGroup } from "../RadioGroup";

const OPTIONS = [
  { value: "", label: "No country" },
  { value: "DE", label: "Germany" },
  { value: "US", label: "USA" },
];

interface CountryProps {
  onCartUpdate: OnLocalCartUpdate;
}

export const Country: FC<CountryProps> = ({ onCartUpdate }) => {
  const [value, setValue] = useState("");

  const handleChange = (country: string) => {
    setValue(country);
    onCartUpdate({
      billingAddress: country ? { country } : undefined,
      shippingAddress: country ? { country } : undefined,
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
