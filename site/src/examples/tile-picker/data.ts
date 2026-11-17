import type { TilePickerItem } from "@infisical/cipher/patterns/tile-picker";

export const providers: TilePickerItem[] = [
  {
    value: "1password",
    title: "1Password",
    description: "Items in a 1Password vault.",
    eyebrow: "Password manager",
    icon: "key"
  },
  {
    value: "aws-parameter-store",
    title: "AWS Parameter Store",
    description: "Hierarchical parameter store on AWS Systems Manager.",
    eyebrow: "AWS",
    icon: "cloud",
    popular: true
  },
  {
    value: "aws-secrets-manager",
    title: "AWS Secrets Manager",
    description: "Managed secret rotation and audit on AWS.",
    eyebrow: "AWS",
    icon: "cloud"
  },
  {
    value: "azure-app-configuration",
    title: "Azure App Configuration",
    description: "Centralized app settings on Microsoft Azure.",
    eyebrow: "Azure",
    icon: "cloud"
  },
  {
    value: "azure-devops",
    title: "Azure DevOps",
    description: "Pipeline variables for Azure DevOps projects.",
    eyebrow: "Azure",
    icon: "git"
  },
  {
    value: "azure-key-vault",
    title: "Azure Key Vault",
    description: "Cloud-managed keys, secrets, and certificates.",
    eyebrow: "Azure",
    icon: "vault"
  },
  {
    value: "bitbucket",
    title: "Bitbucket",
    description: "Repository and deployment variables on Bitbucket.",
    eyebrow: "CI/CD",
    icon: "git"
  },
  {
    value: "camunda",
    title: "Camunda",
    description: "Cluster secrets for Camunda Platform 8.",
    eyebrow: "Platform",
    icon: "package"
  },
  {
    value: "cloudflare-pages",
    title: "Cloudflare Pages",
    description: "Environment variables for Pages projects.",
    eyebrow: "Hosting",
    icon: "globe"
  },
  {
    value: "databricks",
    title: "Databricks",
    description: "Secret scopes in a Databricks workspace.",
    eyebrow: "Data",
    icon: "chart-column"
  },
  {
    value: "gcp-secret-manager",
    title: "GCP Secret Manager",
    description: "Versioned secret storage on Google Cloud.",
    eyebrow: "Google Cloud",
    icon: "cloud",
    popular: true
  },
  {
    value: "github",
    title: "GitHub",
    description: "Actions, Dependabot, or Codespaces secrets.",
    eyebrow: "CI/CD",
    icon: "git",
    popular: true
  },
  {
    value: "gitlab",
    title: "GitLab",
    description: "CI/CD variables for a project or group.",
    eyebrow: "CI/CD",
    icon: "git"
  },
  {
    value: "hashicorp-vault",
    title: "HashiCorp Vault",
    description: "KV secrets engine on a Vault cluster.",
    eyebrow: "Secrets",
    icon: "vault"
  },
  {
    value: "heroku",
    title: "Heroku",
    description: "Config vars for a Heroku app.",
    eyebrow: "Hosting",
    icon: "rocket"
  },
  {
    value: "kubernetes",
    title: "Kubernetes",
    description: "Secrets in a cluster namespace.",
    eyebrow: "Infrastructure",
    icon: "package"
  },
  {
    value: "netlify",
    title: "Netlify",
    description: "Environment variables for Netlify sites.",
    eyebrow: "Hosting",
    icon: "globe"
  },
  {
    value: "render",
    title: "Render",
    description: "Environment groups on Render.",
    eyebrow: "Hosting",
    icon: "rocket"
  },
  {
    value: "terraform-cloud",
    title: "Terraform Cloud",
    description: "Workspace and variable set values.",
    eyebrow: "Infrastructure",
    icon: "layout-grid"
  },
  {
    value: "vercel",
    title: "Vercel",
    description: "Push environment variables to Vercel projects.",
    eyebrow: "Hosting",
    icon: "rocket",
    popular: true
  }
];
