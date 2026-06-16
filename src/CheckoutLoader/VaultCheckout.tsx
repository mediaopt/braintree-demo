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
        This is a demo for the Braintree commercetools connector. It
        demonstrates features relevant for different merchants and emphasizes
        payment-relevant aspects rather than buyer experience. It is not an
        official shop implementation — it is your responsibility to implement
        all surrounding pages in your shop. In particular, vault must only be
        accessible to authenticated users.
      </p>
      <div data-ctc-express="PayPalVault"></div>
      <div data-ctc-express="CreditCardVault"></div>
    </>
  );
};
