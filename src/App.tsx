import { useState } from "react";
import {
  Playground,
  type CheckoutMode,
} from "./CtUtils/components/Playground/Playground";

function App() {
  const [flow, setFlow] = useState<CheckoutMode>("standard");

  const flowLabels: Record<CheckoutMode, string> = {
    standard: "Standard",
    express: "Express",
    pureVault: "Vault Without Payment",
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
      <Playground mode={flow} />
    </div>
  );
}

export default App;
