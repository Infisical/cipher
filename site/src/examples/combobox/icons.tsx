import { useState } from "react";

import { Combobox, type ComboboxOption } from "@infisical/cipher/ui/combobox";
import { Field } from "@infisical/cipher/ui/field";

const folder = (path: string): ComboboxOption => ({ value: path, label: path, icon: "folder" });
const paths = ["/", "/app", "/app/api", "/app/web", "/billing", "/billing/stripe"].map(folder);
const assignees: ComboboxOption[] = [
  { value: "none", label: "Unassigned" },
  { value: "maya", label: "Maya Chen", icon: "user", group: "Users" },
  { value: "omar", label: "Omar Haddad", icon: "user", group: "Users" },
  { value: "deploy-bot", label: "deploy-bot", icon: "machine", group: "Machine identities" },
  { value: "ci-runner", label: "ci-runner", icon: "machine", group: "Machine identities" }
];
const longPaths = [
  "/infrastructure-shared-configuration-for-all-regions",
  "/infrastructure-shared-configuration-for-all-regions/us-east-1/networking/load-balancers",
  "/infrastructure-shared-configuration-for-all-regions/eu-west-2/databases/replicas",
  "/services/payments/stripe/webhooks",
  "/services/payments/adyen/credentials",
  "/services/notifications/email/providers/sendgrid",
  "/services/notifications/sms",
  "/services/search/indexer",
  "/services/ledger",
  "/teams/platform/oncall",
  "/teams/security/break-glass",
  "/legacy/monolith/do-not-use-for-new-secrets"
].map(folder);

export default function Example() {
  const [path, setPath] = useState("/app/api");
  const [assignee, setAssignee] = useState("");
  const [longPath, setLongPath] = useState(longPaths[1].value);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Field label="Secret path">
          <Combobox
            label="Secret path"
            mono
            options={paths}
            value={path}
            onChange={setPath}
            placeholder="Select a secret path"
          />
        </Field>
        <figcaption className="text-muted-foreground text-xs">
          {"The selected option's icon shows in the trigger"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Field label="Assignee">
          <Combobox
            label="Assignee"
            options={assignees}
            value={assignee}
            onChange={setAssignee}
            placeholder="Choose an assignee"
          />
        </Field>
        <figcaption className="text-muted-foreground text-xs">
          {"Rows without an icon stay aligned"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Field label="Folder">
          <Combobox
            label="Folder"
            mono
            options={longPaths}
            value={longPath}
            onChange={setLongPath}
          />
        </Field>
        <figcaption className="text-muted-foreground text-xs">{"Long paths truncate"}</figcaption>
      </figure>
    </div>
  );
}
