import { Avatar, AvatarGroup } from "@infisical/cipher/ui/avatar";
import { DataList, List, ListRow } from "@infisical/cipher/ui/list";

const approvers = [
  { name: "Ada Morgan", description: "ada.morgan@example.com" },
  { name: "Sam Lee", description: "sam.lee@example.com" }
];
const reviewers = ["Ada Morgan", "Sam Lee", "Mina Patel", "Rory Chen", "Eli Ford", "Noor Haddad"];

export default function ApprovalStep() {
  return (
    <div className="flex w-full max-w-md min-w-0 flex-col gap-4">
      <DataList
        variant="props"
        items={[
          ["Policy", "Production secret changes"],
          ["Required approvals", "2 of 3"]
        ]}
      />
      <List label="Approvers" variant="flush">
        {approvers.map(({ name, description }) => (
          <ListRow
            key={name}
            value={name}
            label={name}
            title={name}
            description={description}
            media={<Avatar name={name} />}
          />
        ))}
        <ListRow
          value="platform-admins"
          label="Platform admins"
          title="Platform admins"
          description="Group, 4 members"
          media={<Avatar kind="group" name="Platform admins" />}
        />
      </List>
      <AvatarGroup max={4} label="Reviewed by">
        {reviewers.map((name) => (
          <Avatar key={name} name={name} label={name} />
        ))}
      </AvatarGroup>
    </div>
  );
}
