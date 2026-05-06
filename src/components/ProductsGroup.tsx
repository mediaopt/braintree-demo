import type { Cart } from "@commercetools/platform-sdk";
import { ProductCard } from "./ProductCard";
import { GroupWrapper } from "./StandardCheckout/GroupWrapper.tsx";

const PRODUCT_IDS = [
  "c663228f-b7e9-4000-813d-af8513fde4c4",
  "2117bafa-7b7b-4200-bc0f-cf8b4fea88d4",
  "827bdeed-fbb2-4000-b688-50fb3aabda12",
  //"1da5a570-03bc-4200-82a3-e983d668b821",
  "9b29008d-504b-4700-b620-31101064c89c",
];

interface ProductsGroupProps {
  cart?: Cart;
  onMoveProduct?: (cart?: Cart) => void;
  onBuyNow?: (productId: string) => Promise<void>;
}

export const ProductsGroup = ({
  cart,
  onMoveProduct,
  onBuyNow,
}: ProductsGroupProps) => {
  return (
    <GroupWrapper
      title={onBuyNow ? "Choose product to buy now" : "Choose cart product(s)"}
    >
      <div className="flex p-4 mx-auto justify-between">
        {PRODUCT_IDS.map((productId) => (
          <ProductCard
            key={productId}
            productId={productId}
            cart={cart}
            onMoveProduct={onMoveProduct}
            onBuyNow={onBuyNow ? () => onBuyNow(productId) : undefined}
          />
        ))}
      </div>
    </GroupWrapper>
  );
};
