import { EmptyState } from "@infisical/cipher/ui/empty";

export default function Example() {
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <EmptyState
          media="bare"
          icon="history"
          title="No versions yet"
          description="Each change to this secret saves a version here."
        />
      </div>
      <figcaption className="text-muted-foreground text-xs">{"bare"}</figcaption>
    </figure>
  );
}
