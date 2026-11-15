import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { GlobPatternHelp, SecretPathInput } from "@infisical/cipher/ui/secret-path-input";

const tree: Record<string, string[]> = {
  "/": ["apps", "billing", "shared"],
  "/apps": ["api", "web", "worker"],
  "/apps/api": ["v1", "v2"],
  "/billing": ["stripe"]
};

const sparse: Record<string, string[]> = {
  "/": ["config"]
};

const deep: Record<string, string[]> = {
  "/": ["infrastructure-shared-configuration-for-all-regions"],
  "/infrastructure-shared-configuration-for-all-regions": [
    "us-east-1-production-primary-database-credentials",
    "us-west-2-production-replica-database-credentials",
    "eu-central-1-staging-message-queue-connection-settings",
    "ap-southeast-2-disaster-recovery-object-storage-keys",
    "observability",
    "networking",
    "identity-provider",
    "feature-flags",
    "certificates"
  ]
};

function ScopeField({
  label,
  folders,
  initial
}: {
  label: string;
  folders: Record<string, string[]>;
  initial: string;
}) {
  const [path, setPath] = useState(initial);
  const [parent, setParent] = useState("/");
  return (
    <Field label={label} help={<GlobPatternHelp />}>
      <SecretPathInput
        value={path}
        onChange={setPath}
        folders={folders[parent]}
        onParentPathChange={setParent}
        globSuggestions
      />
    </Field>
  );
}

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <ScopeField label="Folder scope" folders={tree} initial="/apps/" />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Offers /apps/* and /apps/** after the child folders"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <ScopeField label="Folder scope" folders={sparse} initial="/" />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"One folder at the root"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <ScopeField
            label="Folder scope"
            folders={deep}
            initial="/infrastructure-shared-configuration-for-all-regions/"
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Long folder names"}</figcaption>
      </figure>
    </div>
  );
}
