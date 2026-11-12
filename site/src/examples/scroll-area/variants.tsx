import { ScrollArea, ScrollBar } from "@infisical/cipher/ui/scroll-area";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      {(["auto", "always", "scroll", "hover"] as const).map((type) => (
        <figure key={type} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <div className="h-28 w-full">
              <ScrollArea
                type={type}
                aria-label={`${type} version history`}
                className="h-full w-full"
              >
                <ul className="space-y-2 p-3">
                  {Array.from({ length: 10 }, (_, index) => (
                    <li key={index}>Version {10 - index}</li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </div>
          <figcaption className="text-muted-foreground text-xs">{type}</figcaption>
        </figure>
      ))}
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="h-36 w-full">
            <ScrollArea type="always" className="h-full w-full" aria-label="Wide version records">
              <div className="w-max space-y-2 p-3">
                {Array.from({ length: 8 }, (_, index) => (
                  <p key={index}>
                    Version {8 - index},
                    applications/staging/services/payment-processing/configuration
                  </p>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Both axes"}</figcaption>
      </figure>
    </div>
  );
}
