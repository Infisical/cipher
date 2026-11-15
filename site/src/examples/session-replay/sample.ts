import type { SessionReplayEvent } from "@infisical/cipher/ui/session-replay";

type SessionEvent = {
  timestamp: string;
  eventType: "input" | "output" | "resize" | "error";
  channelType?: "terminal" | "exec" | "sftp" | "rdp";
  data: string;
  rendered?: boolean;
  elapsedTime: number;
};

type BrokenChunkMarker = {
  __brokenChunk: true;
  chunkIndex: number;
  reason: string;
  message: string;
};

export type RdpRecord = {
  type: "keyboard" | "unicode" | "mouse" | "target_frame";
  elapsedNs: number;
  x?: number;
  y?: number;
  flags?: number;
  codePoint?: number;
  window?: string;
};

export type TerminalReplayEvent = SessionReplayEvent & { output: string };
export type RdpReplayEvent = SessionReplayEvent & { record?: RdpRecord };

const encode = (text: string) => btoa(String.fromCharCode(...new TextEncoder().encode(text)));
const decode = (data: string) =>
  new TextDecoder().decode(Uint8Array.from(atob(data), (char) => char.charCodeAt(0)));

const started = Date.parse("2026-11-14T17:02:00Z");
const sessionEvent = (
  seconds: number,
  eventType: SessionEvent["eventType"],
  text: string,
  channelType: SessionEvent["channelType"] = "terminal"
): SessionEvent => ({
  timestamp: new Date(started + seconds * 1000).toISOString(),
  eventType,
  channelType,
  data: encode(text),
  rendered: true,
  elapsedTime: seconds
});

const DESTRUCTIVE = ["DROP ", "DELETE ", "TRUNCATE ", "ALTER "];

export const toTerminalEvents = (
  log: readonly (SessionEvent | BrokenChunkMarker)[]
): TerminalReplayEvent[] => {
  let lastTime = 0;
  return log.map((entry) => {
    if ("__brokenChunk" in entry)
      return { time: lastTime, label: entry.message, kind: "chunk", tone: "bad", output: "" };
    lastTime = entry.elapsedTime * 1000;
    const text = decode(entry.data);
    const line = text.trim();
    const destructive = DESTRUCTIVE.some((prefix) => line.toUpperCase().startsWith(prefix));
    return {
      time: lastTime,
      label: entry.eventType === "resize" ? "" : line.split("\n")[0],
      kind: entry.eventType,
      tone: entry.eventType === "error" ? "bad" : destructive ? "warn" : undefined,
      listed: entry.eventType === "input" || entry.eventType === "error",
      output: entry.eventType === "output" || entry.eventType === "error" ? text : ""
    };
  });
};

const shell: [number, string, string][] = [
  [1.2, "whoami", "deploy"],
  [
    4.8,
    "cd /srv/payments && git log --oneline -3",
    "9f2dc78 Bump ledger client\ned2084c Retry settlement webhooks\nf44aade Rotate signing key"
  ],
  [
    14.5,
    "systemctl status payments-api",
    "payments-api.service - Payments API\n   Active: active (running) since Fri 2026-11-14 08:11:02 UTC; 8h ago"
  ],
  [
    31,
    "journalctl -u payments-api --since '10 min ago' | tail -4",
    "17:01:12 settlement batch 4411 queued\n17:01:40 settlement batch 4411 sent\n17:01:58 webhook 200 from acquirer\n17:02:03 settlement batch 4411 settled"
  ],
  [52.4, "sudo systemctl restart payments-api", ""],
  [58, "curl -s localhost:8080/healthz", '{"status":"ok","version":"2.14.1"}'],
  [76.3, "cat /etc/payments/limits.conf", "max_batch=500\nretry_after=30s"],
  [97, "vim /etc/payments/limits.conf", ""],
  [128.6, "sudo systemctl reload payments-api", ""],
  [142, "exit", "logout"]
];

export const terminalLog: SessionEvent[] = [
  sessionEvent(0, "resize", "120x32"),
  sessionEvent(0.2, "output", "deploy@payments-prod-01:~$ "),
  ...shell.flatMap(([seconds, command, output]) => [
    sessionEvent(seconds, "input", command),
    sessionEvent(
      seconds + 0.4,
      "output",
      `${command}\n${output ? `${output}\n` : ""}deploy@payments-prod-01:/srv/payments$ `
    )
  ])
];

