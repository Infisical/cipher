import { Checkbox } from "@infisical/cipher/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet
} from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  return (
    <FieldGroup>
      <Field label="Description" optional>
        <Input placeholder="Purpose of this connection" />
      </Field>
      <Field label="Notifications" group description="Choose where to send local audit events.">
        <div className="space-y-3">
          <Checkbox label="Deployments" defaultChecked />
          <Checkbox label="Access changes" />
        </div>
      </Field>
      <FieldSeparator>Ownership</FieldSeparator>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <FieldSet>
            <FieldLegend>Service ownership</FieldLegend>
            <Field label="Owner">
              <Input defaultValue="platform" />
            </Field>
          </FieldSet>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"legend"}</figcaption>
      </figure>
      <Field>
        <FieldLabel htmlFor="field-multiple">Change request</FieldLabel>
        <Input
          id="field-multiple"
          required
          minLength={12}
          aria-invalid="true"
          aria-describedby="field-multiple-error"
        />
        <FieldError
          id="field-multiple-error"
          errors={[
            { message: "Use at least 12 characters." },
            { message: "Enter a change reason." },
            { message: "Use at least 12 characters." }
          ]}
        />
      </Field>
    </FieldGroup>
  );
}
