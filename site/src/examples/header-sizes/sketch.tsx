import { useState } from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Card } from "@infisical/cipher/ui/card";
import { HeaderSearch } from "@infisical/cipher/ui/header-search";
import { PageHeader } from "@infisical/cipher/ui/page-header";
import { Select, type SelectOption } from "@infisical/cipher/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@infisical/cipher/ui/toggle-group";

import styles from "./sketch.module.css";

const ranges: SelectOption[] = [
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" }
];

const Row = ({ band, before }: { band: boolean; before: boolean }) => {
  const [search, setSearch] = useState("acme");
  const [range, setRange] = useState("30");
  const xs = band && before;
  return (
    <div className={styles.row}>
      <Badge tone="soft">3 pending</Badge>
      <HeaderSearch
        value={search}
        onValueChange={setSearch}
        label="Search email domains"
        placeholder="Search domains"
        indicator="dot"
        shortcut={false}
      />
      <ToggleGroup type="single" defaultValue="all" aria-label="Status">
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
      </ToggleGroup>
      <Select options={ranges} value={range} onChange={setRange} aria-label="Range" />
      <Button variant="outline" size={xs ? "xs" : undefined}>
        Export
      </Button>
      <Button icon="plus" size={xs ? "xs" : undefined}>
        Add domain
      </Button>
    </div>
  );
};

const Scale = ({ scale, label }: { scale: string; label: string }) => (
  <section className={styles.scale} data-scale={scale}>
    <p className={styles.label}>{label}</p>
    <div data-ctx="page">
      <PageHeader size="md" title="Email domains" actions={<Row band={false} before={scale === "before"} />} />
    </div>
    <div data-ctx="band">
      <Card variant="framed" title="Email domains" action={<Row band before={scale === "before"} />}>
        <div className={styles.body}>acme.com, acme-labs.io</div>
      </Card>
    </div>
  </section>
);

export const scales = [
  ["before", "Today: defaults in the page header, xs buttons in the card band, nothing else has an xs size"],
  ["a", "A. One header size: 32 everywhere, page header and card band"],
  ["b", "B. Two tiers: 32 in the page header, 28 in card bands, sheet headers and toolbars"],
  ["c", "C. Two tiers, today's band size: 32 in the page header, 24 in card bands"]
] as const;

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-12">
      {scales.map(([scale, label]) => (
        <Scale key={scale} scale={scale} label={label} />
      ))}
    </div>
  );
}
