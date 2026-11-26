import { Icon } from "@infisical/cipher/ui/icon";
import { Item, Media } from "@infisical/cipher/ui/item";

const figures = [
  {
    caption: "Short title: the icon centers on the title line",
    title: "Staging service",
    description: undefined,
    error: undefined
  },
  {
    caption: "Wrapping title: the icon stays beside the first line",
    title: "Read and write access to every production secret in the payments-api project",
    description: undefined,
    error: undefined
  },
  {
    caption: "Title, description and error: each icon sits on its own first line",
    title: "Deployment service",
    description: "Rotates the database credentials every 30 days and writes them to the vault",
    error: "The last rotation failed because the database rejected the new credentials"
  },
  {
    caption: "Small row with a media block: the block stays at the top as the title wraps",
    title: "Read and write access to every production secret in the payments-api project",
    description: undefined,
    error: undefined,
    small: true
  }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8 md:grid-cols-3">
      {figures.map((figure) => (
        <figure key={figure.caption} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <Item
            variant="outline"
            truncate={false}
            size={figure.small ? "sm" : undefined}
            media={figure.small ? <Media icon="key" size="sm" /> : <Icon name="key" />}
            title={figure.title}
            description={figure.description}
            error={figure.error}
          />
          <figcaption className="text-muted-foreground text-xs">{figure.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
