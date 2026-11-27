import { useState } from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { Select, type SelectOption } from "@infisical/cipher/ui/select";

import { placeholderMedia } from "../placeholder-media";

const connections: SelectOption[] = [
  { value: "storage", label: "Object storage", media: placeholderMedia.square },
  { value: "queue", label: "Message queue", media: placeholderMedia.circle },
  { value: "registry", label: "Container registry", media: placeholderMedia.triangle },
  { value: "wide", label: "Wide mark", media: placeholderMedia.wide }
];
const longConnections: SelectOption[] = [
  {
    value: "long",
    label: "Shared object storage for every production region and its disaster recovery copies",
    media: placeholderMedia.diamond,
    badge: (
      <Badge tone="info" collapse>
        Default
      </Badge>
    )
  },
  ...connections
];

function Row({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="w-full max-w-80 min-w-0">{children}</div>
      <figcaption className="text-muted-foreground text-xs">{caption}</figcaption>
    </figure>
  );
}

export default function Example() {
  const [connection, setConnection] = useState("storage");
  const [longConnection, setLongConnection] = useState("long");
  return (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <Row caption="Nothing selected">
        <Select label="Connection" options={connections} placeholder="Choose a connection" />
      </Row>
      <Row caption="The selected option's media shows in the trigger">
        <Select
          label="Connection"
          options={connections}
          value={connection}
          onValueChange={setConnection}
        />
      </Row>
      <Row caption="A long label truncates; the media keeps its size">
        <Select
          label="Connection"
          options={longConnections}
          value={longConnection}
          onValueChange={setLongConnection}
        />
      </Row>
    </div>
  );
}
