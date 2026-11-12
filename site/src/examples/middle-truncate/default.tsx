import { MiddleTruncate } from "@infisical/cipher/ui/middle-truncate";
import { CopyButton } from "@infisical/cipher/ui/sensitive-editor";

const path = "project/production/services/payment-processing-api";
export default function Example() {
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <div className="flex w-full items-center gap-2">
          <div className="w-64 max-w-full min-w-0">
            <MiddleTruncate mono keepEnd={12}>
              {path}
            </MiddleTruncate>
          </div>
          <CopyButton iconOnly value={path} label="Copy full path" />
        </div>
      </div>
      <figcaption className="text-muted-foreground text-xs">{"Resource path"}</figcaption>
    </figure>
  );
}
