import { useEffect, useMemo, useState } from "react";
import type {
  Cart,
  CartDraft,
  ShippingMethod,
  ShippingMethodResourceIdentifier,
} from "@commercetools/platform-sdk";
import { createCart, updateCart as updateCartApi } from "../../services/cart";
import { getShippingMethods } from "../../services/shipping";
import {
  CART_CURRENCY,
  CART_COUNTRY,
  DEFAULT_CUSTOMER_ID,
  ADDRESSES,
} from "../../../constants";
import { ProductsGroup } from "./ProductsGroup";
import { CartLevelSettings } from "./CartSettings/CartLevelSettings";
import { CartSummary } from "./CartSummary";
import { handleCartActions } from "./handleCartActions.ts";
import { CheckoutLoader } from "../../../CheckoutLoader/CheckoutLoader.tsx";
import type { BraintreeCheckoutMode, CartCheckoutData } from "../../../types.ts";

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type CartStateData = Mutable<
  Partial<
    Pick<
      Cart,
      | "country"
      | "taxMode"
      | "priceRoundingMode"
      | "taxRoundingMode"
      | "taxCalculationMode"
      | "inventoryMode"
      | "customerId"
      | "customerEmail"
      | "billingAddress"
      | "shippingAddress"
    >
  >
> & {
  shippingMethod?: ShippingMethodResourceIdentifier;
  discountCodes?: string[];
};

export type OnLocalCartUpdate = (partial: Partial<CartStateData>) => void;

interface CartWrapperProps {
  mode: BraintreeCheckoutMode;
}

const requiredCartDraftData: Pick<
  CartDraft,
  "currency" | "country" | "customerEmail"
> = {
  currency: CART_CURRENCY,
  country: CART_COUNTRY,
  customerEmail: "guest@checkout.ct",
};

export const Playground = ({ mode }: CartWrapperProps) => {
  const [localCartData, setLocalCartData] = useState<CartStateData>({});
  const [serverCart, setServerCart] = useState<Cart | undefined>(undefined);
  const [availableShippingMethods, setAvailableShippingMethods] =
    useState<ShippingMethod[]>();
  const [checkoutData, setCheckoutData] = useState<CartCheckoutData | null>(
    null,
  );
  const [cartError, setCartError] = useState<string>();

  const localStateChanged = useMemo(
    () => Object.keys(localCartData).length > 0,
    [localCartData],
  );

  useEffect(() => {
    setLocalCartData({});
    setCartError(undefined);
  }, [serverCart]);

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

  const handleCreateCart = async (productId?: string) => {
    const shouldCreate = mode === "pureVault" || !serverCart?.id || productId;

    if (!shouldCreate) return;
    const draft: CartDraft = {
      billingAddress:
        (localCartData?.country && ADDRESSES[localCartData.country]) ||
        ADDRESSES[CART_COUNTRY],
      shippingAddress:
        (localCartData?.country && ADDRESSES[localCartData.country]) ||
        ADDRESSES[CART_COUNTRY],
      ...requiredCartDraftData,
      ...localCartData,
      ...(productId && { lineItems: [{ productId, quantity: 1 }] }),
      ...(mode === "pureVault" && { customerId: DEFAULT_CUSTOMER_ID }),
    };

    const { body } = await createCart(draft);
    if (!body) return;
    setServerCart(body);
    if (!isStandardMode)
      setCheckoutData({
        cartId: body.id,
        currencyCode: body.totalPrice.currencyCode,
        countryCode: body.billingAddress?.country ?? CART_COUNTRY,
        mode,
      });
  };

  const updateCart = async () => {
    if (!serverCart) return;

    const actions = handleCartActions(localCartData);
    if (actions.length === 0) return;
    try {
      const response = await updateCartApi(
        serverCart.id,
        serverCart.version,
        actions,
      );
      if (!response.body) {
        return;
      }
      setServerCart(response.body);
    } catch (error) {
      setCartError((error as Error).message);
    }
  };

  useEffect(() => {
    setServerCart(undefined);
    setLocalCartData({});
    if (mode !== "express") {
      handleCreateCart();
    }
  }, [mode]);

  if (mode === "pureVault") return null;

  return checkoutData ? (
    <CheckoutLoader
      cartId={checkoutData.cartId}
      currencyCode={checkoutData.currencyCode}
      countryCode={checkoutData.countryCode}
    />
  ) : (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col gap-8 max-w-fit mx-auto self-center">
        {isStandardMode && (
          <ProductsGroup cart={serverCart} onMoveProduct={setServerCart} />
        )}
        {mode !== "pureVault" && (
          <CartLevelSettings
            cartId={serverCart?.id}
            onCartUpdate={setLocalCartData}
            onSubmit={isStandardMode ? updateCart : undefined}
            availableShippingMethods={availableShippingMethods}
            allowSubmit={localStateChanged}
          />
        )}
        {mode === "express" && <ProductsGroup onBuyNow={handleCreateCart} />}
        {serverCart && mode !== "pureVault" && (
          <CartSummary
            cart={serverCart}
            cartError={cartError}
            onLoadCheckout={
              isStandardMode
                ? () =>
                    setCheckoutData({
                      mode,
                      cartId: serverCart.id,
                      currencyCode: serverCart.totalPrice.currencyCode,
                      countryCode:
                        serverCart.country ??
                        serverCart.billingAddress?.country ??
                        serverCart.shippingAddress?.country ??
                        CART_COUNTRY,
                    })
                : undefined
            }
          />
        )}
      </div>
      {checkoutData && <CheckoutLoader {...checkoutData} />}
    </div>
  );
};
