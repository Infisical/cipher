import { TilePicker, type TilePickerItem } from "@infisical/cipher/patterns/tile-picker";
import { Badge } from "@infisical/cipher/ui/badge";

const enterprise = <Badge tone="info">Enterprise</Badge>;

const authorities: TilePickerItem[] = [
  {
    value: "acme",
    title: "ACME",
    description: "Let's Encrypt, ZeroSSL or any ACME directory.",
    icon: "key"
  },
  {
    value: "aws-pca",
    title: "AWS Private CA",
    description: "Certificates issued by a private CA in your AWS account.",
    icon: "cloud",
    badge: enterprise
  },
  {
    value: "azure-adcs",
    title: "Azure AD Certificate Services",
    description: "Enrollment through Active Directory Certificate Services.",
    icon: "users",
    badge: enterprise
  },
  {
    value: "digicert",
    title: "DigiCert",
    icon: "vault",
    badge: enterprise,
    disabledReason: "Needs a gateway in this project."
  },
  {
    value: "incident-io",
    title: "incident.io",
    icon: "zap",
    disabledReason: "Not in this version yet."
  }
];

export default function Example() {
  return (
    <TilePicker
      items={authorities}
      onSelect={() => {}}
      searchLabel="Search certificate authorities"
      noun="certificate authorities"
    />
  );
}
