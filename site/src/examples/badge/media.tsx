import { Badge } from "@infisical/cipher/ui/badge";

import { placeholderMedia } from "../placeholder-media";

function Cell({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      {children}
      <figcaption className="text-muted-foreground text-xs">{caption}</figcaption>
    </figure>
  );
}

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <Cell caption="Without media">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Object storage</Badge>
        </div>
      </Cell>
      <Cell caption="Media before the label, in each tone and size">
        <div className="flex flex-wrap items-center gap-2">
          <Badge media={placeholderMedia.square}>Object storage</Badge>
          <Badge tone="soft" media={placeholderMedia.circle}>
            Message queue
          </Badge>
          <Badge tone="info" media={placeholderMedia.triangle}>
            Container registry
          </Badge>
          <Badge size="sm" media={placeholderMedia.diamond}>
            Small
          </Badge>
          <Badge size="control-sm" media={placeholderMedia.square}>
            Control small
          </Badge>
          <Badge size="control-md" media={placeholderMedia.wide}>
            Wide mark
          </Badge>
          <Badge size="control-lg" media={placeholderMedia.circle}>
            Control large
          </Badge>
        </div>
      </Cell>
      <Cell caption="In a narrow cell the label truncates and the media stays">
        <div className="flex w-40 max-w-full min-w-0 flex-col items-start gap-2 border border-border p-2">
          <Badge collapse media={placeholderMedia.diamond}>
            Shared object storage for every production region
          </Badge>
          <Badge tone="soft" collapse media={placeholderMedia.circle}>
            Message queue
          </Badge>
        </div>
      </Cell>
    </div>
  );
}
