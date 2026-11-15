import { RemoteDesktop } from "@infisical/cipher/ui/remote-desktop";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,22rem),1fr))] gap-x-4 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="h-[18rem] w-full min-w-0">
          <RemoteDesktop status="connecting" label="Remote desktop" />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"connecting, no frame yet"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="h-[18rem] w-full min-w-0">
          <RemoteDesktop status="disconnected" label="Remote desktop" onReconnect={() => {}} />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"disconnected, no details"}
        </figcaption>
      </figure>
    </div>
  );
}
