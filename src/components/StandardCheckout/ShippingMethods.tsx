import { useMemo, useState } from "react";
import type { ShippingMethod } from "@commercetools/platform-sdk";
import { formatPrice } from "../../services/format";
import type { OnLocalCartUpdate } from "../CartWrapper";
import { RadioGroup } from "../RadioGroup";

interface ShippingMethodsProps {
  methods: ShippingMethod[];
  onCartUpdate: OnLocalCartUpdate;
}

export const ShippingMethods = ({ methods, onCartUpdate }: ShippingMethodsProps) => {
  const [selected, setSelected] = useState("");

  const options = useMemo(
    () => [
      { value: "", label: "No shipping" },
      ...methods.map((method) => {
        const matchingRate = method.zoneRates[0]?.shippingRates?.find((r) => r.isMatching);
        const price = matchingRate?.price;
        const priceLabel = price
          ? ` — ${formatPrice(price.centAmount, price.currencyCode, price.fractionDigits)}`
          : "";
        return { value: method.id, label: `${method.name}${priceLabel}` };
      }),
    ],
    [methods],
  );

  const handleChange = (value: string) => {
    setSelected(value);
    onCartUpdate({
      shippingMethod: value ? { typeId: "shipping-method", id: value } : undefined,
    });
  };

  return (
    <RadioGroup
      legend="Shipping Method"
      name="shippingMethod"
      options={options}
      value={selected}
      onChange={handleChange}
    />
  );
};
