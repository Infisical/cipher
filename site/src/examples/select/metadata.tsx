import { Field } from "@infisical/cipher/ui/field";
import { Select } from "@infisical/cipher/ui/select";

const options = [
  { value: "west", label: "West", description: "2 projects" },
  {
    value: "long",
    label: "Long resource identifier",
    description: "environment_very_long_identifier_01234567890123456789"
  }
];
export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Region">
            <Select options={options} defaultValue="west" />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Menu at trigger width, metadata truncates"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Region">
            <Select
              options={options}
              defaultValue="west"
              menuWidth="min(32rem, calc(100vw - 2rem))"
            />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Long metadata, wide menu"}
        </figcaption>
      </figure>
    </div>
  );
}
