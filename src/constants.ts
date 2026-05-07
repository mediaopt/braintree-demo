import type { Address } from "@commercetools/platform-sdk";

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

export const ADDRESSES: Record<string, Address> = {
  DE: {
    firstName: "Max",
    lastName: "Mustermann",
    streetName: "Musterstraße",
    streetNumber: "1",
    postalCode: "10115",
    city: "Berlin",
    country: "DE",
  },
  US: {
    firstName: "John",
    lastName: "Doe",
    streetName: "Main Street",
    streetNumber: "123",
    postalCode: "10001",
    city: "New York",
    state: "NY",
    country: "US",
  },
};