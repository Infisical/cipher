import * as React from "react";

import { TilePicker } from "@infisical/cipher/patterns/tile-picker";

import { providers } from "./data";

export default function Example() {
  const [picked, setPicked] = React.useState<string>();
  return (
    <div className="flex w-full flex-col gap-3">
      <TilePicker
        items={providers}
        onSelect={setPicked}
        searchLabel="Search providers"
        allLabel="All providers"
        noun="providers"
      />
      <p className="text-muted-foreground text-xs">Picked: {picked ?? "nothing yet"}</p>
    </div>
  );
}
