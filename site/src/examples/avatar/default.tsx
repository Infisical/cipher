import { Avatar, AvatarGroup } from "@infisical/cipher/ui/avatar";

const members = ["Ada Morgan", "Sam Lee", "Mina Patel", "Rory Chen", "Eli Ford"];
export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <AvatarGroup max={3} label="Project members">
            {members.map((name) => (
              <Avatar key={name} name={name} />
            ))}
          </AvatarGroup>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Group of five, max 3"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <AvatarGroup size={24} label="Reviewers">
            {members.slice(0, 3).map((name) => (
              <Avatar key={name} name={name} />
            ))}
          </AvatarGroup>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Small group"}</figcaption>
      </figure>
    </div>
  );
}
