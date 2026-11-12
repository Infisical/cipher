import { useState } from "react";

import { Snippet } from "@infisical/cipher/ui/snippet";

export default function Example() {
  const [copied, setCopied] = useState("");
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <Snippet
          label="Project scoped command"
          value='infisical run --projectId=project_staging --env=staging -- npm run start -- --name="  exact  "'
          onCopy={setCopied}
        />
        <p role="status" className="sr-only">
          {copied ? "Command copied" : ""}
        </p>
      </div>
      <figcaption className="text-muted-foreground text-xs">{"Exact command copy"}</figcaption>
    </figure>
  );
}
