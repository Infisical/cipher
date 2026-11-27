import { Field } from "@infisical/cipher/ui/field";
import { Select, type SelectOption } from "@infisical/cipher/ui/select";

const accounts: SelectOption[] = [
  {
    value: "organization",
    label: "Organization account",
    description:
      "Infisical creates the decoy credentials in the AWS account your organization connected."
  }
];

export default function Example() {
  return (
    <div className="w-full max-w-sm min-w-0">
      <Field label="AWS account">
        <Select options={accounts} placeholder="Choose an AWS account" />
      </Field>
    </div>
  );
}
