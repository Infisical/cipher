import { Code } from "@infisical/cipher/ui/code";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <p>
        Set <Code>INFISICAL_ENV</Code> in your environment.
      </p>
      <Code
        block
        language="shell"
        lineNumbers
        highlight={[2]}
        code={"infisical login\ninfisical run -- npm start"}
      />
    </div>
  );
}
