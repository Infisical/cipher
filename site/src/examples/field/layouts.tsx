import { Field, FieldGroup } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  return (
    <FieldGroup>
      {(["vertical", "horizontal"] as const).map((orientation) => (
        <figure key={orientation} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
            <Field orientation={orientation} label="Name">
              <Input aria-label={`${orientation} name`} defaultValue="staging" />
            </Field>
          </div>
          <figcaption className="text-muted-foreground text-xs">{orientation}</figcaption>
        </figure>
      ))}
    </FieldGroup>
  );
}
