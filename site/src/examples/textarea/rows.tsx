import * as React from "react";

import { Label } from "@infisical/cipher/ui/label";
import { Textarea } from "@infisical/cipher/ui/textarea";

export default function Example() {
  const [value, setValue] = React.useState("");
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <div className="space-y-2">
        <Label htmlFor="rows-default">Note</Label>
        <Textarea id="rows-default" placeholder="Add a note" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rows-six">Certificate chain</Label>
        <Textarea
          id="rows-six"
          rows={6}
          mono
          placeholder="Paste a PEM certificate chain"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
    </div>
  );
}
