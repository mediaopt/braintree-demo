import type { Cart } from "@commercetools/platform-sdk";
import { formatPrice } from "../../services/format";
import { type FC, useMemo } from "react";
import { Button } from "../Button.tsx";
import { GroupWrapper } from "./CartSettings/GroupWrapper.tsx";
import { DISCOUNT_CODES } from "../../constants";

const getLocalizedString = (ls: Record<string, string>) =>
  ls["en"] ?? Object.values(ls)[0];

interface CartSummaryProps {
  cart: Cart;
  onLoadCheckout: () => void;
}

export const CartSummary: FC<CartSummaryProps> = ({ cart, onLoadCheckout }) => {
  const { lineItems, shippingInfo, totalPrice, id } = cart;
  const hasAmount = (totalPrice?.centAmount ?? 0) > 0;

  const discountIdToName = useMemo(
    () =>
      Object.fromEntries(
        cart.discountCodes.map((dc) => {
          const expanded = dc.discountCode as any;
          return [
            dc.discountCode.id,
            DISCOUNT_CODES.find((d) => d.code === expanded.obj.code)?.name ??
              expanded.code,
          ];
        }),
      ),
    [cart.discountCodes],
  );

  return (
    <GroupWrapper title="Cart summary">
      <div className="flex justify-between">
        <p>id: {id}</p>
        <div>
          {lineItems.map((item) => (
            <div key={item.id} className="flex gap-2">
              <span>{getLocalizedString(item.name).replace("Demo ", "")}</span>
              <span>x{item.quantity}</span>
              <span>
                {formatPrice(
                  item.totalPrice.centAmount,
                  item.totalPrice.currencyCode,
                  item.totalPrice.fractionDigits,
                )}
              </span>
            </div>
          ))}
        </div>

        <div>
          {shippingInfo ? (
            <span>
              {shippingInfo.shippingMethodName} —{" "}
              {formatPrice(
                shippingInfo.price.centAmount,
                shippingInfo.price.currencyCode,
                shippingInfo.price.fractionDigits,
              )}
            </span>
          ) : (
            <span>No shipping</span>
          )}
        </div>

        <div>
          {cart.discountCodes.length ? (
            cart.discountCodes.map((dc) => (
              <div key={dc.discountCode.id}>
                {discountIdToName[dc.discountCode.id] ?? dc.discountCode.id}
              </div>
            ))
          ) : (
            <span>No cart discounts</span>
          )}
        </div>

        <Button
          action={onLoadCheckout}
          disabled={!hasAmount}
          title={`Load checkout ${formatPrice(
            totalPrice.centAmount,
            totalPrice.currencyCode,
            totalPrice.fractionDigits,
          )}`}
        />
      </div>
    </GroupWrapper>
  );
};
