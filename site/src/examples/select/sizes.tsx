import { Field } from "@infisical/cipher/ui/field";
import { Select } from "@infisical/cipher/ui/select";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      {(["default", "md", "lg"] as const).map((size) => (
        <figure key={size} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <Field label={`${size} region`}>
              <Select
                size={size}
                options={[
                  { value: "west", label: "West" },
                  { value: "east", label: "East" }
                ]}
                defaultValue="west"
              />
            </Field>
          </div>
          <figcaption className="text-muted-foreground text-xs">
            {size === "default" ? "default, sm" : size}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
