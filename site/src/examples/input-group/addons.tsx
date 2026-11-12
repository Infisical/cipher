import { Field } from "@infisical/cipher/ui/field";
import { Icon } from "@infisical/cipher/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea
} from "@infisical/cipher/ui/input-group";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      {(["inline-start", "inline-end", "block-start", "block-end"] as const).map((align) => (
        <figure key={align} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <Field label={`${align} query`}>
              <InputGroup>
                <InputGroupAddon align={align}>
                  {align.startsWith("inline") ? (
                    <Icon name="search" />
                  ) : (
                    <InputGroupText>Query</InputGroupText>
                  )}
                </InputGroupAddon>
                {align.startsWith("inline") ? (
                  <InputGroupInput defaultValue="payments" />
                ) : (
                  <InputGroupTextarea rows={3} defaultValue="Select name from environments" />
                )}
              </InputGroup>
            </Field>
          </div>
          <figcaption className="text-muted-foreground text-xs">{align}</figcaption>
        </figure>
      ))}
    </div>
  );
}
