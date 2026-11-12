import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Environment name">
            <Input />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Empty"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Managed account" description="Set by the connected provider.">
            <Input readOnly value="deploy-production" />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Read-only"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Environment name">
            <Input disabled defaultValue="Inherited from policy" />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Disabled"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Environment slug" error="Use letters, numbers and hyphens.">
            <Input invalid defaultValue="production /" />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Invalid"}</figcaption>
      </figure>
    </div>
  );
}
