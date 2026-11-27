import { useState } from "react";

import { Combobox, type ComboboxOption } from "@infisical/cipher/ui/combobox";

import { OverlayStage } from "../overlay-stage";
import { placeholderMedia } from "../placeholder-media";

const connections: ComboboxOption[] = [
  { value: "storage", label: "Object storage", media: placeholderMedia.square },
  {
    value: "queue",
    label: "Message queue",
    description: "Delivers events to subscribers",
    media: placeholderMedia.circle
  },
  { value: "registry", label: "Container registry", media: placeholderMedia.triangle },
  {
    value: "long",
    label: "Shared object storage for every production region and its disaster recovery copies",
    media: placeholderMedia.diamond
  },
  { value: "wide", label: "Wide mark", media: placeholderMedia.wide }
];

function Cell({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      {children}
      <figcaption className="text-muted-foreground text-xs">{caption}</figcaption>
    </figure>
  );
}

export default function Example() {
  const [connection, setConnection] = useState("storage");
  const [longConnection, setLongConnection] = useState("long");
  const [many, setMany] = useState(["storage", "long", "queue"]);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <Cell caption="Nothing selected">
        <Combobox label="Connection" options={connections} placeholder="Choose a connection" />
      </Cell>
      <Cell caption="The selected option's media shows in the trigger">
        <Combobox
          label="Connection"
          options={connections}
          value={connection}
          onChange={setConnection}
        />
      </Cell>
      <Cell caption="A long label truncates; the media keeps its size">
        <Combobox
          label="Connection"
          options={connections}
          value={longConnection}
          onChange={setLongConnection}
        />
      </Cell>
      <Cell caption="Multiple selection: each chip leads with its media">
        <Combobox
          multiple
          label="Connections"
          options={connections}
          value={many}
          onChange={setMany}
        />
      </Cell>
      <Cell caption="Rows lead with the media, on the first line of a row with a description">
        <OverlayStage height={300}>
          <Combobox
            label="Connection"
            options={connections}
            value={connection}
            onChange={setConnection}
            defaultOpen
          />
        </OverlayStage>
      </Cell>
    </div>
  );
}
