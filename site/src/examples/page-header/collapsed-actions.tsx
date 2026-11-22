import { Button } from "@infisical/cipher/ui/button";
import { PageHeader } from "@infisical/cipher/ui/page-header";

export default function Example() {
  return (
    <figure className="m-0 flex w-full max-w-[390px] min-w-0 flex-col gap-3">
      <PageHeader
        title="payments-api"
        description="Card payments and refunds for the storefront"
        actions={
          <>
            <Button variant="outline" icon="download">
              Export
            </Button>
            <Button variant="outline" icon="sync">
              Rotate
            </Button>
            <Button variant="accent" icon="plus">
              Add secret
            </Button>
          </>
        }
      />
      <figcaption className="text-muted-foreground text-xs">
        {"At 390px, actions with an icon drop to their glyph at the 14px icon-only size"}
      </figcaption>
    </figure>
  );
}
