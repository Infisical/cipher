import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import * as UI from "@infisical/cipher/ui/sheet";

export default function Example() {
  const [step, setStep] = useState(1);
  const [region, setRegion] = useState("us-east-1");
  const [accessKey, setAccessKey] = useState("AKIAIOSFODNN7EXAMPLE");
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <UI.Sheet onOpenChange={(open) => open && setStep(1)}>
        <UI.SheetTrigger asChild>
          <Button variant="outline">Add AWS KMS</Button>
        </UI.SheetTrigger>
        <UI.SheetContent>
          <UI.SheetHeader>
            <UI.SheetTitle>{step === 1 ? "Choose a region" : "Add credentials"}</UI.SheetTitle>
          </UI.SheetHeader>
          <UI.SheetBody>
            {step === 1 ? (
              <Field key="region" label="Region">
                <Input value={region} onChange={(event) => setRegion(event.target.value)} />
              </Field>
            ) : (
              <Field key="access-key" label="Access key ID">
                <Input value={accessKey} onChange={(event) => setAccessKey(event.target.value)} />
              </Field>
            )}
          </UI.SheetBody>
          <UI.SheetFooter
            start={
              step > 1 && (
                <Button variant="ghost" icon="chev-left" onClick={() => setStep(1)}>
                  Back
                </Button>
              )
            }
          >
            <UI.SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </UI.SheetClose>
            {step === 1 ? (
              <Button onClick={() => setStep(2)}>Continue</Button>
            ) : (
              <UI.SheetClose asChild>
                <Button>Add</Button>
              </UI.SheetClose>
            )}
          </UI.SheetFooter>
        </UI.SheetContent>
      </UI.Sheet>
    </div>
  );
}
