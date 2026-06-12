import { createContext, type FC, type PropsWithChildren, useContext, useEffect, useState } from "react";
import type { Cart } from "@commercetools/platform-sdk";
import { createCart, updateCart as updateCartApi } from "../services/cart.ts";
import { CART_CURRENCY, CART_COUNTRY, ADDRESSES } from "../../constants.ts";
import type { CartStateData, OnLocalCartUpdate } from "../../types.ts";
import { handleCartActions } from "../components/Playground/handleCartActions.ts";

type CartContextValue = {
  cart: Cart | undefined;
  setCart: (cart: Cart | undefined) => void;
  localCartData: CartStateData;
  updateLocalCartData: OnLocalCartUpdate;
  updateCart: () => Promise<void>;
  cartError: string | undefined;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [cart, setCart] = useState<Cart | undefined>(undefined);
  const [localCartData, setLocalCartData] = useState<CartStateData>({});
  const [cartError, setCartError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (cart) return;
    createCart({
      currency: CART_CURRENCY,
      country: CART_COUNTRY,
      customerEmail: "guest@checkout.ct",
      billingAddress: ADDRESSES[CART_COUNTRY],
      shippingAddress: ADDRESSES[CART_COUNTRY],
    }).then(({ body }) => { if (body) setCart(body); });
  }, []);

  useEffect(() => {
    setLocalCartData({});
    setCartError(undefined);
  }, [cart]);

  const updateLocalCartData: OnLocalCartUpdate = (partial) =>
    setLocalCartData((prev) => ({ ...prev, ...partial }));

  const updateCart = async () => {
    if (!cart) return;

    // CT carts are immutable with respect to currency — recreate when it changes
    if (localCartData.currency && localCartData.currency !== cart.totalPrice.currencyCode) {
      try {
        const country = localCartData.country ?? cart.country ?? CART_COUNTRY;
        const address = localCartData.billingAddress ?? ADDRESSES[country] ?? ADDRESSES[CART_COUNTRY];
        const { body } = await createCart({
          currency: localCartData.currency,
          country,
          customerEmail: "guest@checkout.ct",
          billingAddress: address,
          shippingAddress: localCartData.shippingAddress ?? address,
        });
        if (body) setCart(body);
      } catch (error) {
        setCartError((error as Error).message);
      }
      return;
    }

    const actions = handleCartActions(localCartData);
    if (actions.length === 0) return;
    try {
      const response = await updateCartApi(cart.id, cart.version, actions);
      if (!response.body) return;
      setCart(response.body);
    } catch (error) {
      setCartError((error as Error).message);
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, localCartData, updateLocalCartData, updateCart, cartError }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
