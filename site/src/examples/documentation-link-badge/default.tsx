import { DocumentationLinkBadge } from "@infisical/cipher/ui/documentation-link-badge";
import { Heading } from "@infisical/cipher/ui/text";

const href = "https://infisical.com/docs/documentation/platform/gateways/overview";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DocumentationLinkBadge href={href} />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"default"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DocumentationLinkBadge href={href} variant="minified" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"minified"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="flex items-center gap-2">
            <Heading level={3} size="subsection">
              Gateways
            </Heading>
            <DocumentationLinkBadge href={href} />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Beside a section title"}
        </figcaption>
      </figure>
    </div>
  );
}
