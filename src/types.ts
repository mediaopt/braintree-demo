export type CartCheckoutData = {
  cartId: string;
  currencyCode: string;
  countryCode: string;
  mode: BraintreeCheckoutMode;
};

export type BraintreeCheckoutMode =
  | "fullCheckout"
  | "paymentOnly"
  | "express"
  | "pureVault";
