import { Button } from "@infisical/cipher/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText
} from "@infisical/cipher/ui/button-group";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <ButtonGroup label="Version history">
            <Button variant="outline" icon="chev-left">
              Older
            </Button>
            <ButtonGroupText>v12</ButtonGroupText>
            <Button variant="outline" iconRight="chev-right">
              Newer
            </Button>
          </ButtonGroup>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"attached"}</figcaption>
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
