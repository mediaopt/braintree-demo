import type { FC } from "react";
import type { ShippingMethod } from "@commercetools/platform-sdk";
import { GroupWrapper } from "./GroupWrapper.tsx";
import { ShippingMethods } from "./ShippingMethods.tsx";
import { Discount } from "./Discount.tsx";
import { Customer } from "./Customer.tsx";
import { PriceRoundingMode } from "./PriceRoundingMode.tsx";
import { TaxCalculationMode } from "./TaxCalculationMode.tsx";
import { Country } from "./Country.tsx";
import { Button } from "../../Button.tsx";
import type { OnLocalCartUpdate } from "../Playground.tsx";

interface CartLevelSettingsProps {
  cartId?: string;
  onCartUpdate: OnLocalCartUpdate;
  onSubmit?: () => Promise<void>;
  availableShippingMethods?: ShippingMethod[];
  allowSubmit?: boolean;
}

export const CartLevelSettings: FC<CartLevelSettingsProps> = ({
  cartId,
  onCartUpdate,
  onSubmit,
  availableShippingMethods,
  allowSubmit,
}) => {
  return (
    <GroupWrapper title="Cart Level Settings">
      <div className="flex gap-4 sm:gap-8">
        <Country onCartUpdate={onCartUpdate} />
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
        {onSubmit && (
          <div className="col-span-2 mt-4">
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
