import { useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from "@infisical/cipher/ui/input-otp";
import { Label } from "@infisical/cipher/ui/label";

export default function Example() {
  const [value, setValue] = useState("");
  const [completed, setCompleted] = useState("");
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <Label htmlFor="alphanumeric-code">Recovery code</Label>
        <InputOTP
          id="alphanumeric-code"
          maxLength={4}
          pattern="^[A-Z0-9]+$"
          inputMode="text"
          value={value}
          onChange={(next) => {
            setValue(next);
            setCompleted("");
          }}
          onComplete={setCompleted}
          pasteTransformer={(text) => text.replaceAll("-", "").toUpperCase()}
          containerClassName="flex-wrap"
        >
          <InputOTPGroup>
            {[0, 1].map((index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            {[2, 3].map((index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <p className="text-sm">Letters A to Z and digits 0 to 9.</p>
        <p role="status" className="sr-only text-sm">
          {completed ? `Local code complete: ${completed}` : `${value.length} of 4 characters`}
        </p>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"Alphanumeric recovery code"}
      </figcaption>
    </figure>
  );
}
