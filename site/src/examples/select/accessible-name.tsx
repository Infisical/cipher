import { Select } from "@infisical/cipher/ui/select";

const options = [
  { value: "dev", label: "Development" },
  { value: "staging", label: "Staging" },
  { value: "prod", label: "Production" }
];
export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Select options={options} defaultValue="staging" aria-label="Environment" />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"aria-label, no visible label"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="flex flex-col gap-2">
            <span id="select-name-heading">Compare against</span>
            <Select
              options={options}
              placeholder="Choose an environment"
              aria-labelledby="select-name-heading"
            />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"aria-labelledby a visible heading"}
        </figcaption>
      </figure>
    </div>
  );
}
