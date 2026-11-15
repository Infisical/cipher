import { useState } from "react";

import { CodeEditor } from "@infisical/cipher/ui/code-editor";
import { Field } from "@infisical/cipher/ui/field";

const long = [
  "-- Weekly break-glass usage per account, with the longest session and the approver who signed off on it, for the compliance export",
  "SELECT",
  "  toStartOfWeek(s.started_at) AS week,",
  "  s.account_name,",
  "  countIf(s.break_glass = 1) AS break_glass_sessions,",
  "  max(dateDiff('second', s.started_at, s.ended_at)) AS longest_seconds,",
  "  anyLast(a.approver_email) AS approver",
  "FROM pam.sessions AS s FINAL",
  "LEFT JOIN pam.approvals AS a ON a.request_id = s.request_id AND a.decision = 'approved' AND a.approver_email NOT LIKE '%@service-accounts.internal.example.com'",
  "PREWHERE s.started_at >= now() - INTERVAL 90 DAY",
  "WHERE s.account_name IN ('payments-ledger-replication-readwrite-us-east-1-primary', 'analytics-warehouse-loader')",
  "GROUP BY week, s.account_name",
  "ORDER BY week DESC, break_glass_sessions DESC",
  "SETTINGS max_execution_time = 30;",
  ...Array.from(
    { length: 12 },
    (_, index) => `-- partition ${index + 1}: SELECT count() FROM pam.sessions_${index + 1};`
  )
].join("\n");

export default function Example() {
  const [query, setQuery] = useState(long);
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <Field label="ClickHouse query, long lines wrap and the editor scrolls past 12 lines">
        <CodeEditor
          value={query}
          onChange={setQuery}
          dialect="clickhouse"
          className="max-h-80 overflow-auto"
          rows={12}
        />
      </Field>
    </div>
  );
}
