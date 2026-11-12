import { StatusText } from "@infisical/cipher/ui/text";

export default function Status() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <StatusText tone="ok" icon="check-c">
            Signed in
          </StatusText>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"ok"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <StatusText icon="info">Never signed in</StatusText>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"neutral"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <StatusText tone="warn" icon="alert">
            No auth method
          </StatusText>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"warn"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <StatusText tone="bad" icon="lock">
            Universal Auth locked out
          </StatusText>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"bad"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <StatusText loading>Submitting</StatusText>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"loading"}</figcaption>
      </figure>
    </div>
  );
}
