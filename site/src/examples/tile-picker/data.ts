import type { TilePickerItem } from "@infisical/cipher/patterns/tile-picker";

export const providers: TilePickerItem[] = [
  {
    value: "1password",
    title: "1Password",
    category: "Password manager",
    icon: "key"
  },
  {
    value: "aws-parameter-store",
    title: "AWS Parameter Store",
    category: "AWS",
    icon: "cloud",
    popular: true
  },
  {
    value: "aws-secrets-manager",
    title: "AWS Secrets Manager",
    category: "AWS",
    icon: "cloud"
  },
  {
    value: "azure-app-configuration",
    title: "Azure App Configuration",
    category: "Azure",
    icon: "cloud"
  },
  {
    value: "azure-devops",
    title: "Azure DevOps",
    category: "Azure",
    icon: "git"
  },
  {
    value: "azure-key-vault",
    title: "Azure Key Vault",
    category: "Azure",
    icon: "vault"
  },
  {
    value: "bitbucket",
    title: "Bitbucket",
    category: "CI/CD",
    icon: "git"
  },
  {
    value: "camunda",
    title: "Camunda",
    category: "Platform",
    icon: "package"
  },
  {
    value: "cloudflare-pages",
    title: "Cloudflare Pages",
    category: "Hosting",
    icon: "globe"
  },
  {
    value: "databricks",
    title: "Databricks",
    category: "Data",
    icon: "chart-column"
  },
  {
    value: "gcp-secret-manager",
    title: "GCP Secret Manager",
    category: "Google Cloud",
    icon: "cloud",
    popular: true
  },
  {
    value: "github",
    title: "GitHub",
    category: "CI/CD",
    icon: "git",
    popular: true
  },
  {
    value: "gitlab",
    title: "GitLab",
    category: "CI/CD",
    icon: "git"
  },
  {
    value: "hashicorp-vault",
    title: "HashiCorp Vault",
    category: "Secrets",
    icon: "vault"
  },
  {
    value: "heroku",
    title: "Heroku",
    category: "Hosting",
    icon: "rocket"
  },
  {
    value: "kubernetes",
    title: "Kubernetes",
    category: "Infrastructure",
    icon: "package"
  },
  {
    value: "netlify",
    title: "Netlify",
    category: "Hosting",
    icon: "globe"
  },
  {
    value: "render",
    title: "Render",
    category: "Hosting",
    icon: "rocket"
  },
  {
    value: "terraform-cloud",
    title: "Terraform Cloud",
    category: "Infrastructure",
    icon: "layout-grid"
  },
  {
    value: "vercel",
    title: "Vercel",
    category: "Hosting",
    icon: "rocket",
    popular: true
  }
];
