import { Button } from "@infisical/cipher/ui/button";
import { Input } from "@infisical/cipher/ui/input";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText
} from "@infisical/cipher/ui/button-group";

const version = 12;

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <ButtonGroup label="Version history">
            <Button variant="outline" icon="chev-left">
              Older
            </Button>
            <ButtonGroupText>v{version}</ButtonGroupText>
            <Button variant="outline" iconRight="chev-right">
              Newer
            </Button>
          </ButtonGroup>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"attached"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full max-w-60 min-w-0 flex-col items-stretch gap-3">
          <ButtonGroup label="Sort" className="max-w-full">
            <Button
              variant="outline"
              size="xs"
              icon="chev-left"
              iconOnly
              aria-label="Previous sort"
            />
            <ButtonGroupText size="xs">Sorted by last rotated, newest first</ButtonGroupText>
            <Button variant="outline" size="xs" icon="chev-right" iconOnly aria-label="Next sort" />
          </ButtonGroup>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"xs, truncated"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <ButtonGroup label="Filter" className="w-full">
            <Input aria-label="Filter secrets" placeholder="Filter" />
            <Button variant="outline">Apply</Button>
          </ButtonGroup>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"with input"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <ButtonGroup orientation="vertical" label="Zoom">
            <Button variant="outline" icon="plus" iconOnly aria-label="Zoom in" />
            <Button variant="outline" icon="minus" iconOnly aria-label="Zoom out" />
          </ButtonGroup>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"vertical"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <ButtonGroup label="Version history">
            <Button variant="outline" icon="chev-left" disabled>
              Older
            </Button>
            <ButtonGroupText>v1</ButtonGroupText>
            <Button variant="outline" iconRight="chev-right">
              Newer
            </Button>
          </ButtonGroup>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"disabled"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <ButtonGroup label="Editor">
            <ButtonGroup label="History">
              <Button variant="outline" icon="chev-left" iconOnly aria-label="Back" />
              <Button variant="outline" icon="chev-right" iconOnly aria-label="Forward" />
            </ButtonGroup>
            <ButtonGroup label="Copy">
              <Button variant="outline" icon="copy" iconOnly aria-label="Copy" />
              <Button variant="outline" icon="download" iconOnly aria-label="Download" />
            </ButtonGroup>
          </ButtonGroup>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"nested"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <ButtonGroup variant="toolbar" label="Secret actions">
            <Button variant="ghost" icon="copy" iconOnly aria-label="Copy value" />
            <Button variant="ghost" icon="download" iconOnly aria-label="Download" />
            <ButtonGroupSeparator />
            <Button variant="ghost" icon="trash" iconOnly aria-label="Delete" />
          </ButtonGroup>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"toolbar"}</figcaption>
      </figure>
    </div>
  );
}
