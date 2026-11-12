import { Button } from "@infisical/cipher/ui/button";
import { EmptyState } from "@infisical/cipher/ui/empty";

export default function Example() {
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <EmptyState
          icon="key"
          title="No secrets in staging yet"
          description="Add one, or copy them from development in one step."
          actions={
            <>
              <Button icon="plus">Add secret</Button>
              <Button variant="outline" icon="upload">
                Import from .env
              </Button>
            </>
          }
        />
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"Primary and secondary action"}
      </figcaption>
    </figure>
  );
}
