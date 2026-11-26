import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { MultiSelect } from "@infisical/cipher/ui/multi-select";

export default function Example() {
  const [folders, setFolders] = useState<string[]>([]);
  return (
    <div className="w-full max-w-sm min-w-0">
      <Field label="Folders">
        <MultiSelect
          label="Folders"
          placeholder="Choose folders"
          options={[]}
          value={folders}
          onChange={setFolders}
          emptyText="Couldn't load folders. Try again later."
        />
      </Field>
    </div>
  );
}
