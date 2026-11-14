import { Heading, Meta, SmallText, Text } from "@infisical/cipher/ui/text";

const note = "Renewal agreed on the Oct 12 call.\nSeats: 40 to 55 from March.\n\nQuote to finance.";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      {(["display", "page", "section", "subsection"] as const).map((size) => (
        <figure key={size} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
            <Heading level={3} size={size}>
              Credential rotation
            </Heading>
          </div>
          <figcaption className="text-muted-foreground text-xs">{size}</figcaption>
        </figure>
      ))}
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Text>Rotate credentials before the current version expires.</Text>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Text"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <SmallText>Changes apply to new credentials.</SmallText>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"SmallText"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Text preWrap>{note}</Text>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Text preWrap, a user-entered note"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Meta>2026-09-14 10:00 UTC</Meta>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Meta, mono"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Meta mono={false}>Updated 2 hours ago</Meta>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Meta, plain"}</figcaption>
      </figure>
    </div>
  );
}
