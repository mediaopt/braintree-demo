import { type FC, useEffect } from "react";
import { getSessionId } from "./session.ts";
import {
  checkoutFlow,
  paymentFlow,
  expressPayment,
} from "@commercetools/checkout-browser-sdk";
import type { CartCheckoutData } from "../types.ts";

export const CheckoutLoader: FC<CartCheckoutData> = ({
  cartId,
  currencyCode,
  countryCode,
  mode,
}) => {
  useEffect(() => {
    const initCheckout = async () => {
      const sessionId = await getSessionId(cartId);
      if (typeof (window as any).process === "undefined") {
        (window as any).process = { env: { NODE_ENV: "development" } };
      }
      const paymentTemplateData = {
        projectKey: import.meta.env.VITE_CTP_PROJECT_KEY,
        region: import.meta.env.VITE_CTP_REGION,
        sessionId: sessionId,
        logInfo: true, // Recommended for debugging during development.
        logWarn: true, // Recommended for debugging during development.
        logError: true, // Recommended for debugging during development.
      };
      try {
        if (mode === "paymentOnly") {
          paymentFlow(paymentTemplateData);
        } else if (mode === "fullCheckout") {
          checkoutFlow(paymentTemplateData);
        } else {
          expressPayment.init({ ...paymentTemplateData, countryCode });
          const methods = await expressPayment.getAvailableMethods();
          const relevantMethods = methods.filter(({ type }) =>
            mode === "express" ? type === "PayPal" : type !== "PayPal",
          );
          relevantMethods.forEach((method: any) =>
            expressPayment.mountMethod({
              expressId: method.type,
              method,
              initialAmount: {
                currencyCode: currencyCode,
                centAmount: 0,
                fractionDigits: 0,
              },
              onPayButtonClick:
                mode === "express" ? () => Promise.resolve() : undefined, //todo - replace Promise.resolve with create cart with one product if product id provided
            }),
          );
        }
      } catch (e) {
        console.log(e);
      }
    };
    initCheckout();
  }, []);

  return (
    <>
      {/*the following divs are only required to load the express methods, see https://docs.commercetools.com/checkout/browser-sdk*/}
      <div data-ctc-express="PayPal"></div>
      <div data-ctc-express="PayPalVault"></div>
      <div data-ctc-express="CreditCardVault"></div>
    </>
  );
};
