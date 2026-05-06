import type { Cart } from "@commercetools/platform-sdk";
import { ProductCard } from "./ProductCard";
import { GroupWrapper } from "./CartSettings/GroupWrapper.tsx";

export const PRODUCTS = [
  {
    id: "c663228f-b7e9-4000-813d-af8513fde4c4",
    description: "Standard",
  },
  { id: "2117bafa-7b7b-4200-bc0f-cf8b4fea88d4", description: "Get 1 free" },
  {
    id: "827bdeed-fbb2-4000-b688-50fb3aabda12",
    description: "-0.10 (this item)",
  },
  {
    id: "9b29008d-504b-4700-b620-31101064c89c",
    description: "-3% (cart)",
  },
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
        {PRODUCTS.map(({ id }) => (
          <ProductCard
            key={id}
            productId={id}
            cart={cart}
            onMoveProduct={onMoveProduct}
            onBuyNow={onBuyNow ? () => onBuyNow(id) : undefined}
          />
        ))}
      </div>
    </GroupWrapper>
  );
};
