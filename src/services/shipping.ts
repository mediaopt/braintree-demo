import { apiRoot } from "../clent/ctAPI.ts";
import type { ClientResponse } from "@commercetools/ts-client";
import type { Cart, ShippingMethodPagedQueryResponse } from "@commercetools/platform-sdk";
import { updateCart } from "./cart";

export const getShippingMethods = (
  cartId: string,
): Promise<ClientResponse<ShippingMethodPagedQueryResponse>> =>
  apiRoot.shippingMethods().get({ queryArgs: { cartId } }).execute();

export const setShippingMethod = (
  cartId: string,
  cartVersion: number,
  shippingMethodId: string | undefined,
): Promise<ClientResponse<Cart>> =>
  updateCart(cartId, cartVersion, [
    {
      action: "setShippingMethod",
      shippingMethod: { id: shippingMethodId, typeId: "shipping-method" },
    },
  ]);

export const setShippingAddress = (
  cartId: string,
  cartVersion: number,
  address: Cart["shippingAddress"],
): Promise<ClientResponse<Cart>> =>
  updateCart(cartId, cartVersion, [{ action: "setShippingAddress", address }]);
