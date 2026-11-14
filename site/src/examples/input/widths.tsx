import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import {
  DataTable,
  type DataTableColumn,
} from "@infisical/cipher/ui/data-table";
import { Input } from "@infisical/cipher/ui/input";
import { Item, ItemGroup } from "@infisical/cipher/ui/item";
import { Inline, InlineGrow } from "@infisical/cipher/ui/layout";
import { Select } from "@infisical/cipher/ui/select";

type Plan = { id: string; name: string; seats: number };

const plans: Plan[] = [
  { id: "pro", name: "Pro", seats: 25 },
  { id: "enterprise", name: "Enterprise", seats: 250 },
];

const taxTypes = [
  { value: "eu_vat", label: "EU VAT" },
  { value: "gb_vat", label: "GB VAT" },
  { value: "us_ein", label: "US EIN" },
];

const Case = ({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) => (
  <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
    <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
      {children}
    </div>
    <figcaption className="text-muted-foreground text-xs">{caption}</figcaption>
  </figure>
);

export default function Example() {
  const [taxType, setTaxType] = useState("eu_vat");
  const columns: DataTableColumn<Plan>[] = [
    { id: "name", header: "Plan", primary: true, render: (plan) => plan.name },
    {
      id: "seats",
      header: "Seats",
      render: (plan) => (
        <Input
          type="number"
          width="xs"
          size="xs"
          defaultValue={plan.seats}
          aria-label={`Seats on ${plan.name}`}
          icon="user"
        />
      ),
    },
  ];
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,22rem),1fr))] items-start gap-x-6 gap-y-8">
      <Case caption="xs: a number in a table cell">
        <DataTable
          label="Plans"
          rowLabel={(plan) => plan.name}
          columns={columns}
          rows={plans}
          getRowId={(plan) => plan.id}
        />
      </Case>
      <Case caption="xs: a number in a row's actions">
        <ItemGroup>
          <Item
            variant="outline"
            title="Seat limit"
            description="Members beyond the limit are billed as overage."
            actions={
              <Input
                type="number"
                width="xs"
                defaultValue={50}
                aria-label="Seat limit"
              />
            }
          />
        </ItemGroup>
      </Case>
      <Case caption="sm: a date">
        <Input
          type="date"
          width="sm"
          defaultValue="2026-12-04"
          aria-label="Renewal date"
        />
      </Case>
      <Case caption="sm: a fixed select beside a fluid field">
        <Inline gap={8} wrap={false}>
          <Select
            width="sm"
            label="Tax ID type"
            options={taxTypes}
            value={taxType}
            onChange={setTaxType}
          />
          <InlineGrow>
            <Input placeholder="DE123456789" aria-label="Tax ID" />
          </InlineGrow>
          <Button variant="outline">Save</Button>
        </Inline>
      </Case>
    </div>
  );
}
