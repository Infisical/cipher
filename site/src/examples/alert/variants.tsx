import { Alert, AlertDescription, AlertTitle } from "@infisical/cipher/ui/alert";
import { Button } from "@infisical/cipher/ui/button";
import { Code } from "@infisical/cipher/ui/code";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      {(["default", "destructive"] as const).map((variant) => (
        <figure key={variant} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
            <Alert variant={variant}>
              <AlertTitle>Connection needs review</AlertTitle>
              <AlertDescription>
                The provider configuration differs from the saved version.
              </AlertDescription>
            </Alert>
          </div>
          <figcaption className="text-muted-foreground text-xs">{variant}</figcaption>
        </figure>
      ))}
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Alert
            title="Connection needs review"
            tone="warn"
            actions={
              <Button asChild variant="outline">
                <a href="#input">Review configuration</a>
              </Button>
            }
          >
            The provider configuration differs from the saved version.
          </Alert>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Action"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Alert
            tone="info"
            actions={
              <Button variant="outline" size="sm">
                Open billing settings
              </Button>
            }
          >
            Self-hosted licenses renew from the billing contact on file.
          </Alert>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"No title"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Alert
            tone="bad"
            title={
              <>
                Price not saved for <Code>enterprise-annual</Code>
              </>
            }
          >
            Another draft of this plan was published first. Reload to see it.
          </Alert>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Node title"}</figcaption>
      </figure>
    </div>
  );
}
