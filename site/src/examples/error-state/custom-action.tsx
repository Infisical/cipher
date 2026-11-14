import { ErrorState } from "@infisical/cipher/patterns/error-state";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="relative isolate h-[360px] w-full min-w-0 [transform:translateZ(0)] overflow-auto">
            <ErrorState
              preset="not-found"
              layout="in-shell"
              description="This license was revoked or never existed."
              actionLabel="Back to licenses"
              actionLink={{ href: "#error-state" }}
              onBack={() => {}}
            />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"not-found, primary action links to Back to licenses"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="relative isolate h-[360px] w-full min-w-0 [transform:translateZ(0)] overflow-auto">
            <ErrorState
              preset="crash"
              layout="in-shell"
              actionLabel="Try again"
              onAction={() => {}}
              homeLabel="Back to licenses"
              homeLink={{ href: "#error-state" }}
              showStack={false}
            />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"crash, Try again runs a handler and the home link goes to Back to licenses"}</figcaption>
      </figure>
    </div>
  );
}
