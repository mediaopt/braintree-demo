import { apiRoot } from "../client/ctAPI.ts";
import type { Cart, Product } from "@commercetools/platform-sdk";
import type { ClientResponse } from "@commercetools/ts-client";

const productCache = new Map<string, Promise<Product>>();

export const getProduct = async (
  productId: string,
): Promise<{ body: Product }> => {
  if (!productCache.has(productId)) {
    productCache.set(
      productId,
      apiRoot.products().withId({ ID: productId }).get().execute().then((r) => r.body),
    );
  }
  return { body: await productCache.get(productId)! };
};

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
        actions: [{ action: "removeLineItem", lineItemId, quantity: 1 }],
      },
    })
    .execute();
};
