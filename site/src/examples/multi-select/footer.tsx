import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { Link } from "@infisical/cipher/ui/link";
import { MultiSelect } from "@infisical/cipher/ui/multi-select";
import { Meta } from "@infisical/cipher/ui/text";

const teams = [
  "Platform",
  "Payments",
  "Security",
  "Data",
  "Mobile",
  "Growth",
  "Identity",
  "Billing"
];
const groups = Array.from({ length: 50 }, (_, index) => {
  const name = `${teams[index % teams.length]} ${Math.floor(index / teams.length) + 1}`;
  return { value: name.toLowerCase().replace(" ", "-"), label: name };
});

export default function Example() {
  const [none, setNone] = useState<string[]>([]);
  const [some, setSome] = useState(["platform-1", "security-1"]);
  const [long, setLong] = useState<string[]>([]);
  return (
    <div className="flex w-full max-w-sm min-w-0 flex-col gap-6">
      <Field label="Groups to sync">
        <MultiSelect
          label="Groups to sync"
          placeholder="Choose groups"
          options={[]}
          value={none}
          onChange={setNone}
          emptyText="Select an LDAP connection first."
        />
      </Field>
      <Field label="Directory groups">
        <MultiSelect
          label="Directory groups"
          placeholder="Choose groups"
          searchable
          options={groups}
          value={some}
          onChange={setSome}
          footer="Showing the first 50 groups"
        />
      </Field>
      <Field label="Mapped groups">
        <MultiSelect
          label="Mapped groups"
          placeholder="Choose groups"
          searchable
          options={groups.slice(0, 6)}
          value={long}
          onChange={setLong}
          emptyText="No group matches that search. Groups sync from the directory every 15 minutes, so a group created a moment ago may not be listed yet."
          footer={
            <p className="px-2 py-1">
              <Meta mono={false}>
                Missing a group?{" "}
                <Link href="#/components/multi-select">
                  Open the directory sync settings for this organization
                </Link>
              </Meta>
            </p>
          }
        />
      </Field>
    </div>
  );
}
