import type { ClientResponse } from "@commercetools/ts-client";
import type { Address, Cart } from "@commercetools/platform-sdk";
import { updateCart } from "./cart";

export const setCustomer = (
  cartId: string,
  customerId?: string,
): Promise<ClientResponse<Cart>> =>
  updateCart(cartId, [{ action: "setCustomerId", customerId }]);

export const setBillingAddress = (
  cartId: string,
  address: Address,
): Promise<ClientResponse<Cart>> =>
  updateCart(cartId, [{ action: "setBillingAddress", address }]);
