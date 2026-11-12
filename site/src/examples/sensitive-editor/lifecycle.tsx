import { useState } from "react";

import { SensitiveEditor } from "@infisical/cipher/ui/sensitive-editor";

export default function Example() {
  const [revision, setRevision] = useState(0);
  const [value, setValue] = useState("fabricated-example-only");
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <SensitiveEditor
          stored={{ id: "fictional-value", revision: String(revision), hasValue: true }}
          label="Protected example value"
          onReveal={async () => value}
          onSave={async (draft) => {
            setValue(draft);
            setRevision((current) => current + 1);
          }}
        />
      </div>
      <figcaption className="text-muted-foreground text-xs">{"Reveal and replace"}</figcaption>
    </figure>
  );
}
