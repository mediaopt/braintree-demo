import { useState } from "react";
import {
  type CartCheckoutData,
  CartWrapper,
  type CheckoutMode,
} from "./components/CartWrapper";

function App() {
  const [flow, setFlow] = useState<CheckoutMode>("standard");
  const [checkoutData, setCheckoutData] = useState<CartCheckoutData | null>(
    null,
  );

  const flowLabels: Record<CheckoutMode, string> = {
    standard: "Standard",
    express: "Express",
    pureVault: "Pure Vault",
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between">
        {(["standard", "express", "pureVault"] as CheckoutMode[]).map((f) => (
          <label key={f} className="cursor-pointer">
            <input
              type="radio"
              value={f}
              checked={flow === f}
              onChange={() => setFlow(f)}
              className="mr-2"
            />
            {flowLabels[f]}
          </label>
        ))}
      </div>
      {checkoutData ? (
        <></>
      ) : (
        <CartWrapper mode={flow} triggerCheckout={setCheckoutData} />
      )}
    </div>
  );
}

export default App;
