import { useState } from "react";
import { ArrowDownWideNarrow } from "lucide-react";

import { Field } from "@infisical/cipher/ui/field";
import { Select } from "@infisical/cipher/ui/select";

const regions = [
  { value: "us", label: "United States" },
  { value: "eu", label: "Europe" }
];
const sorts = [
  { value: "ending", label: "Ending soonest" },
  { value: "started", label: "Newest first" },
  { value: "seats", label: "Most seats" }
];

export default function Example() {
  const [region, setRegion] = useState("us");
  const [sort, setSort] = useState("ending");
  return (
    <div className="grid w-full min-w-0 grid-cols-3 items-end gap-6">
      <Field label="Region">
        <Select icon="globe" options={regions} value={region} onValueChange={setRegion} />
      </Field>
      <Field label="Plan">
        <Select icon="package" options={[]} placeholder="Choose a plan" />
      </Field>
      <Field label="Sort">
        <Select icon={ArrowDownWideNarrow} options={sorts} value={sort} onValueChange={setSort} />
      </Field>
    </div>
  );
}
