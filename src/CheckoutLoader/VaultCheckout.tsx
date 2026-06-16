import { useEffect } from "react";
import { loadVault } from "./loadVault.ts";
import { useCart } from "../CtUtils/context/CartContext.tsx";

export const VaultCheckout = () => {
  const { cart, localCartData } = useCart();

  // localCartData intentionally omitted from deps — vault is initialised once per cart, not on every settings change
  useEffect(() => {
    if (!cart) return;
    loadVault(cart.id, localCartData).catch(console.log);
  }, [cart?.id]);

  return (
    <>
      <p>
        This demo implementation grants that vault will be triggered with a
        signed in commercetools customer. It is your responsibility to only
        allow access to vault in your shop only for authenticated users.
      </p>
      <div data-ctc-express="PayPalVault"></div>
      <div data-ctc-express="CreditCardVault"></div>
    </>
  );
};
