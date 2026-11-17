import {
  ProviderPicker,
  type ProviderPickerItem
} from "@infisical/cipher/patterns/provider-picker";

const items: ProviderPickerItem[] = [
  {
    value: "aws-secrets-manager-gov",
    title: "AWS Secrets Manager in GovCloud (US-West) with cross-account replication",
    description:
      "Managed secret rotation, audit, and cross-account replication for regulated workloads in AWS GovCloud.",
    category: "Amazon Web Services GovCloud",
    icon: "cloud",
    popular: true
  },
  {
    value: "azure-entra-scim",
    title: "Azure Entra ID SCIM",
    description: "SCIM provisioning tokens for Azure Entra ID Enterprise Applications.",
    category: "Azure",
    icon: "users",
    popular: true,
    disabledReason: "Not available in this version yet. Use the classic app to set it up."
  },
  {
    value: "github",
    title: "GitHub",
    description: "Actions, Dependabot, or Codespaces secrets.",
    category: "CI/CD",
    icon: "git"
  },
  {
    value: "oci-vault",
    title: "Oracle Cloud Infrastructure Vault",
    description:
      "Secrets in an OCI Vault compartment, encrypted with a customer-managed master encryption key.",
    category: "Oracle Cloud Infrastructure",
    icon: "vault",
    disabledReason: "Your plan doesn't include this destination."
  },
  {
    value: "windmill",
    title: "Windmill",
    category: "Automation",
    icon: "zap"
  }
];

export default function Example() {
  return <ProviderPicker items={items} onSelect={() => {}} searchPlaceholder="Search providers" />;
}
