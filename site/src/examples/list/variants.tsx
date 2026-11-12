import { List, ListRow, ListSection } from "@infisical/cipher/ui/list";

const rows = (prefix: string) => (
  <>
    <ListRow
      value={`${prefix}-api`}
      label="API service"
      title="API service"
      description="Reads production secrets"
      meta="12 secrets"
    />
    <ListRow
      value={`${prefix}-worker`}
      label="Queue worker"
      title="Queue worker"
      description="Reads staging secrets"
      meta="4 secrets"
    />
  </>
);
export default function Variants() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List
            label="Machine identities"
            title="Machine identities"
            action={<a href="#list">View all</a>}
          >
            {rows("framed")}
          </List>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"md"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List label="Grouped identities">
            <ListSection label="Production" meta="2">
              {rows("production")}
            </ListSection>
            <ListSection label="Staging" meta="1">
              <ListRow
                value="staging-preview"
                label="Preview deploys"
                title="Preview deploys"
                description="Reads staging secrets"
                meta="3 secrets"
              />
            </ListSection>
          </List>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"framed, sections"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List label="Plain identities" variant="plain">
            {rows("plain")}
          </List>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"plain"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List label="Bare identities" variant="bare">
            {rows("bare")}
          </List>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"bare"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List label="Small identities" size="sm" title="Identities">
            {rows("sm")}
          </List>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"sm"}</figcaption>
      </figure>
    </div>
  );
}
