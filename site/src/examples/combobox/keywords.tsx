import { useState } from "react";

import { Combobox, type ComboboxOption } from "@infisical/cipher/ui/combobox";
import { Field } from "@infisical/cipher/ui/field";

const products: ComboboxOption[] = [
  {
    value: "pro-monthly",
    label: "Pro, monthly",
    meta: "$18",
    group: "Self-serve",
    keywords: ["price_1QfPro0Monthly", "prod_SecretsPro"]
  },
  {
    value: "pro-yearly",
    label: "Pro, yearly",
    meta: "$180",
    group: "Self-serve",
    keywords: ["price_1QfPro0Yearly", "prod_SecretsPro"]
  },
  {
    value: "enterprise",
    label: "Enterprise",
    group: "Sales-led",
    keywords: ["price_1QfEnt0Custom", "prod_SecretsEnterprise"]
  },
  {
    value: "enterprise-gov",
    label: "Enterprise for government and regulated industries, annual commitment",
    group: "Sales-led",
    keywords: ["price_1QfEnt0FedRAMP", "FedRAMP", "GovCloud"]
  },
  {
    value: "pam-addon",
    label: "Privileged access add-on",
    group: "Add-ons",
    keywords: ["price_1QfPam0Seat", "PAM"]
  }
];

const Product = ({ label, initial }: { label: string; initial: string }) => {
  const [value, setValue] = useState(initial);
  return (
    <Field label={label}>
      <Combobox
        label={label}
        options={products}
        value={value}
        onChange={setValue}
        searchPlaceholder="Search products, groups or price IDs"
      />
    </Field>
  );
};

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <Product label="Product" initial="" />
      <Product label="Product" initial="pro-yearly" />
      <Product label="Product" initial="enterprise-gov" />
    </div>
  );
}
