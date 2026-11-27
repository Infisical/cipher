import * as React from "react";
import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { MultiStep } from "@infisical/cipher/ui/multi-step";
import { toast } from "@infisical/cipher/ui/sonner";

const Flow = ({
  variant,
  trigger
}: {
  variant: "dialog" | "sheet";
  trigger: React.ReactElement;
}) => {
  const [name, setName] = useState("");
  const [path, setPath] = useState("/");
  return (
    <MultiStep
      variant={variant}
      layout="aside"
      title="New folder"
      trigger={trigger}
      completeLabel="Create folder"
      onComplete={() => {
        toast(`Created ${name || "the folder"}.`);
      }}
      steps={[
        {
          title: "Name",
          summary: name || undefined,
          aside: { description: "Shown in the secrets list and in secret paths." },
          content: (
            <Field label="Folder name">
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="payments"
              />
            </Field>
          )
        },
        {
          title: "Location",
          aside: { description: "The folder this one sits in." },
          content: (
            <Field label="Parent path">
              <Input value={path} onChange={(event) => setPath(event.target.value)} />
            </Field>
          )
        },
        {
          title: "Review",
          aside: { description: "Nothing is created until you confirm." },
          content: (
            <p className="m-0 text-sm">
              Creates {path.replace(/\/$/, "")}/{name || "folder"}.
            </p>
          )
        }
      ]}
    />
  );
};

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-wrap items-start gap-3">
      <Flow variant="sheet" trigger={<Button variant="outline">New folder in a sheet</Button>} />
      <Flow variant="dialog" trigger={<Button variant="outline">New folder in a dialog</Button>} />
    </div>
  );
}
