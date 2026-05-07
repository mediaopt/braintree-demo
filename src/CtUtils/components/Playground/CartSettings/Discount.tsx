import { useState } from 'react';
import { DISCOUNT_CODES } from '../../../../constants';
import type { OnLocalCartUpdate } from '../Playground';

interface DiscountProps {
  onCartUpdate: OnLocalCartUpdate;
}

export const Discount = ({ onCartUpdate }: DiscountProps) => {
  const [checkedCodes, setCheckedCodes] = useState<string[]>([]);

  const handleChange = (code: string, checked: boolean) => {
    const newCodes = checked
      ? [...checkedCodes, code]
      : checkedCodes.filter((c) => c !== code);
    setCheckedCodes(newCodes);
    onCartUpdate({ discountCodes: newCodes });
  };

  return (
    <fieldset>
      <legend className="font-medium text-sm mb-1">Discounts</legend>
      <div className="flex flex-col gap-1">
        {DISCOUNT_CODES.map(({ code, name }) => (
          <label key={code} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={checkedCodes.includes(code)}
              onChange={(e) => handleChange(code, e.target.checked)}
              className="mr-2"
            />
            {name}
          </label>
        ))}
      </div>
    </fieldset>
  );
};
