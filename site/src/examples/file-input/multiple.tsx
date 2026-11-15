import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { FileInput } from "@infisical/cipher/ui/file-input";

const sample = (name: string, size: number, type = "") =>
  new File([new Uint8Array(size)], name, { type });

export default function Example() {
  const [files, setFiles] = useState(() => [
    sample(".env.production", 2_140),
    sample("secrets.json", 18_400, "application/json"),
    sample("staging.yaml", 6_820, "application/yaml")
  ]);
  return (
    <figure className="m-0 flex w-full max-w-xl min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <Field label="Secret files">
          <FileInput
            multiple
            accept=".env,.json,.yaml,.yml,.csv"
            maxSize={5 * 1024 * 1024}
            files={files}
            onFiles={(added) => setFiles((current) => [...current, ...added])}
            onRemove={(_file, index) =>
              setFiles((current) => current.filter((_, position) => position !== index))
            }
          />
        </Field>
      </div>
      <figcaption className="text-muted-foreground text-xs">{"Typical, several files"}</figcaption>
    </figure>
  );
}
