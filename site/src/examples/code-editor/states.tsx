import { useState } from "react";

import { CodeEditor } from "@infisical/cipher/ui/code-editor";
import { Field } from "@infisical/cipher/ui/field";

export default function Example() {
  const [draft, setDraft] = useState("");
  const [broken, setBroken] = useState("SELEC id FROM accounts WHERE;");
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <Field label="Empty">
        <CodeEditor
          value={draft}
          onChange={setDraft}
          placeholder="SELECT * FROM accounts LIMIT 10;"
        />
      </Field>
      <Field label="Read-only" description="Generated from the table you picked.">
        <CodeEditor
          readOnly
          rows={3}
          value={"SELECT id, name, created_at\nFROM public.accounts\nLIMIT 100;"}
        />
      </Field>
      <Field label="With an error" error='syntax error at or near "SELEC"'>
        <CodeEditor value={broken} onChange={setBroken} rows={3} />
      </Field>
    </div>
  );
}
