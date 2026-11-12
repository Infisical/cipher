import { Code } from "@infisical/cipher/ui/code";
import * as UI from "@infisical/cipher/ui/hover-card";

const widths = [
  {
    width: "default",
    trigger: "Staging connection",
    body: "Last synchronized 12 versions. All clients are up to date."
  },
  {
    width: "sm",
    trigger: "SAML provider",
    body: "Okta sends the email, first name and last name attributes. Members sign in through the Infisical app tile in Okta, and new members join with the Member role."
  },
  {
    width: "md",
    trigger: "Raw SCIM event",
    body: '{"schemas":["urn:ietf:params:scim:api:messages:2.0:PatchOp"],"Operations":[{"op":"replace","path":"active","value":false}]}'
  },
  { width: "content", trigger: "Tags", body: "env:production, team:payments" }
] as const;

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      {widths.map(({ width, trigger, body }) => (
        <figure
          key={width}
          className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center"
        >
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <UI.HoverCard>
              <UI.HoverCardTrigger asChild>
                <a href="#hover-card" onClick={(event) => event.preventDefault()}>
                  {trigger}
                </a>
              </UI.HoverCardTrigger>
              <UI.HoverCardContent width={width} align="start">
                {width === "md" ? (
                  <Code block wrap language="json" label="Raw SCIM event">
                    {body}
                  </Code>
                ) : (
                  <p>{body}</p>
                )}
              </UI.HoverCardContent>
            </UI.HoverCard>
          </div>
          <figcaption className="text-muted-foreground text-xs">{width}</figcaption>
        </figure>
      ))}
    </div>
  );
}
