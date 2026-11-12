import {
  ApprovalQueue,
  type ApprovalQueueVariant
} from "@infisical/cipher/patterns/approval-queue";

const variants: ApprovalQueueVariant[] = ["framed", "segmented", "divided"];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      {variants.map((variant) => (
        <figure key={variant} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <ApprovalQueue
              variant={variant}
              loading
              loadingRows={2}
              loadingLabel="Loading change requests"
              requests={[]}
              onApprove={() => {}}
              onRetry={() => {}}
            />
          </div>
          <figcaption className="text-muted-foreground text-xs">{variant}</figcaption>
        </figure>
      ))}
    </div>
  );
}
