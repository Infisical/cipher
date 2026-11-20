import { useState } from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Card } from "@infisical/cipher/ui/card";
import { HeaderSearch } from "@infisical/cipher/ui/header-search";
import { Input } from "@infisical/cipher/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@infisical/cipher/ui/select";

const Figure = ({ caption, children }: { caption: string; children: React.ReactNode }) => (
  <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
    <div className="flex w-full min-w-0 flex-col items-stretch">{children}</div>
    <figcaption className="text-muted-foreground text-xs">{caption}</figcaption>
  </figure>
);

export default function Example() {
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("payments");
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))] items-start gap-x-6 gap-y-8">
      <Figure caption="Title only: the title keeps its own start inset">
        <Card variant="framed" title="Members">
          12 members, 3 pending invites.
        </Card>
      </Figure>
      <Figure caption="Controls take the 28px band tier with no size prop and sit as far from the side as from the top">
        <Card
          variant="framed"
          title="Email domains"
          action={
            <>
              <Select defaultValue="30">
                <SelectTrigger aria-label="Period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">Export</Button>
              <Button icon="plus">Add domain</Button>
            </>
          }
        >
          acme.com, acme-labs.io
        </Card>
      </Figure>
      <Figure caption="A size prop never skews the band: search, xs and md actions all take 28px">
        <Card
          variant="framed"
          title="Projects"
          action={
            <>
              <HeaderSearch
                label="Search projects"
                placeholder="Search projects"
                value={search}
                onValueChange={setSearch}
              />
              <Button variant="outline" size="xs">
                Export
              </Button>
              <Button variant="accent" size="md" icon="plus">
                Add to project
              </Button>
            </>
          }
        >
          kms-keys, payments-api
        </Card>
      </Figure>
      <Figure caption="An applied search or filter is a square dot on the bare trigger, with any count in its label">
        <Card
          variant="framed"
          title="Policies"
          action={
            <>
              <HeaderSearch
                label="Search rules"
                placeholder="Search rules"
                value={appliedSearch}
                onValueChange={setAppliedSearch}
              />
              <Button
                variant="bare"
                icon="funnel"
                iconOnly
                applied
                aria-label="Filter by policy: 4 applied"
              >
                Filter by policy
              </Button>
              <Button variant="accent" icon="plus">
                Add rule
              </Button>
            </>
          }
        >
          Secrets, Secret folders, Secret imports, Dynamic secrets
        </Card>
      </Figure>
      <Figure caption="Badges keep their text height">
        <Card
          variant="framed"
          title="Approvals"
          action={
            <>
              <Badge>3 pending</Badge>
              <Input icon="search" placeholder="Search" aria-label="Search approvals" />
            </>
          }
        >
          Requests waiting on you.
        </Card>
      </Figure>
      <Figure caption="Footer: text keeps the title inset, actions sit tight to the end">
        <Card
          variant="framed"
          title="Rotation"
          footerPlacement="frame"
          footer={
            <>
              <span>Last run 2 hours ago</span>
              <span className="flex gap-2">
                <Button variant="outline">View history</Button>
                <Button>Rotate now</Button>
              </span>
            </>
          }
        >
          Rotates every 30 days.
        </Card>
      </Figure>
    </div>
  );
}
