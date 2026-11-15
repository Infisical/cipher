import { ShareBar } from "@infisical/cipher/ui/share-bar";

const methods = [
  { id: "universal-auth", label: "Universal Auth", value: 1_284_512 },
  {
    id: "kubernetes",
    label: "Kubernetes Auth for the payments-service-production-us-east-1 cluster service accounts",
    value: 642_090
  },
  { id: "user", label: "User session", value: 210_774 },
  { id: "aws", label: "AWS IAM Auth", value: 98_312 },
  { id: "gcp", label: "GCP ID Token Auth", value: 22_405 },
  { id: "azure", label: "Azure Auth", value: 9_870 },
  { id: "oidc", label: "OIDC Auth", value: 3_114 },
  { id: "ldap", label: "LDAP Auth", value: 412 },
  { id: "token", label: "Token Auth", value: 37 },
  { id: "unknown", label: "Unknown", value: 4 }
];

const tiny = [
  { id: "universal-auth", label: "Universal Auth", value: 99_870 },
  { id: "token", label: "Token Auth", value: 130 },
  { id: "jwt", label: "JWT Auth", value: 3 }
];

export default function Example() {
  return (
    <div className="flex w-full max-w-xl min-w-0 flex-col gap-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <ShareBar label="Auth methods" items={methods} />
        <figcaption className="text-muted-foreground text-xs">
          {"Ten methods, the smallest five folded into Other"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <ShareBar label="Auth methods" items={tiny} />
        <figcaption className="text-muted-foreground text-xs">
          {"Shares under 1% keep a visible sliver"}
        </figcaption>
      </figure>
    </div>
  );
}
