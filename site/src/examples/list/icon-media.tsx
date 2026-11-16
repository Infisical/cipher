import { Icon } from "@infisical/cipher/ui/icon";
import { List, ListRow } from "@infisical/cipher/ui/list";

export default function Example() {
  return (
    <List label="Environments">
      <ListRow
        value="production"
        label="Production"
        title="Production"
        media={<Icon name="lock" />}
      />
      <ListRow
        value="staging"
        label="Staging"
        title="Staging"
        description="Mirrors production nightly at 02:00 UTC."
        media={<Icon name="sync" />}
      />
      <ListRow
        value="development"
        label="Development"
        title="Development"
        description="Shared by every engineer on the team."
        media={<Icon name="user" />}
        disabled
      />
    </List>
  );
}
