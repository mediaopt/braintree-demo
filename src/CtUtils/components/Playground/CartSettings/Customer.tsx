import { useState } from "react";
import { DEFAULT_CUSTOMER_ID } from "../../../../constants";
import type { OnLocalCartUpdate } from "../../../../types";
import { RadioGroup } from "./RadioGroup";

const OPTIONS = [
  { value: "none", label: "Guest" },
  { value: "existing", label: "Signed in customer" },
];

interface CustomerProps {
  onCartUpdate: OnLocalCartUpdate;
  customerId?: string;
}

export const Customer = ({
  onCartUpdate,
  customerId = DEFAULT_CUSTOMER_ID,
}: CustomerProps) => {
  const [selected, setSelected] = useState("none");

  const handleChange = (value: string) => {
    setSelected(value);
    onCartUpdate({ customerId: value === "existing" ? customerId : undefined });
  };

  return (
    <RadioGroup
      legend="Customer"
      name="customer"
      options={OPTIONS}
      value={selected}
      onChange={handleChange}
    />
  );
};
