import { apiRoot } from "../clent/ctAPI.ts";
import type { ClientResponse } from "@commercetools/ts-client";
import type {
  Cart,
  CartDraft,
  CartUpdateAction,
} from "@commercetools/platform-sdk";

export const createCart = (cartDraft: CartDraft): Promise<ClientResponse<Cart>> =>
  apiRoot
    .carts()
    .post({ body: { ...cartDraft } })
    .execute();

export const getCart = (cartId: string): Promise<ClientResponse<Cart>> =>
  apiRoot.carts().withId({ ID: cartId }).get().execute();

export const updateCart = async (
  cartId: string,
  cartVersion: number,
  actions: CartUpdateAction[],
): Promise<ClientResponse<Cart>> => {
  return apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: { version: cartVersion, actions },
      queryArgs: { expand: ["discountCodes[*].discountCode"] },
    })
    .execute();
};
