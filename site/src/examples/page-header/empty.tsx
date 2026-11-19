import { PageHeader } from "@infisical/cipher/ui/page-header";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <PageHeader title="Secrets" />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Title only"}
        </figcaption>
      </figure>
    </div>
  );
}
