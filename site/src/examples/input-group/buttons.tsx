import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { Icon } from "@infisical/cipher/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from "@infisical/cipher/ui/input-group";

export default function Example() {
  const [values, setValues] = useState({
    xs: "draft",
    sm: "draft",
    "icon-xs": "draft",
    "icon-sm": "draft"
  });
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      {(["xs", "sm", "icon-xs", "icon-sm"] as const).map((size) => (
        <figure key={size} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <Field label={`${size} action`}>
              <InputGroup>
                <InputGroupInput
                  value={values[size]}
                  onChange={(event) => setValues({ ...values, [size]: event.target.value })}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size={size}
                    aria-label={`Clear ${size} draft`}
                    disabled={!values[size]}
                    onClick={() => setValues({ ...values, [size]: "" })}
                  >
                    {size.startsWith("icon") ? <Icon name="x" /> : "Clear"}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </div>
          <figcaption className="text-muted-foreground text-xs">{size}</figcaption>
        </figure>
      ))}
    </div>
  );
}
