import { MiddleTruncate } from "@infisical/cipher/ui/middle-truncate";
import { CopyButton } from "@infisical/cipher/ui/sensitive-editor";

const path = "applications/staging/services/payment-processing/configuration/retention-policy";
export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <MiddleTruncate text="project_staging" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Fits fully"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <div className="flex w-full items-center gap-2">
            <div className="w-48 max-w-full min-w-0">
              <MiddleTruncate text={path} mono={false} />
            </div>
            <CopyButton iconOnly value={path} label="Copy full resource path" />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Default end, plain text"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <div className="w-16 max-w-full">
            <MiddleTruncate keepEnd={16} mono>
              {path}
            </MiddleTruncate>
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Narrow, end 16"}</figcaption>
      </figure>
    </div>
  );
}
