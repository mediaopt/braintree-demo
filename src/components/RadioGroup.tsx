import type { FC, ReactNode } from "react";

export interface RadioOption {
  value: string;
  label: ReactNode;
}

interface RadioGroupProps {
  legend: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
}

export const RadioGroup: FC<RadioGroupProps> = ({ legend, name, options, value, onChange }) => (
  <fieldset>
    <legend className="font-medium text-sm mb-1">{legend}</legend>
    <div className="flex flex-col gap-1">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="mr-2"
          />
          {option.label}
        </label>
      ))}
    </div>
  </fieldset>
);
