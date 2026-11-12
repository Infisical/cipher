import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@infisical/cipher/ui/card";
import { Media, Tile } from "@infisical/cipher/ui/item";
import { Grid } from "@infisical/cipher/ui/layout";

export default function Example() {
  const [selected, setSelected] = useState(false);
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Tile selected={selected} onClick={() => setSelected(!selected)}>
            <span className="flex items-center gap-3">
              <Media icon="machine" />
              Machine identity
            </span>
          </Tile>
          <p role="status" className="sr-only">
            {selected ? "Machine identity selected" : "No identity selected"}
          </p>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"On a surface: bordered"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card variant="framed">
            <CardHeader>
              <CardTitle>Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <Grid columns={3} gap={8}>
                <Tile title="Card on file" description="VISA ending in 4242" />
                <Tile title="Invoices" description="$10,800, Mar 14, 2026" />
                <Tile title="Billing details" description="Acme Corp" />
              </Grid>
            </CardContent>
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Inside a Card: shaded"}</figcaption>
      </figure>
    </div>
  );
}
