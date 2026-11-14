import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Seats" description="Arrow keys step the value.">
            <Input type="number" min={1} defaultValue={25} />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"type=number, no native spin buttons"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Max identities">
            <Input type="number" icon="infinity" min={0} defaultValue={500} />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"type=number in a field box"}</figcaption>
      </figure>
    </div>
  );
}
