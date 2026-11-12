import { Code } from "@infisical/cipher/ui/code";

const samples = [
  ["shell", "export INFISICAL_ENV='staging'"],
  ["env", "INFISICAL_ENV=staging"],
  ["json", '{"enabled":true,"count":9007199254740993}'],
  ["yaml", "enabled: true"],
  ["javascript", 'const environment = "staging";'],
  ["typescript", 'const environment: string = "staging";'],
  ["python", 'environment = "staging"'],
  ["hcl", 'environment = "staging"'],
  ["unknown-language", "  exact unchanged text  "]
] as const;
export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Code block format="plain" code={'  "staging"\t9007199254740993\n'} />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Plain"}</figcaption>
      </figure>
      {samples.map(([language, code]) => (
        <figure key={language} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
            <Code block language={language} code={code} />
          </div>
          <figcaption className="text-muted-foreground text-xs">{language}</figcaption>
        </figure>
      ))}
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Code
            block
            wrap
            maxLines={3}
            lineNumbers
            highlight={[2]}
            code={Array.from(
              { length: 8 },
              (_, index) =>
                `Version ${index + 1}: applications/staging/services/payment-processing/configuration`
            ).join("\n")}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Wrapped and bounded"}</figcaption>
      </figure>
    </div>
  );
}
