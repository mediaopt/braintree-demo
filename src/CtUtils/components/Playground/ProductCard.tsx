import { useEffect, useMemo, useState } from "react";
import type { Product } from "@commercetools/platform-sdk";
import {
  getProduct,
  addProductToCart,
  removeProductFromCart,
} from "../../services/products";
import { formatPrice } from "../../services/format";
import { Button } from "../Button.tsx";
import { loadExpress } from "../../../CheckoutLoader/loadExpress.ts";
import { useCart } from "../../context/CartContext.tsx";
import { cartDraftFromLocal } from "../../../helpers.ts";
import { createCart } from "../../services/cart.ts";

interface ProductCardProps {
  productId: string;
  isExpress?: boolean;
}

export const ProductCard = ({ productId, isExpress }: ProductCardProps) => {
  const { cart, setCart, localCartData } = useCart();
  const [product, setProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    getProduct(productId).then(({ body }) => setProduct(body));
  }, [productId]);

  const { lineItemId, currentQuantity } = useMemo(() => {
    const lineItem = cart?.lineItems.find((li) => li.productId === productId);
    return {
      lineItemId: lineItem?.id,
      currentQuantity: lineItem?.quantity ?? 0,
    };
  }, [cart?.lineItems, productId]);

  if (!product) return null;

  const { masterVariant, name, description } = product.masterData.current;
  const image = masterVariant.images?.[0];
  const price = masterVariant.prices?.[0]?.value;
  const displayName = (name["en"] ?? Object.values(name)[0]).replace(
    "Demo ",
    "",
  );
  const displayDescription = description
    ? (description["en"] ?? Object.values(description)[0])
    : "";

  const handleAdd = async () => {
    if (!cart) return;
    const { body } = await addProductToCart(cart.id, cart.version, productId);
    if (body) setCart(body);
  };

  const handleRemove = async () => {
    if (!cart) return;
    const { body } = await removeProductFromCart(
      cart.id,
      cart.version,
      lineItemId!,
    );
    if (body) setCart(body);
  };

  return (
    <div className="w-37.5 m-4 flex flex-col gap-2">
      {image && <img src={image.url} alt={displayName} className="h-50" />}
      <p>{displayName}</p>
      <p className="text-xs h-4">{displayDescription}</p>
      <div className="flex justify-between">
        {price && (
          <span>
            {formatPrice(
              price.centAmount,
              price.currencyCode,
              price.fractionDigits,
            )}
          </span>
        )}
        <span className="text-sm font-medium">(X: {currentQuantity})</span>
      </div>

      {isExpress ? (
        <div data-ctc-express="PayPal">
          <Button
            action={async () => {
              const newCart = (
                await createCart({
                  ...cartDraftFromLocal(localCartData),
                  lineItems: [{ productId, quantity: 1 }],
                })
              ).body;
              if (!newCart) throw new Error("Could not create cart");
              else {
                loadExpress({
                  cartId: newCart?.id,
                  cartDraft: cartDraftFromLocal(localCartData),
                });
              }
            }}
            title="Buy now"
          />
        </div>
      ) : (
        <div className="flex justify-between">
          <Button action={handleAdd} title="Add" />
          <Button action={handleRemove} disabled={!lineItemId} title="Remove" />
        </div>
      )}
    </div>
  );
};
