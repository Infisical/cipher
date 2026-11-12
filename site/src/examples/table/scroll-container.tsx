import { useEffect, useRef, useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";

type Row = { id: string; name: string };
const rows: Row[] = Array.from({ length: 30 }, (_, index) => ({
  id: `client-${index + 1}`,
  name: `example-machine-identity-${index + 1}`
}));
const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "Identity", primary: true, grow: true, render: (row) => row.name }
];

export default function Example() {
  const container = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const node = container.current;
    if (!node) return undefined;
    const update = () => setScrolled(node.scrollTop > 0);
    node.addEventListener("scroll", update);
    return () => node.removeEventListener("scroll", update);
  }, []);
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <div className="relative max-h-[400px] w-full min-w-0 overflow-auto">
          <DataTable
            label="Example identities"
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.name}
            height={240}
            containerRef={container}
            end={
              <Button
                variant="outline"
                disabled={!scrolled}
                onClick={() => container.current?.scrollTo({ top: 0 })}
              >
                Back to Top
              </Button>
            }
          />
        </div>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"containerRef reads and drives the scroll container"}
      </figcaption>
    </figure>
  );
}
