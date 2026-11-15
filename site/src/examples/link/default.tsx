import { Link } from "@infisical/cipher/ui/link";
import { SmallText, Text } from "@infisical/cipher/ui/text";

export default function Example() {
  return (
    <div className="flex w-full max-w-xl min-w-0 flex-col gap-6">
      <SmallText muted>
        Tokens expire after 30 days. <Link href="#rotation">Set a rotation policy</Link>
      </SmallText>
      <Text>
        Agents read secrets through a machine identity. Grant it a role on the project, then{" "}
        <Link href="#install" underline="always">
          install the agent
        </Link>{" "}
        on each host, or follow the{" "}
        <Link href="https://infisical.com/docs" target="_blank" rel="noreferrer" underline="always">
          deployment guide
        </Link>
        .
      </Text>
      <SmallText muted>
        Webhook deliveries go to{" "}
        <Link href="#endpoint">
          https://hooks.platform-engineering.example.com/infisical/secret-rotation/eu-west-1/production-primary-replica
        </Link>{" "}
        and retry for up to 24 hours.
      </SmallText>
    </div>
  );
}
