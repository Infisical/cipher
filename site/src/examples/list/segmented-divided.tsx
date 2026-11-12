import { Button } from "@infisical/cipher/ui/button";
import { Media } from "@infisical/cipher/ui/item";
import { List, ListFooter, ListHeader, ListRow, ListSection } from "@infisical/cipher/ui/list";

const header = (
  <ListHeader
    title="What's new"
    count="2 unread"
    action={
      <Button variant="link" size="sm" asChild>
        <a href="#list">View all</a>
      </Button>
    }
  />
);

const sections = (variant: string) => [
  <ListSection key="week" label="This week">
    <ListRow
      value={`${variant}-gateway-pools`}
      label="Gateway pools"
      title="Gateway pools"
      description="Route PAM sessions through any healthy gateway in a pool."
      media={<Media icon="globe" />}
      meta="Nov 5"
      href="#list"
      unread
    />
    <ListRow
      value={`${variant}-rotation`}
      label="Scheduled rotation for Postgres"
      title="Scheduled rotation for Postgres"
      description="Rotate database credentials on a schedule you set per environment."
      media={<Media icon="key" />}
      meta="Nov 4"
      href="#list"
      unread
    />
  </ListSection>,
  <ListSection key="earlier" label="Earlier">
    <ListRow
      value={`${variant}-audit-streams`}
      label="Audit log streams to Datadog"
      title="Audit log streams to Datadog"
      description="Send every audit event to Datadog as it happens."
      media={<Media icon="sync" />}
      meta="Oct 28"
      href="#list"
    />
    <ListRow
      value={`${variant}-sso`}
      label="SSO enforcement for sub-organizations"
      title="SSO enforcement for sub-organizations"
      description="Require SSO in every sub-organization from the parent's settings."
      media={<Media icon="lock" />}
      meta="Oct 21"
      href="#list"
      resolved
    />
  </ListSection>
];

const footer = (
  <ListFooter>
    <Button variant="link" size="sm" asChild>
      <a href="#list">Release notes</a>
    </Button>
  </ListFooter>
);

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List label="What's new" variant="segmented">
            {header}
            {sections("segmented")}
            {footer}
          </List>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"segmented"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List label="What's new" variant="divided">
            {header}
            {sections("divided")}
            {footer}
          </List>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"divided"}</figcaption>
      </figure>
    </div>
  );
}
