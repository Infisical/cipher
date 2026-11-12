import { ErrorState } from "@infisical/cipher/patterns/error-state";

const frames = Array.from(
  { length: 28 },
  (_, index) =>
    `    at Component${index + 1} (src/pages/v4/secret-manager/OverviewPage/OverviewPage.tsx:${200 + index * 7}:${10 + index})`
);
const longError = Object.assign(
  new TypeError("Cannot read properties of undefined (reading 'environments')"),
  {
    stack: [
      `TypeError: Cannot read properties of undefined (reading 'environments')`,
      ...frames
    ].join("\n")
  }
);

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="relative isolate h-60 w-full min-w-0 [transform:translateZ(0)] overflow-auto">
            <ErrorState
              preset="crash"
              layout="full-page"
              homeHref="#error-state"
              error={longError}
              details={[{ label: "request", value: "req-5f3a9c2e81b4" }]}
              showStack
              onReload={() => {}}
            />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"crash, full-page, long stack in a short stage"}
        </figcaption>
      </figure>
    </div>
  );
}
