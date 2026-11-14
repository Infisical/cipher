import { useState } from "react";

import { RadioGroup, RadioGroupItem } from "@infisical/cipher/ui/radio-group";

const terms = [
  { value: "monthly", label: "Monthly", description: "Billed on the 1st." },
  {
    value: "quarterly",
    label: "Quarterly",
    description: "Billed every 3 months.",
  },
  { value: "annual", label: "Annual", description: "Two months free." },
];

export default function Example() {
  const [term, setTerm] = useState("annual");
  return (
    <RadioGroup
      aria-label="Billing term"
      columns={3}
      value={term}
      onValueChange={setTerm}
    >
      {terms.map((option) => (
        <RadioGroupItem
          key={option.value}
          value={option.value}
          label={option.label}
          description={option.description}
        />
      ))}
    </RadioGroup>
  );
}
