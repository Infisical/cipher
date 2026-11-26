import { Field } from "@infisical/cipher/ui/field";
import { Select } from "@infisical/cipher/ui/select";

const options = [
  { value: "dev", label: "Development" },
  { value: "prod", label: "Production" }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <Field label="Environment">
        <Select
          options={options}
          defaultValue="prod"
          disabledReason="Imported secrets keep the environment they came from."
        />
      </Field>
    </div>
  );
}
