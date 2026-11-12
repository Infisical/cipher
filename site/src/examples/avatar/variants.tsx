import { Avatar } from "@infisical/cipher/ui/avatar";

const identities = [
  { kind: "person", name: "Ada Morgan" },
  { kind: "machine", name: "Deployment service" },
  { kind: "agent", name: "Rotation agent" },
  { kind: "fallback", name: "Unknown member" }
] as const;
export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      {identities.map(({ kind, name }) => (
        <figure
          key={kind}
          className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center"
        >
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <Avatar kind={kind} name={name} />
          </div>
          <figcaption className="text-muted-foreground text-xs">{kind}</figcaption>
        </figure>
      ))}
    </div>
  );
}
