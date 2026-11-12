import { Field } from "@infisical/cipher/ui/field";
import { Snippet } from "@infisical/cipher/ui/snippet";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      {(["sm", "md"] as const).map((size) => (
        <figure key={size} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <Snippet
              label={`${size} command`}
              size={size}
              value="infisical run -- npm start"
              prompt="$"
            />
          </div>
          <figcaption className="text-muted-foreground text-xs">{size}</figcaption>
        </figure>
      ))}
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Snippet label="Managed environment" value="INFISICAL_ENV=staging" copyable={false} />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"No prompt, copy disabled"}
        </figcaption>
      </figure>
      <Field label="Unavailable command" error="Choose a project before using this command.">
        <Snippet
          label="Unavailable command"
          value="infisical run --projectId=project_staging -- npm start"
          copyable={false}
        />
      </Field>
    </div>
  );
}
