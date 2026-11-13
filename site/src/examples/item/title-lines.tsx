import { Button } from "@infisical/cipher/ui/button";
import { Item, ItemGroup, Media } from "@infisical/cipher/ui/item";

const title =
  "47 secrets changed in payments-reconciliation-service across production, staging, the eu-west-1 disaster recovery environment and the shared preview clusters";

const cases = [
  [undefined, "Unclamped (default): the title wraps"],
  [2, "titleLines={2}: clamped, the full title is in a tooltip"],
  [1, "titleLines={1}: one line, the full title is in a tooltip"]
] as const;

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-8">
      {cases.map(([lines, caption]) => (
        <figure
          key={caption}
          data-case={`title-lines-${lines ?? "none"}`}
          className="m-0 flex w-full min-w-0 flex-col gap-3"
          style={{ maxWidth: 760 }}
        >
          <ItemGroup>
            <Item
              variant="outline"
              titleLines={lines}
              media={<Media icon="key" tone="ok" />}
              title={title}
              meta="12m"
              description="Dana Wu. Needs 2 approvals."
              actions={
                <>
                  <Button variant="outline">Review</Button>
                  <Button>Approve</Button>
                </>
              }
            />
          </ItemGroup>
          <figcaption className="text-muted-foreground text-xs">{caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
