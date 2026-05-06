import { apiRoot } from "../clent/ctAPI.ts";
import type { ClientResponse } from "@commercetools/ts-client";
import type { Cart, Product } from "@commercetools/platform-sdk";

export const getProduct = (
  productId: string,
): Promise<ClientResponse<Product>> =>
  apiRoot.products().withId({ ID: productId }).get().execute();

export const addProductToCart = async (
  cartId: string,
  cartVersion: number,
  productId: string,
  quantity: number = 1,
): Promise<ClientResponse<Cart>> => {
  return apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: cartVersion,
        actions: [{ action: "addLineItem", productId, variantId: 1, quantity }],
      },
    })
    .execute();
};

export const removeProductFromCart = async (
  cartId: string,
  cartVersion: number,
  lineItemId: string,
): Promise<ClientResponse<Cart>> => {
  return apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: cartVersion,
        actions: [{ action: "removeLineItem", lineItemId }],
      },
    })
    .execute();
};
