import { Checkbox } from "@infisical/cipher/ui/checkbox";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Checkbox label="Deployments" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Off"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Checkbox label="Deployments" defaultChecked />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"On"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Checkbox label="All environments" indeterminate />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Mixed"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Checkbox label="Audit events" disabled defaultChecked />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Disabled"}</figcaption>
      </figure>
    </div>
  );
}
