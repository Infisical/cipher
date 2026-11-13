import { Button } from "@infisical/cipher/ui/button";
import { Input } from "@infisical/cipher/ui/input";
import { FilterBar } from "@infisical/cipher/patterns/filter-bar";

const search = (label: string) => <Input icon="search" aria-label={label} placeholder={label} />;

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <FilterBar
        label="Member filters"
        fields={[]}
        value={[]}
        onChange={() => undefined}
        search={search("Search members")}
        actions={
          <Button variant="accent" icon="plus">
            Add member
          </Button>
        }
      />
      <FilterBar
        label="Audit log filters"
        fields={[]}
        value={[]}
        onChange={() => undefined}
        width="fill"
        search={search("Search audit logs")}
      />
    </div>
  );
}
