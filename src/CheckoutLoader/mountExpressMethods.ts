import { expressPayment } from "@commercetools/checkout-browser-sdk";
import type { PaymentTemplateData } from "./session.ts";

export const mountExpressMethods = async (
  paymentData: PaymentTemplateData,
  options: {
    countryCode: string;
    currencyCode: string;
    onPayButtonClick: () => Promise<void>;
  },
): Promise<void> => {
  expressPayment.init({ ...paymentData, countryCode: options.countryCode });
  const methods = await expressPayment.getAvailableMethods();
  methods
    .forEach((method: any) =>
      expressPayment.mountMethod({
        expressId: method.type,
        method,
        initialAmount: {
          currencyCode: options.currencyCode,
          centAmount: 0,
          fractionDigits: 0,
        },
        onPayButtonClick: options.onPayButtonClick,
      }),
    );
};
