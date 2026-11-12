import * as React from "react";

import { Code } from "@infisical/cipher/ui/code";
import * as UI from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { Highlight } from "@infisical/cipher/ui/text";

const variables = [
  { key: "SMTP_HOST", description: "Hostname of the SMTP server that sends invites and alerts." },
  { key: "SMTP_PORT", description: "Port the SMTP server listens on, usually 587." }
];

export default function Example() {
  const [query, setQuery] = React.useState("smtp");
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <Input
        aria-label="Search keys and descriptions"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <UI.FieldGroup>
        {variables.map((variable) => (
          <UI.Field
            key={variable.key}
            label={
              <Code>
                <Highlight text={variable.key} query={query} />
              </Code>
            }
            description={<Highlight text={variable.description} query={query} />}
          >
            <Input defaultValue="" />
          </UI.Field>
        ))}
      </UI.FieldGroup>
    </div>
  );
}
