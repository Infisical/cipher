import { Button } from "@infisical/cipher/ui/button";
import { EmptyState } from "@infisical/cipher/ui/empty";
import { DataList, List, ListRow } from "@infisical/cipher/ui/list";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List label="Connections" title="Connections">
            <ListRow
              value="staging"
              label="Staging service"
              title="Staging service"
              description="Read access to project versions"
              meta="12 versions"
            />
            <ListRow
              value="production"
              label="Production service"
              title="Production service"
              description="Write access, approval required"
              actions={<Button variant="outline">Review</Button>}
            />
            <ListRow
              value="preview"
              label="Preview service"
              title="Preview service"
              meta="2 versions"
            />
          </List>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"framed"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List
            label="Empty connections"
            empty={<EmptyState size="sm" media="bare" title="No connections yet" />}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Empty"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataList
            variant="stat"
            items={[
              ["Connections", 12],
              ["Policies", 0]
            ]}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"stat"}</figcaption>
      </figure>
    </div>
  );
}
