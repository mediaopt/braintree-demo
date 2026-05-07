import { apiRoot } from "../clent/ctAPI.ts";
import type { ClientResponse } from "@commercetools/ts-client";
import type { ShippingMethodPagedQueryResponse } from "@commercetools/platform-sdk";

export const getShippingMethods = (
  cartId: string,
): Promise<ClientResponse<ShippingMethodPagedQueryResponse>> =>
  apiRoot.shippingMethods().get({ queryArgs: { cartId } }).execute();
