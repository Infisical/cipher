import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

const REASON = "The name is shared across environments. Rename it from the secret's row.";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <Field label="Editable">
        <Input mono defaultValue="DATABASE_URL" />
      </Field>
      <Field label="Read only">
        <Input mono readOnly defaultValue="DATABASE_URL" />
      </Field>
      <Field label="Disabled with a reason">
        <Input mono defaultValue="DATABASE_URL" disabledReason={REASON} />
      </Field>
      <Field label="Read only with a reason">
        <Input
          mono
          readOnly
          defaultValue="STRIPE_SECRET_KEY_FOR_THE_PAYMENTS_LEDGER_REPLICA"
          disabledReason={REASON}
        />
      </Field>
    </div>
  );
}
