import { Button } from "@infisical/cipher/ui/button";
import { Card } from "@infisical/cipher/ui/card";

const cases = [
  {
    caption: "Long title, short action",
    title: "Inherited secrets from production-databases",
    action: "Manage"
  },
  {
    caption: "Short title, long action",
    title: "Inherited",
    action: "View 1,284 inherited secrets in production-databases"
  },
  {
    caption: "Text action",
    title: "Inherited",
    action: "Last synced from production-databases 3 minutes ago",
    text: true
  },
  {
    caption: "Both long",
    title: "Inherited secrets from production-databases",
    action: "View 1,284 inherited secrets in production-databases"
  }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      {cases.map((item) => (
        <figure key={item.caption} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <Card
            variant="framed"
            title={item.title}
            action={
              "text" in item ? (
                item.action
              ) : (
                <Button variant="outline" size="xs">
                  {item.action}
                </Button>
              )
            }
          >
            12 secrets.
          </Card>
          <figcaption className="text-muted-foreground text-xs">{item.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
