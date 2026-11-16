import * as React from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import * as UI from "@infisical/cipher/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@infisical/cipher/ui/tabs";
import { Textarea } from "@infisical/cipher/ui/textarea";

const panels: Record<string, React.ReactNode> = {
  upload: (
    <Field label="File">
      <Input type="file" />
    </Field>
  ),
  paste: (
    <Field label="Secrets">
      <Textarea rows={8} placeholder="API_KEY=..." />
    </Field>
  )
};

const TabbedSheet = ({
  label,
  title,
  tabs
}: {
  label: string;
  title?: string;
  tabs: { value: string; label: string }[];
}) => {
  const [tab, setTab] = React.useState(tabs[0].value);
  const id = React.useId();
  return (
    <UI.Sheet>
      <UI.SheetTrigger asChild>
        <Button variant="outline">{label}</Button>
      </UI.SheetTrigger>
      <UI.SheetContent aria-label={title ? undefined : label}>
        <UI.SheetHeader
          tabs={
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList aria-label={label}>
                {tabs.map((item) => (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    id={id + item.value}
                    aria-controls={id + "panel"}
                  >
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          }
        >
          {title && <UI.SheetTitle>{title}</UI.SheetTitle>}
        </UI.SheetHeader>
        <UI.SheetBody role="tabpanel" id={id + "panel"} aria-labelledby={id + tab}>
          {panels[tab] ?? panels.paste}
        </UI.SheetBody>
        <UI.SheetFooter>
          <UI.SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </UI.SheetClose>
          <Button>Import</Button>
        </UI.SheetFooter>
      </UI.SheetContent>
    </UI.Sheet>
  );
};

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-wrap items-start gap-3">
      <TabbedSheet
        label="Tabs only"
        tabs={[
          { value: "upload", label: "Upload file" },
          { value: "paste", label: "Paste secrets" }
        ]}
      />
      <TabbedSheet
        label="Title and tabs"
        title="Import secrets"
        tabs={[
          { value: "upload", label: "Upload file" },
          { value: "paste", label: "Paste secrets" }
        ]}
      />
      <TabbedSheet
        label="Many long tabs"
        title="Import secrets into payments-ledger-replication-readwrite-us-east-1"
        tabs={[
          { value: "upload", label: "Upload a dotenv or JSON file" },
          { value: "paste", label: "Paste secrets as KEY=value" },
          { value: "vault", label: "HashiCorp Vault" },
          { value: "aws", label: "AWS Secrets Manager" },
          { value: "gcp", label: "GCP Secret Manager" }
        ]}
      />
    </div>
  );
}
