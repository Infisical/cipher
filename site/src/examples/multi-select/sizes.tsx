import { MultiSelect } from "@infisical/cipher/ui/multi-select";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      {(["sm", "md"] as const).map((size) => (
        <figure key={size} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <MultiSelect
              size={size}
              label="Role"
              options={[
                { value: "read", label: "Read" },
                { value: "write", label: "Write" }
              ]}
              defaultValue={["read"]}
            />
          </div>
          <figcaption className="text-muted-foreground text-xs">{size}</figcaption>
        </figure>
      ))}
    </div>
  );
}
