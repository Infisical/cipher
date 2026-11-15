import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { CodeEditor, type CodeEditorDialect } from "@infisical/cipher/ui/code-editor";
import { Field } from "@infisical/cipher/ui/field";
import { Select, type SelectOption } from "@infisical/cipher/ui/select";

const engines: SelectOption[] = [
  { value: "postgres", label: "PostgreSQL" },
  { value: "cockroachdb", label: "CockroachDB" },
  { value: "mysql", label: "MySQL" },
  { value: "snowflake", label: "Snowflake" },
  { value: "clickhouse", label: "ClickHouse" }
];

export default function Example() {
  const [dialect, setDialect] = useState<CodeEditorDialect>("postgres");
  const [query, setQuery] = useState(
    "-- Active sessions in the last day\nSELECT account_name, count(*) AS sessions\nFROM pam_sessions\nWHERE started_at > now() - interval '1 day'\n  AND status = 'active'\nGROUP BY account_name\nORDER BY sessions DESC\nLIMIT 20;"
  );
  const [selected, setSelected] = useState("");
  const [ran, setRan] = useState<string>();
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <Field label="Engine">
        <Select
          options={engines}
          value={dialect}
          onChange={(value) => setDialect(value as CodeEditorDialect)}
        />
      </Field>
      <Field label="Query">
        <CodeEditor
          value={query}
          onChange={setQuery}
          dialect={dialect}
          onRun={setRan}
          onSelectionChange={setSelected}
          placeholder="Write a query"
          rows={8}
        />
      </Field>
      <Button onClick={() => setRan(selected || query)} disabled={!query.trim()}>
        {selected ? "Run selection" : "Run"}
      </Button>
      <p role="status" className="text-sm">
        {ran === undefined ? "Press Mod+Enter to run." : `Ran ${ran.length} characters.`}
      </p>
    </div>
  );
}
