import { apiRoot } from '../clent/ctAPI.ts';
import type { ClientResponse } from '@commercetools/ts-client';
import type { Cart, DiscountCode } from '@commercetools/platform-sdk';
import { updateCart } from './cart';

export const getDiscountCode = (discountCodeId: string): Promise<ClientResponse<DiscountCode>> =>
  apiRoot.discountCodes().withId({ ID: discountCodeId }).get().execute();

export const addDiscountCode = (cartId: string, code: string): Promise<ClientResponse<Cart>> =>
  updateCart(cartId, [{ action: 'addDiscountCode', code }]);

export const removeDiscountCode = (cartId: string, discountCodeId: string): Promise<ClientResponse<Cart>> =>
  updateCart(cartId, [{ action: 'removeDiscountCode', discountCode: { typeId: 'discount-code', id: discountCodeId } }]);
