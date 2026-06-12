import { useEffect, useMemo, useState } from "react";
import type { ShippingMethod } from "@commercetools/platform-sdk";
import { getShippingMethods } from "../../services/shipping";
import { ProductsGroup } from "./ProductsGroup";
import { CartLevelSettings } from "./CartSettings/CartLevelSettings";
import { CartSummary } from "./CartSummary";
import { CheckoutLoader } from "../../../CheckoutLoader/CheckoutLoader.tsx";
import type { BraintreeCheckoutMode, CartCheckoutData } from "../../../types.ts";
import { buildCheckoutData } from "../../../CheckoutLoader/checkout.ts";
import { useCart } from "../../context/CartContext.tsx";

interface CartWrapperProps {
  mode: BraintreeCheckoutMode;
}

export const Playground = ({ mode }: CartWrapperProps) => {
  const { cart: serverCart, setCart: setServerCart, localCartData, updateLocalCartData, updateCart, cartError } = useCart();
  const [availableShippingMethods, setAvailableShippingMethods] =
    useState<ShippingMethod[]>();
  const [checkoutData, setCheckoutData] = useState<CartCheckoutData | null>(null);

  const localStateChanged = useMemo(
    () => Object.keys(localCartData).length > 0,
    [localCartData],
  );

  useEffect(() => {
    const country = serverCart?.billingAddress?.country;
    if (!serverCart?.id || !country) {
      setAvailableShippingMethods(undefined);
      return;
    }
    getShippingMethods(serverCart.id).then(({ body }) => {
      setAvailableShippingMethods(body as unknown as ShippingMethod[]); //there is a mismatch in the SDK types for this endpoint, but the response is correct
    });
  }, [serverCart?.billingAddress?.country]);

  const isStandardMode = useMemo(
    () => mode === "fullCheckout" || mode === "paymentOnly",
    [mode],
  );

  useEffect(() => {
    setServerCart(undefined);
    setCheckoutData(null);
  }, [mode]);

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col gap-8 max-w-fit mx-auto self-center">
        {isStandardMode && <ProductsGroup />}
        {mode !== "pureVault" && (
          <CartLevelSettings
            cartId={serverCart?.id}
            onCartUpdate={updateLocalCartData}
            onSubmit={isStandardMode ? updateCart : undefined}
            availableShippingMethods={availableShippingMethods}
            allowSubmit={localStateChanged}
          />
        )}
        {mode === "express" && <ProductsGroup isExpress />}
        {serverCart && mode !== "pureVault" && (
          <CartSummary
            cart={serverCart}
            cartError={cartError}
            onLoadCheckout={
              isStandardMode
                ? () => setCheckoutData(buildCheckoutData(serverCart, mode))
                : undefined
            }
          />
        )}
      </div>
      {checkoutData && <CheckoutLoader {...checkoutData} />}
    </div>
  );
};
