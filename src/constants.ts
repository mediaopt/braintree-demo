export const DEFAULT_CUSTOMER_ID = "2d83f470-fb59-4f9e-ab71-dd27b30ef266";

export const CART_CURRENCY = "EUR";
export const CART_COUNTRY = "DE";

export interface DiscountCodeEntry {
  code: string;
  name: string;
  description: string;
}

export const DISCOUNT_CODES: DiscountCodeEntry[] = [
  {
    code: "demo-cart-discount",
    name: "10% off",
    description: "General demo discount",
  },
];
