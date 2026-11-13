import { useState } from "react";

import { Card } from "@infisical/cipher/ui/card";
import { HeaderSearch, type HeaderSearchIndicator } from "@infisical/cipher/ui/header-search";

function Sample({ indicator }: { indicator: HeaderSearchIndicator }) {
  const [search, setSearch] = useState("acme");
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <Card
        variant="framed"
        title="Email domains"
        action={
          <HeaderSearch
            label="Search email domains"
            indicator={indicator}
            value={search}
            onValueChange={setSearch}
          />
        }
      >
        {search ? `Showing domains that match "${search}".` : "Showing every domain."}
      </Card>
      <figcaption className="text-muted-foreground text-xs">{indicator}</figcaption>
    </figure>
  );
}

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] items-start gap-x-6 gap-y-8">
      <Sample indicator="chip" />
      <Sample indicator="ink" />
      <Sample indicator="dot" />
    </div>
  );
}
