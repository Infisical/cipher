import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { Icon } from "@infisical/cipher/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from "@infisical/cipher/ui/input-group";

const SizedField = ({ size }: { size: "sm" | "md" | "lg" }) => {
  const [value, setValue] = useState("/payments");
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <Field label={`${size} path`}>
          <InputGroup size={size}>
            <InputGroupAddon>
              <Icon name="search" />
            </InputGroupAddon>
            <InputGroupInput value={value} onChange={(event) => setValue(event.target.value)} />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="sm" disabled={!value} onClick={() => setValue("")}>
                Clear
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </div>
      <figcaption className="text-muted-foreground text-xs">{size}</figcaption>
    </figure>
  );
};

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      {(["sm", "md", "lg"] as const).map((size) => (
        <SizedField key={size} size={size} />
      ))}
    </div>
  );
}
