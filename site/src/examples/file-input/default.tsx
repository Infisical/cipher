import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { FileInput } from "@infisical/cipher/ui/file-input";

export default function Example() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <figure className="m-0 flex w-full max-w-xl min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <Field label="Key file">
          <FileInput
            accept=".json,application/json"
            maxSize={1024 * 1024}
            files={files}
            onFiles={setFiles}
            onRemove={() => setFiles([])}
          />
        </Field>
      </div>
      <figcaption className="text-muted-foreground text-xs">{"Empty, one file"}</figcaption>
    </figure>
  );
}
