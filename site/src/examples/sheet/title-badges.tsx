import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { DocumentationLink } from "@infisical/cipher/ui/documentation-link";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import * as UI from "@infisical/cipher/ui/sheet";

const docs = "https://infisical.com/docs/documentation/platform/pki/code-signing";

const TitledSheet = ({
  label,
  title,
  badges
}: {
  label: string;
  title: string;
  badges: React.ReactNode;
}) => (
  <UI.Sheet>
    <UI.SheetTrigger asChild>
      <Button variant="outline">{label}</Button>
    </UI.SheetTrigger>
    <UI.SheetContent>
      <UI.SheetHeader>
        <UI.SheetTitle badges={badges}>{title}</UI.SheetTitle>
      </UI.SheetHeader>
      <UI.SheetBody>
        <Field label="Name">
          <Input defaultValue="release-signer" />
        </Field>
      </UI.SheetBody>
      <UI.SheetFooter>
        <UI.SheetClose asChild>
          <Button variant="outline">Cancel</Button>
        </UI.SheetClose>
        <Button>Create signer</Button>
      </UI.SheetFooter>
    </UI.SheetContent>
  </UI.Sheet>
);

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-wrap items-start gap-3">
      <TitledSheet
        label="Docs link only"
        title="Create signer"
        badges={<DocumentationLink href={docs} subject="code signing" />}
      />
      <TitledSheet
        label="Docs link and a badge"
        title="Edit signer"
        badges={
          <>
            <DocumentationLink href={docs} subject="code signing" />
            <Badge tone="warn">Production</Badge>
          </>
        }
      />
      <TitledSheet
        label="Long title"
        title="Connect payments-ledger-replication-readwrite-us-east-1-primary to a signing key"
        badges={
          <>
            <DocumentationLink href={docs} subject="code signing" />
            <Badge tone="outline">HSM</Badge>
          </>
        }
      />
      <TitledSheet
        label="Many badges"
        title="Edit release-signer"
        badges={
          <>
            <DocumentationLink href={docs} subject="code signing" />
            <Badge tone="warn">Production</Badge>
            <Badge tone="outline">HSM</Badge>
            <Badge tone="outline">FIPS 140-3</Badge>
            <Badge tone="outline">Rotates every 90 days</Badge>
          </>
        }
      />
    </div>
  );
}
