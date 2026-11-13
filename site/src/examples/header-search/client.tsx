import { useState } from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Card } from "@infisical/cipher/ui/card";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { HeaderSearch } from "@infisical/cipher/ui/header-search";

type Domain = { id: string; domain: string; verified: boolean; added: string };

const domains = [
  "acme.com",
  "acme-labs.io",
  "northwind.dev",
  "globex.net",
  "initech.co",
  "umbrella.org",
  "hooli.xyz",
  "stark.industries",
  "wayne.enterprises",
  "vandelay.com",
  "pied-piper.io",
  "massive.dynamic"
].map((domain, index): Domain => ({
  id: domain,
  domain,
  verified: index % 4 !== 2,
  added: `Oct ${index + 3}, 2026`
}));

const columns: DataTableColumn<Domain>[] = [
  {
    id: "domain",
    header: "Domain",
    primary: true,
    grow: true,
    text: (row) => row.domain,
    render: (row) => row.domain
  },
  {
    id: "status",
    header: "Status",
    width: 120,
    render: (row) => (
      <Badge tone={row.verified ? "soft" : "warn"}>{row.verified ? "Verified" : "Pending"}</Badge>
    )
  },
  { id: "added", header: "Added", width: 140, render: (row) => row.added }
];

export default function Example() {
  const [search, setSearch] = useState("");
  const needle = search.trim().toLowerCase();
  const rows = needle ? domains.filter((row) => row.domain.includes(needle)) : domains;
  return (
    <div className="w-full min-w-0">
      <Card
        variant="framed"
        title="Email domains"
        flush
        action={
          <div className="flex items-center gap-2">
            <HeaderSearch
              label="Search email domains"
              placeholder="Search domains"
              shortcut="page"
              value={search}
              onValueChange={setSearch}
              hint={rows.length ? undefined : `No domains match "${search.trim()}".`}
            />
            <Button variant="outline" size="xs" icon="plus">
              Add domain
            </Button>
          </div>
        }
      >
        <DataTable
          label="Email domains"
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          rowLabel={(row) => row.domain}
          empty={
            <span className="flex items-center gap-2">
              No domains match "{search.trim()}".
              <Button variant="link" onClick={() => setSearch("")}>
                Clear search
              </Button>
            </span>
          }
        />
      </Card>
    </div>
  );
}
