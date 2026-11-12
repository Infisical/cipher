import * as UI from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { Inline } from "@infisical/cipher/ui/layout";
import { GlobPatternHelp, SecretPathInput } from "@infisical/cipher/ui/secret-path-input";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <UI.FieldGroup>
        <UI.Field
          label="Lease TTL"
          help="How long a generated credential stays valid before it is revoked."
        >
          <Input mono defaultValue="1h" />
        </UI.Field>
        <UI.Field label="Secret path" help={<GlobPatternHelp />}>
          <SecretPathInput defaultValue="/app/**" />
        </UI.Field>
        <UI.Field>
          <Inline gap={4} wrap={false}>
            <UI.FieldLabel htmlFor="field-help-role">Role slug</UI.FieldLabel>
            <UI.FieldHelp label="About role slugs">
              Lowercase letters, numbers and hyphens.
            </UI.FieldHelp>
          </Inline>
          <Input id="field-help-role" mono defaultValue="read-only" />
        </UI.Field>
      </UI.FieldGroup>
    </div>
  );
}
