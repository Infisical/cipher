import { Badge } from "@infisical/cipher/ui/badge";
import { DocumentationLink } from "@infisical/cipher/ui/documentation-link";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { MultiStep, type MultiStepStep } from "@infisical/cipher/ui/multi-step";
import { toast } from "@infisical/cipher/ui/sonner";

const docs = "https://infisical.com/docs/documentation/platform/pki/certificates/overview";

const steps: MultiStepStep[] = [
  {
    title: "Authority",
    heading: "Choose the certificate authority for payments-ledger-replication-us-east-1",
    badges: (
      <>
        <DocumentationLink href={docs} subject="certificate authorities" />
        <Badge tone="outline">Private CA</Badge>
        <Badge tone="warn">Production</Badge>
      </>
    ),
    content: (
      <Field label="Authority">
        <Input defaultValue="internal-root-ca" />
      </Field>
    )
  },
  {
    title: "Subject",
    heading: "Set the subject",
    badges: <DocumentationLink href={docs} subject="certificate subjects" />,
    content: (
      <Field label="Common name">
        <Input defaultValue="ledger.internal" />
      </Field>
    )
  }
];

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-stretch gap-3">
      <MultiStep
        variant="page"
        steps={steps}
        completeLabel="Issue certificate"
        onComplete={() => {
          toast("Certificate issued.");
        }}
      />
    </div>
  );
}
