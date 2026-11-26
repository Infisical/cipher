import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { TagsInput } from "@infisical/cipher/ui/tags-input";

const template = "{{ project }}.acme.test";

export default function Example() {
  const [hosts, setHosts] = useState(["api.acme.test"]);
  const [draft, setDraft] = useState(template);
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-3">
      <Field label="Allowed hosts" description="Replace the placeholder, then press Enter.">
        <TagsInput
          label="Allowed hosts"
          mono
          value={hosts}
          onChange={setHosts}
          draft={draft}
          onDraftChange={setDraft}
        />
      </Field>
      <Button variant="outline" size="sm" onClick={() => setDraft(template)}>
        Insert template
      </Button>
    </div>
  );
}
