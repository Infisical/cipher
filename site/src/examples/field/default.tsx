import * as UI from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <UI.FieldGroup>
        <UI.Field label="Connection name" description="Shown in activity logs.">
          <Input defaultValue="Production vault" />
        </UI.Field>
        <UI.Field label="Service account" error="Choose an account with read access.">
          <Input defaultValue="" />
        </UI.Field>
        <UI.Field>
          <UI.FieldLabel htmlFor="field-project">Project name</UI.FieldLabel>
          <Input id="field-project" defaultValue="payments" />
          <UI.FieldDescription>
            Use a name your team recognizes. <a href="https://infisical.com/docs">Naming guide</a>
          </UI.FieldDescription>
        </UI.Field>
      </UI.FieldGroup>
    </div>
  );
}
