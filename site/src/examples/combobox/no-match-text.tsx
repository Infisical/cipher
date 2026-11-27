import { Combobox, type ComboboxOption } from "@infisical/cipher/ui/combobox";
import { Field } from "@infisical/cipher/ui/field";

const connections: ComboboxOption[] = [
  { value: "aws-production", label: "aws-production", meta: "Access key" },
  { value: "aws-staging", label: "aws-staging", meta: "Assume role" }
];

export default function Example() {
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-wrap items-start gap-6">
        <Field label="AWS connection">
          <Combobox
            label="AWS connection"
            placeholder="Select a connection"
            options={[]}
            emptyText="No AWS connections yet."
            noMatchText="No connections match."
          />
        </Field>
        <Field label="AWS connection">
          <Combobox
            label="AWS connection"
            placeholder="Select a connection"
            options={connections}
            emptyText="No AWS connections yet."
            noMatchText="No connections match."
          />
        </Field>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"emptyText with no options at all, noMatchText when a search matches none"}
      </figcaption>
    </figure>
  );
}
