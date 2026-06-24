import { type FC, useState } from "react";
import type { ShippingMethod } from "@commercetools/platform-sdk";
import { GroupWrapper } from "./GroupWrapper.tsx";
import { ShippingMethods } from "./ShippingMethods.tsx";
import { Discount } from "./Discount.tsx";
import { Customer } from "./Customer.tsx";
import { PriceRoundingMode } from "./PriceRoundingMode.tsx";
import { TaxCalculationMode } from "./TaxCalculationMode.tsx";
import { TaxMode } from "./TaxMode.tsx";
import { Country } from "./Country.tsx";
import { Currency } from "./Currency.tsx";
import { Button } from "../../Button.tsx";
import type { CartStateData, OnLocalCartUpdate } from "../../../../types";

interface CartLevelSettingsProps {
  cartId?: string;
  onCartUpdate: OnLocalCartUpdate;
  onSubmit?: () => Promise<void>;
  onCreateCart?: (data: CartStateData) => Promise<void>;
  availableShippingMethods?: ShippingMethod[];
  allowSubmit?: boolean;
}

export const CartLevelSettings: FC<CartLevelSettingsProps> = ({
  cartId,
  onCartUpdate,
  onSubmit,
  onCreateCart,
  availableShippingMethods,
  allowSubmit,
}) => {
  const [creationSettings, setCreationSettings] = useState<CartStateData>({});
  const [selectedCountry, setSelectedCountry] = useState("DE");

  const handleCreationUpdate: OnLocalCartUpdate = (partial) => {
    if (partial.billingAddress?.country) {
      setSelectedCountry(partial.billingAddress.country);
    }
    if (onCreateCart) {
      setCreationSettings((prev) => ({ ...prev, ...partial }));
    } else {
      onCartUpdate(partial);
    }
  };

  return (
    <GroupWrapper title="Cart Level Settings">
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
          Set at cart creation
        </p>
        <div className="flex gap-4 sm:gap-8 flex-wrap">
          <Country onCartUpdate={handleCreationUpdate} />
          {selectedCountry === "PL" && (
            <Currency onCartUpdate={handleCreationUpdate} />
          )}
          <TaxMode onCartUpdate={handleCreationUpdate} />
        </div>
        {onCreateCart && (
          <div className="mt-4">
            <Button
              action={() => onCreateCart(creationSettings)}
              title="New cart"
            />
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
          Modify existing cart
        </p>
        <div className="flex gap-4 sm:gap-8 flex-wrap">
          {availableShippingMethods && (
            <ShippingMethods
              methods={availableShippingMethods}
              onCartUpdate={onCartUpdate}
            />
          )}
          <Discount onCartUpdate={onCartUpdate} />
          <Customer onCartUpdate={onCartUpdate} />
          <PriceRoundingMode onCartUpdate={onCartUpdate} />
          <TaxCalculationMode onCartUpdate={onCartUpdate} />
        </div>
        {onSubmit && (
          <div className="mt-4">
            <Button
              action={onSubmit}
              disabled={!cartId || !allowSubmit}
              title="Modify cart"
            />
          </div>
        )}
      </div>
    </GroupWrapper>
  );
};
