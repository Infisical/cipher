import { Card } from "@infisical/cipher/ui/card";
import { DocumentationLink } from "@infisical/cipher/ui/documentation-link";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { Inline } from "@infisical/cipher/ui/layout";
import { PageHeader } from "@infisical/cipher/ui/page-header";

const docs = "https://infisical.com/docs/documentation/platform/gateways/overview";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <PageHeader
          title="Gateways"
          badges={<DocumentationLink href={docs} subject="Gateways" />}
          description="Connect Infisical to resources in your private network."
        />
        <figcaption className="text-muted-foreground text-xs">{"Page title"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Card
          variant="framed"
          title={
            <Inline gap={6} wrap={false}>
              Deployment
              <DocumentationLink href={docs} subject="gateway deployment" />
            </Inline>
          }
        >
          Run the gateway next to the resources it reaches.
        </Card>
        <figcaption className="text-muted-foreground text-xs">{"Framed card title"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Field
          label="Relay"
          help={<DocumentationLink href={docs} subject="relays" />}
          description="The relay this gateway connects through."
        >
          <Input mono defaultValue="us-east-1" />
        </Field>
        <figcaption className="text-muted-foreground text-xs">{"Field label"}</figcaption>
      </figure>
    </div>
  );
}
