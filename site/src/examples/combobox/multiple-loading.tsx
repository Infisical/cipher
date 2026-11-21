import { Combobox, type ComboboxOption } from "@infisical/cipher/ui/combobox";
import { Field } from "@infisical/cipher/ui/field";

const teams: ComboboxOption[] = [
  { value: "platform", label: "Platform" },
  { value: "payments", label: "Payments" },
  { value: "security", label: "Security" },
  { value: "growth", label: "Growth" },
  { value: "data", label: "Data infrastructure and analytics engineering" },
  { value: "support", label: "Customer support operations, Europe and Asia Pacific" },
  { value: "mobile", label: "Mobile" },
  { value: "sre", label: "Site reliability" }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Teams">
            <Combobox multiple label="Teams" placeholder="Choose teams" options={[]} loading />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"loading, nothing selected"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Teams">
            <Combobox
              multiple
              label="Teams"
              placeholder="Choose teams"
              options={teams.slice(0, 3)}
              defaultValue={["platform", "payments"]}
              loading
            />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"loading, chips stay removable"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Teams">
            <Combobox
              multiple
              label="Teams"
              placeholder="Choose teams"
              options={teams}
              defaultValue={["platform", "payments", "security", "data", "support", "sre"]}
            />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"loaded, many long chips"}
        </figcaption>
      </figure>
    </div>
  );
}
