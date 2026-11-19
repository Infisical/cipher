import { Input } from "@infisical/cipher/ui/input";
import { Textarea } from "@infisical/cipher/ui/textarea";

const Case = ({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) => (
  <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
    <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
      {children}
    </div>
    <figcaption className="text-muted-foreground text-xs">{caption}</figcaption>
  </figure>
);

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <Case caption="The full placeholder while it fits">
        <Input
          icon="search"
          placeholder="Search secrets by key, value, tag or comment"
          placeholderShort="Search secrets"
        />
      </Case>
      <Case caption="Narrow: the short placeholder">
        <div className="w-56 max-w-full">
          <Input
            icon="search"
            placeholder="Search secrets by key, value, tag or comment"
            placeholderShort="Search secrets"
          />
        </div>
      </Case>
      <Case caption="Without a short form, a Textarea placeholder truncates on one line">
        <div className="w-56 max-w-full">
          <Textarea placeholder="Describe why this identity needs production access" />
        </div>
      </Case>
    </div>
  );
}
