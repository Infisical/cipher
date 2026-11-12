import { CodeBlock } from "@infisical/cipher/ui/code-block";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <CodeBlock
            label="environment.env"
            icon="file"
            language="env"
            lineNumbers
            highlight={[2]}
            code={"INFISICAL_ENV=staging\nLOG_LEVEL=info\nAPI_URL=https://example.com/api"}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"File, framed shell"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <CodeBlock
            label="Terminal"
            icon="terminal"
            language="bash"
            wrap
            code="infisical run --env=staging -- npm run dev"
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Terminal command"}</figcaption>
      </figure>
    </div>
  );
}
