import { Alert, AlertDescription, AlertTitle } from "@infisical/cipher/ui/alert";
import { EmptyState } from "@infisical/cipher/ui/empty";
import { Skeleton } from "@infisical/cipher/ui/skeleton";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div aria-busy="true" className="w-full">
            <span role="status" className="sr-only">
              Loading request counts
            </span>
            <div className="flex h-40 items-end justify-around border-b border-[color:var(--cipher-line)] pl-9">
              {["60%", "85%", "45%"].map((height) => (
                <Skeleton key={height} width={40} height={height} />
              ))}
            </div>
            <div className="flex justify-around pt-2 pl-9">
              {["Mon", "Tue", "Wed"].map((day) => (
                <Skeleton key={day} width={28} height={10} />
              ))}
            </div>
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Loading"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <EmptyState
            title="No requests yet"
            description="Request counts will appear when clients connect."
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Empty"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Alert variant="destructive">
            <AlertTitle>Request counts unavailable</AlertTitle>
            <AlertDescription>Try again when the connection is restored.</AlertDescription>
          </Alert>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Error"}</figcaption>
      </figure>
    </div>
  );
}