const tables = [
  "ledger_entries",
  "settlement_batches",
  "merchant_payout_schedules_archive_2025_q4",
  "webhook_deliveries",
  "acquirer_reconciliation_snapshots"
];
const queries = [
  (table: string) =>
    `SELECT id, merchant_id, amount_minor, currency, settled_at FROM ${table} WHERE settled_at > now() - interval '7 days' AND status = 'pending_reconciliation' ORDER BY settled_at DESC LIMIT 200;`,
  (table: string) => `SELECT count(*) FROM ${table};`,
  (table: string) =>
    `UPDATE ${table} SET status = 'retry', retry_after = now() + interval '30 seconds' WHERE status = 'failed' AND attempts < 5;`,
  (table: string) =>
    `EXPLAIN ANALYZE SELECT * FROM ${table} t JOIN merchants m ON m.id = t.merchant_id WHERE m.region = 'eu-west-1';`
];

const deleteQuery = (table: string) =>
  `DELETE FROM ${table} WHERE created_at < now() - interval '400 days';`;

export const stressedLog = (() => {
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const log: (SessionEvent | BrokenChunkMarker)[] = [sessionEvent(0, "resize", "240x64")];
  let seconds = 0.4;
  for (let index = 0; index < 600; index += 1) {
    seconds += 4 + random() * 22;
    const table = tables[Math.floor(random() * tables.length)];
    const query = (random() < 0.03 ? deleteQuery : queries[Math.floor(random() * queries.length)])(
      table
    );
    log.push(sessionEvent(seconds, "input", query));
    if (index === 240)
      log.push({
        __brokenChunk: true,
        chunkIndex: 14,
        reason: "missing",
        message: "Chunk 14 was not found in the recording"
      });
    if (random() < 0.03)
      log.push(
        sessionEvent(
          seconds + 0.3,
          "error",
          `ERROR:  permission denied for table ${table}\nDETAIL:  role "contractor_readonly_reporting" lacks UPDATE on schema payments_core\n`
        )
      );
    else
      log.push(
        sessionEvent(seconds + 0.3, "output", `${query}\n(${Math.floor(random() * 900)} rows)\n`)
      );
  }
  return log;
})();

const rdp = (seconds: number, record: Omit<RdpRecord, "elapsedNs">): SessionEvent =>
  sessionEvent(seconds, "input", JSON.stringify({ ...record, elapsedNs: seconds * 1e9 }), "rdp");

const typed = (seconds: number, text: string) =>
  [...text].map((char, index) =>
    rdp(seconds + index * 0.18, { type: "unicode", codePoint: char.codePointAt(0) })
  );

export const rdpLog: SessionEvent[] = [
  rdp(0, { type: "target_frame", window: "desktop" }),
  rdp(2.1, { type: "mouse", x: 120, y: 1040, flags: 0x9000 }),
  rdp(3.4, { type: "target_frame", window: "Start" }),
  ...typed(5, "notepad"),
  rdp(7.2, { type: "keyboard", flags: 0 }),
  rdp(8, { type: "target_frame", window: "Notepad" }),
  rdp(11.3, { type: "mouse", x: 860, y: 420, flags: 0x9000 }),
  ...typed(13, "rotate svc-backup key"),
  rdp(24.6, { type: "mouse", x: 1460, y: 300, flags: 0x9000 }),
  rdp(25, { type: "target_frame", window: "Services" }),
  rdp(39.2, { type: "mouse", x: 1180, y: 610, flags: 0x9000 }),
  rdp(41, { type: "target_frame", window: "Services: Backup Agent stopped" }),
  rdp(58, { type: "target_frame", window: "desktop" })
];

const describeRdp = (record: RdpRecord) => {
  if (record.type === "mouse") return { kind: "mouse", label: `Click at ${record.x}, ${record.y}` };
  if (record.type === "unicode" || record.type === "keyboard")
    return { kind: "key", label: "Enter" };
  return { kind: "frame", label: `Window: ${record.window}` };
};

export const toRdpEvents = (log: readonly SessionEvent[]): RdpReplayEvent[] => {
  const records = log
    .filter((entry) => entry.channelType === "rdp")
    .map((entry) => JSON.parse(decode(entry.data)) as RdpRecord);
  return records.map((record, index) => {
    const event = { time: record.elapsedNs / 1e6, ...describeRdp(record), record };
    if (record.type !== "unicode") return event;
    if (records[index - 1]?.type === "unicode") return { ...event, listed: false };
    let keys = 0;
    while (records[index + keys]?.type === "unicode") keys += 1;
    return { ...event, label: `Typing, ${keys} keys` };
  });
};
