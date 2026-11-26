import { Button } from "@infisical/cipher/ui/button";
import { CodeBlock } from "@infisical/cipher/ui/code-block";

const command = "infisical export --env=production --format=dotenv > production.env";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <CodeBlock
            label="Export production secrets"
            icon="terminal"
            language="bash"
            wrap
            code={command}
            actions={
              <Button variant="ghost" icon="download">
                Download
              </Button>
            }
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Full width"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full max-w-80 min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <CodeBlock
            label="Export production secrets"
            icon="terminal"
            language="bash"
            wrap
            code={command}
            actions={
              <Button variant="ghost" icon="download">
                Download
              </Button>
            }
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Narrow container, actions move below the label together"}
        </figcaption>
      </figure>
    </div>
  );
}
