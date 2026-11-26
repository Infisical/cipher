import { Button } from "@infisical/cipher/ui/button";
import { Card } from "@infisical/cipher/ui/card";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { DetailLayout } from "@infisical/cipher/ui/layout";
import { DataList, type DataListItem } from "@infisical/cipher/ui/list";
import { CopyValue } from "@infisical/cipher/ui/sensitive-editor";

type Run = { id: string; trigger: string; status: string; finished: string };

const runs: Run[] = [
  { id: "r1", trigger: "Schedule", status: "Succeeded", finished: "4 minutes ago" },
  {
    id: "r2",
    trigger: "Manual by sarah.lin@example.com",
    status: "Succeeded",
    finished: "2 hours ago"
  },
  {
    id: "r3",
    trigger: "Secret change in /payments/stripe",
    status: "Failed",
    finished: "Yesterday"
  },
  { id: "r4", trigger: "Schedule", status: "Succeeded", finished: "2 days ago" }
];

const manyRuns: Run[] = Array.from({ length: 30 }, (_, index) => ({
  ...runs[index % runs.length],
  id: `m${index}`
}));

const columns: DataTableColumn<Run>[] = [
  { id: "trigger", header: "Trigger", primary: true, grow: true, render: (row) => row.trigger },
  { id: "status", header: "Status", width: 112, render: (row) => row.status },
  { id: "finished", header: "Finished", width: 128, render: (row) => row.finished }
];

const summary = (title: string, items: DataListItem[]) => (
  <Card key={title} variant="framed" title={title} action={<Button variant="outline">Edit</Button>}>
    <DataList variant="props" density="compact" items={items} />
  </Card>
);

const configuration: DataListItem[] = [
  ["Destination", "AWS Secrets Manager"],
  ["Region", "eu-west-1"],
  ["Path", <code key="path">/platform-core/shared-infrastructure/production/payments-api</code>],
  ["Sync interval", "Every 15 minutes"]
];
const connection: DataListItem[] = [
  ["Connection", "aws-prod-payments"],
  ["Auth method", "Assume role"],
  [
    "Role ARN",
    <CopyValue
      key="arn"
      value="arn:aws:iam::123456789012:role/infisical-secret-sync-payments"
      label="Copy role ARN"
    />
  ]
];
const options: DataListItem[] = [
  ["Initial sync", "Overwrite destination"],
  ["Key schema", <code key="schema">{"INFISICAL_{{secretKey}}"}</code>],
  ["Delete on removal", "On"],
  ["Auto sync", "On"]
];
const ownership: DataListItem[] = [
  ["Created by", "maximilian.vandenberghe-okonkwo@platform-engineering.example.com"],
  ["Created", "Jun 2, 2026"],
  ["Last modified", "Jun 14, 2026"]
];
const filters: DataListItem[] = [
  ["Environments", "Production, Staging"],
  ["Folders", <code key="folders">/payments/**</code>],
  ["Tags", "payments, production, pci, eu-west-1, shared-infrastructure"]
];
const identifiers: DataListItem[] = [
  ["Project ID", <code key="project">9c3f0a71-2be4-4c1d-8f6e-5a0d7b2e4c19</code>],
  ["Connection ID", <code key="connection">e0a4b6d2-71c8-4f3a-9b5e-2d6c8f0a1b37</code>],
  ["Webhook ID", <code key="webhook">5f2d9e8b-0c47-4a16-b3d1-7e9a2c6f4b80</code>]
];

const Specimen = ({ tall }: { tall?: boolean }) => (
  <DetailLayout
    asideLabel="Details"
    aside={
      <Card variant="framed" title="Details">
        <DataList
          variant="props"
          items={[
            [
              "ID",
              <CopyValue key="id" value="4b1e8c2a-93f0-4d55-a1c6-0e7d2f9b3a11" label="Copy ID">
                <code>4b1e8c2a-93f0-4d55-a1c6-0e7d2f9b3a11</code>
              </CopyValue>
            ],
            ["Name", "payments-api-to-aws"],
            ["Status", "Synced"]
          ]}
        />
      </Card>
    }
    secondary={[
      summary("Configuration", configuration),
      summary("Connection", connection),
      summary("Sync options", options),
      ...(tall
        ? [
            summary("Filters", filters),
            summary("Identifiers", identifiers),
            summary("Ownership", ownership)
          ]
        : [])
    ]}
  >
    <Card variant="framed" title="Sync runs">
      <DataTable
        label="Sync runs"
        rows={tall ? manyRuns : runs}
        columns={columns}
        getRowId={(row) => row.id}
        rowLabel={(row) => row.trigger}
      />
    </Card>
  </DetailLayout>
);

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Specimen />
        <figcaption className="text-muted-foreground text-xs">
          {"Details and summary cards on the right, the table in the main column"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div style={{ maxWidth: "var(--cipher-size-measure-form)" }}>
          <Specimen />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Narrow container: Details, then the table, then the summaries"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Specimen tall />
        <figcaption className="text-muted-foreground text-xs">
          {"A right column taller than the viewport scrolls with the page instead of sticking"}
        </figcaption>
      </figure>
    </div>
  );
}
