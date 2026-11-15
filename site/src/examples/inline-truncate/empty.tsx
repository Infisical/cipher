import { Icon } from "@infisical/cipher/ui/icon";
import { Inline, InlineGrow, InlineItem, Stack } from "@infisical/cipher/ui/layout";
import { Meta, SmallText, Text } from "@infisical/cipher/ui/text";

const frame = "w-full max-w-md rounded-md border border-border px-3 py-2";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className={frame}>
          <Inline gap={8} wrap={false}>
            <InlineItem shrink={false}>
              <Icon name="key" />
            </InlineItem>
            <InlineGrow>
              <Text truncate>API_KEY</Text>
            </InlineGrow>
            <InlineItem shrink={false}>
              <Meta>Just now</Meta>
            </InlineItem>
          </Inline>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Short value, no ellipsis"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className={frame}>
          <Stack gap={0}>
            <Text truncate>deploy-bot</Text>
            <SmallText muted truncate>
              No description
            </SmallText>
          </Stack>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Missing description"}</figcaption>
      </figure>
    </div>
  );
}
