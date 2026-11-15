import { ShareBar } from "@infisical/cipher/ui/share-bar";

const methods = [
  { id: "universal-auth", label: "Universal Auth", value: 18_240 },
  { id: "kubernetes", label: "Kubernetes Auth", value: 9_615 },
  { id: "user", label: "User session", value: 4_120 },
  { id: "aws", label: "AWS IAM Auth", value: 2_388 },
  { id: "oidc", label: "OIDC Auth", value: 914 }
];

export default function Example() {
  return (
    <figure className="m-0 flex w-full max-w-xl min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <ShareBar label="Auth methods" items={methods} />
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"Secret access by auth method, past 30 days"}
      </figcaption>
    </figure>
  );
}
