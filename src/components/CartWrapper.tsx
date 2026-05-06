import { useEffect, useMemo, useState } from "react";
import type {
  Cart,
  CartDraft,
  ShippingMethod,
  ShippingMethodResourceIdentifier,
} from "@commercetools/platform-sdk";
import { createCart, updateCart as updateCartApi } from "../services/cart";
import { getShippingMethods } from "../services/shipping";
import { CART_CURRENCY, CART_COUNTRY, DEFAULT_CUSTOMER_ID } from "../constants";
import { ProductsGroup } from "./ProductsGroup";
import { CartLevelSettings } from "./CartLevelSettings/CartLevelSettings";
import { CartSummary } from "./StandardCheckout/CartSummary";
import { handleCartActions } from "./helpers/handleCartActions.ts";

export type CheckoutMode = "standard" | "express" | "pureVault";

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
      | "billingAddress"
      | "shippingAddress"
    >
  >
> & {
  shippingMethod?: ShippingMethodResourceIdentifier;
  discountCodes?: string[];
};

export type OnLocalCartUpdate = (partial: Partial<CartStateData>) => void;

export type CartCheckoutData = { cartId: string; currencyCode: string };

interface CartWrapperProps {
  mode: CheckoutMode;
  customerId?: string;
}

const requiredCartDraftData: Pick<CartDraft, "currency" | "country"> = {
  currency: CART_CURRENCY,
  country: CART_COUNTRY,
};

export const CartWrapper = ({
  mode,
  customerId = DEFAULT_CUSTOMER_ID,
}: CartWrapperProps) => {
  const [localCartData, setLocalCartData] = useState<CartStateData>({});
  const [serverCart, setServerCart] = useState<Cart | undefined>(undefined);
  const [availableShippingMethods, setAvailableShippingMethods] =
    useState<ShippingMethod[]>();
  const [checkoutData, setCheckoutData] = useState<CartCheckoutData | null>(
    null,
  );

  const localStateChanged = useMemo(
    () => Object.keys(localCartData).length > 0,
    [localCartData],
  );

  useEffect(() => {
    setLocalCartData({});
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

  const handleCreateCart = async (productId?: string) => {
    const shouldCreate =
      mode === "pureVault" ||
      !serverCart?.id ||
      (productId && (serverCart.lineItems?.length ?? 0) >= 1);

    if (!shouldCreate) return;
    const draft: CartDraft = {
      ...requiredCartDraftData,
      ...localCartData,
      ...(productId && { lineItems: [{ productId, quantity: 1 }] }),
      ...(mode === "pureVault" && { customerId }),
    };

    const { body } = await createCart(draft);
    if (!body) return;
    setServerCart(body);
    if (mode !== "standard")
      setCheckoutData({
        cartId: body.id,
        currencyCode: body.totalPrice.currencyCode,
      });
  };

  const updateCart = async () => {
    if (!serverCart) return;

    const actions = handleCartActions(localCartData);
    if (actions.length === 0) return;

    const { body: updatedCart } = await updateCartApi(
      serverCart.id,
      serverCart.version,
      actions,
    );
    if (!updatedCart) return;
    setServerCart(updatedCart);
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
    <></>
  ) : (
    <div className="p-4 sm:p-8">
        <div className="flex flex-col gap-8 max-w-fit mx-auto self-center">
          {mode === "standard" && (
            <ProductsGroup cart={serverCart} onMoveProduct={setServerCart} />
          )}
          <CartLevelSettings
            cartId={serverCart?.id}
            onCartUpdate={setLocalCartData}
            onSubmit={mode === "standard" ? updateCart : undefined}
            availableShippingMethods={availableShippingMethods}
            allowSubmit={localStateChanged}
          />
          {mode === "express" && <ProductsGroup onBuyNow={handleCreateCart} />}
          {serverCart && (
            <CartSummary
              cart={serverCart}
              onLoadCheckout={() =>
                setCheckoutData({
                  cartId: serverCart.id,
                  currencyCode: serverCart.totalPrice.currencyCode,
                })
              }
            />
          )}
        </div>
    </div>
  );
};
