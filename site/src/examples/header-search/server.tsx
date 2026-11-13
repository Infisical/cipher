import { useEffect, useState } from "react";

import { Card } from "@infisical/cipher/ui/card";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { HeaderSearch } from "@infisical/cipher/ui/header-search";

type Member = { id: string; name: string; email: string };

const directory: Member[] = [
  "Ada Lovelace",
  "Alan Turing",
  "Barbara Liskov",
  "Claude Shannon",
  "Donald Knuth",
  "Edsger Dijkstra",
  "Frances Allen",
  "Grace Hopper",
  "Hedy Lamarr",
  "Ken Thompson",
  "Margaret Hamilton",
  "Radia Perlman"
].map((name) => ({
  id: name,
  name,
  email: `${name.split(" ")[0].toLowerCase()}@acme.com`
}));

const columns: DataTableColumn<Member>[] = [
  {
    id: "name",
    header: "Name",
    primary: true,
    grow: true,
    text: (row) => row.name,
    render: (row) => row.name
  },
  { id: "email", header: "Email", width: 220, render: (row) => row.email }
];

function useMembers(search: string) {
  const [result, setResult] = useState({ search, rows: directory });
  useEffect(() => {
    const timer = setTimeout(() => {
      const needle = search.trim().toLowerCase();
      setResult({
        search,
        rows: directory.filter((row) => !needle || row.name.toLowerCase().includes(needle))
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, [search]);
  return { rows: result.rows, fetching: result.search !== search };
}

export default function Example() {
  const [search, setSearch] = useState("");
  const { rows, fetching } = useMembers(search);
  return (
    <div className="w-full min-w-0">
      <Card
        variant="framed"
        title="Group members"
        flush
        action={
          <HeaderSearch
            label="Search group members"
            placeholder="Search members"
            debounceMs={250}
            pending={fetching}
            value={search}
            onValueChange={setSearch}
            hint={
              !fetching && search && !rows.length
                ? `No members match "${search.trim()}".`
                : undefined
            }
          />
        }
      >
        <DataTable
          label="Group members"
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          rowLabel={(row) => row.name}
          empty={`No members match "${search.trim()}".`}
        />
      </Card>
    </div>
  );
}
