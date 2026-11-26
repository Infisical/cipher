import { Icon } from "@infisical/cipher/ui/icon";
import { Media } from "@infisical/cipher/ui/item";
import { Inline } from "@infisical/cipher/ui/layout";
import { SmallText, Text } from "@infisical/cipher/ui/text";

const sentence =
  "Rotation runs every 30 days and writes the new credentials to every environment that imports this folder";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8 md:grid-cols-3">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Inline align="first-line" gap={8}>
          <Icon name="info" />
          <Text>{sentence}</Text>
        </Inline>
        <figcaption className="text-muted-foreground text-xs">
          {
            'First line (.cipher-lead-line): a glyph no taller than the line stays on the first line as the text wraps. Use Inline align="first-line", or Icon lead in your own flex row.'
          }
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex items-start gap-3">
          <span className="cipher-lead-block">
            <Media icon="key" />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <Text>Payments API service account</Text>
            <SmallText>{sentence}</SmallText>
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          Default row (.cipher-lead-block): media taller than a line centres on a title plus one
          description line, then stays put as the description grows. Set --cipher-lead-row for other
          type roles.
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Inline align="center" gap={8}>
          <Icon name="key" />
          <Text className="truncate">Payments API service account</Text>
        </Inline>
        <figcaption className="text-muted-foreground text-xs">
          Centre only rows that never wrap (truncated titles, menu labels, table cells). Never
          centre leading media against text that wraps.
        </figcaption>
      </figure>
    </div>
  );
}
