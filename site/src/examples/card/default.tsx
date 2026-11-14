import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@infisical/cipher/ui/card";
import { Media } from "@infisical/cipher/ui/item";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card variant="framed" title="Posture" action={<a href="#card">View report</a>}>
            412 secrets across 3 environments. 3 are missing in production and 5 rotations are due
            this week.
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"framed"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card variant="framed" footer="Expires in 7 days.">
            <div className="flex items-center gap-3">
              <Media icon="key" />
              <span>Read access to staging, scoped to the payments project.</span>
            </div>
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"framed, no header, with footer"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card
            variant="framed"
            footer="412 secrets in 3 environments, 5 rotations due"
            footerPlacement="frame"
          >
            Read access to staging, scoped to the payments project.
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"framed footer"}</figcaption>
      </figure>
      {(
        [
          ["w-60", "narrow, 240px"],
          ["w-80", "narrow, 320px"],
          ["w-96", "narrow, 384px"]
        ] as const
      ).map(([width, label]) => (
        <figure key={width} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
            <div className={`${width} max-w-full min-w-0`} data-narrow-card>
              <Card
                variant="framed"
                title="Posture"
                action={<a href="#card">View report</a>}
                footer="Updated today"
              >
                412 secrets across 3 environments.
              </Card>
            </div>
          </div>
          <figcaption className="text-muted-foreground text-xs">{label}</figcaption>
        </figure>
      ))}
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card variant="plain">
            <CardHeader>
              <CardTitle>Environment defaults</CardTitle>
              <CardDescription>Inherited by new connections.</CardDescription>
            </CardHeader>
            <CardContent>The default environment is staging.</CardContent>
            <CardFooter>Updated today</CardFooter>
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"plain"}</figcaption>
      </figure>
    </div>
  );
}
