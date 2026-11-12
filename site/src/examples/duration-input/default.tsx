import { useState } from "react";

import { DurationInput } from "@infisical/cipher/ui/duration-input";
import { Field } from "@infisical/cipher/ui/field";

export default function Example() {
  const [duration, setDuration] = useState("1h");
  const [empty, setEmpty] = useState("");
  const [invalid, setInvalid] = useState("0m");
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Duration">
            <DurationInput value={duration} onChange={setDuration} />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {duration ? `Controlled, value ${duration}` : "Controlled, value empty"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Request expiration" optional>
            <DurationInput value={empty} onChange={setEmpty} placeholder="72" />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Empty"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Duration" error="Enter a duration greater than 0.">
            <DurationInput value={invalid} onChange={setInvalid} invalid />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Invalid"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Max time period">
            <DurationInput value="7d" onChange={() => undefined} disabled />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Disabled"}</figcaption>
      </figure>
    </div>
  );
}
