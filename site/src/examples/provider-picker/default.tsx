import * as React from "react";

import { ProviderPicker } from "@infisical/cipher/patterns/provider-picker";

import { providers } from "./data";

export default function Example() {
  const [picked, setPicked] = React.useState<string>();
  return (
    <div className="flex w-full flex-col gap-3">
      <ProviderPicker items={providers} onSelect={setPicked} searchPlaceholder="Search providers" />
      <p className="text-muted-foreground text-xs">Picked: {picked ?? "nothing yet"}</p>
    </div>
  );
}
