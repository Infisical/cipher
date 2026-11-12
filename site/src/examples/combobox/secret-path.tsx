import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { GlobPatternHelp, SecretPathInput } from "@infisical/cipher/ui/secret-path-input";

const tree: Record<string, string[]> = {
  "/": ["app", "billing", "infrastructure-shared-configuration-for-all-regions"],
  "/app": ["api", "web", "worker"],
  "/app/api": ["v1", "v2"],
  "/billing": ["stripe"]
};

export default function Example() {
  const [path, setPath] = useState("/app/");
  const [parent, setParent] = useState("/");
  const [scope, setScope] = useState("/app/**");
  const [scopeParent, setScopeParent] = useState("/");
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Secret path">
            <SecretPathInput
              value={path}
              onChange={setPath}
              folders={tree[parent]}
              onParentPathChange={setParent}
            />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Suggests child folders after each slash"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Folder scope" help={<GlobPatternHelp />}>
            <SecretPathInput
              value={scope}
              onChange={setScope}
              folders={tree[scopeParent]}
              onParentPathChange={setScopeParent}
            />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Glob value, no suggestions"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Source path">
            <SecretPathInput defaultValue="/billing/stripe" disabled />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Disabled"}</figcaption>
      </figure>
    </div>
  );
}
