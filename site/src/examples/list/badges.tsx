import { Badge } from "@infisical/cipher/ui/badge";
import { DocumentationLink } from "@infisical/cipher/ui/documentation-link";
import { List, ListRow } from "@infisical/cipher/ui/list";

const docs = "https://infisical.com/docs/documentation/platform/identities/overview";

const identities = [
  { id: "ci", name: "ci-deployer", detail: "Universal Auth" },
  { id: "k8s", name: "k8s-operator", detail: "Kubernetes Auth" }
];

const rows = identities.map((identity) => (
  <ListRow
    key={identity.id}
    value={identity.id}
    label={identity.name}
    title={identity.name}
    description={identity.detail}
  />
));

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <List
        label="Machine identities"
        title="Machine identities"
        badges={<DocumentationLink href={docs} subject="machine identities" />}
        count={2}
      >
        {rows}
      </List>
      <List
        variant="plain"
        label="Machine identities"
        title="Machine identities"
        badges={
          <>
            <DocumentationLink href={docs} subject="machine identities" />
            <Badge tone="outline">Beta</Badge>
          </>
        }
      >
        {rows}
      </List>
      <List
        label="Identities with access"
        title="Identities with access to payments-ledger-replication-readwrite-us-east-1-primary"
        badges={
          <>
            <DocumentationLink href={docs} subject="machine identities" />
            <Badge tone="warn">Production</Badge>
            <Badge tone="outline">Read and write</Badge>
          </>
        }
        count={2}
      >
        {rows}
      </List>
      <List
        variant="plain"
        label="Identities with access"
        title="Identities with access to payments-ledger-replication-readwrite-us-east-1-primary"
        badges={
          <>
            <DocumentationLink href={docs} subject="machine identities" />
            <Badge tone="warn">Production</Badge>
            <Badge tone="outline">Read and write</Badge>
          </>
        }
      >
        {rows}
      </List>
    </div>
  );
}
