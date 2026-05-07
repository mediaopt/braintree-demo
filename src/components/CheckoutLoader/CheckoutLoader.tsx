import { type FC, useEffect, useState } from "react";
import { buildCheckoutData, type CheckoutData } from "../../services/session.ts";
import { paymentFlow } from '@commercetools/checkout-browser-sdk';
import { expressPayment } from '@commercetools/checkout-browser-sdk';
export const CheckoutLoader: FC<{ cartId: string; currencyCode: string; countryCode: string }> = ({cartId, currencyCode, countryCode}) => {
  const [checkoutData, setCheckoutData]=useState<CheckoutData>()

  useEffect(() => {
    const initChechout=async ()=> {
      const data=await buildCheckoutData(cartId, currencyCode, countryCode);
      setCheckoutData(data)
    }
    initChechout()
  }, []);

  return checkoutData?paymentFlow({
    projectKey: '{projectKey}',
    region: '{region}',
    sessionId: '{sessionId}',
    logInfo: true, // Recommended for debugging during development.
    logWarn: true, // Recommended for debugging during development.
    logError: true, // Recommended for debugging during development.
  }): <div>Loading...</div>


  // expressPayment.mountMethod({
  //   initialAmount: {
  //     type: undefined,
  //     currencyCode: "",
  //     centAmount: 0,
  //     fractionDigits: 0
  //   },
  //   method: {
  //     type: "",
  //     paymentIntegrationId: "",
  //     connectorId: ""
  //   }
  // })

};
