import type { ProviderPickerItem } from "@infisical/cipher/patterns/provider-picker";

export const providers: ProviderPickerItem[] = [
  {
    value: "1password",
    title: "1Password",
    description: "Items in a 1Password vault.",
    category: "Password manager",
    icon: "key"
  },
  {
    value: "aws-parameter-store",
    title: "AWS Parameter Store",
    description: "Hierarchical parameter store on AWS Systems Manager.",
    category: "AWS",
    icon: "cloud",
    popular: true
  },
  {
    value: "aws-secrets-manager",
    title: "AWS Secrets Manager",
    description: "Managed secret rotation and audit on AWS.",
    category: "AWS",
    icon: "cloud"
  },
  {
    value: "azure-app-configuration",
    title: "Azure App Configuration",
    description: "Centralized app settings on Microsoft Azure.",
    category: "Azure",
    icon: "cloud"
  },
  {
    value: "azure-devops",
    title: "Azure DevOps",
    description: "Pipeline variables for Azure DevOps projects.",
    category: "Azure",
    icon: "git"
  },
  {
    value: "azure-key-vault",
    title: "Azure Key Vault",
    description: "Cloud-managed keys, secrets, and certificates.",
    category: "Azure",
    icon: "vault"
  },
  {
    value: "bitbucket",
    title: "Bitbucket",
    description: "Repository and deployment variables on Bitbucket.",
    category: "CI/CD",
    icon: "git"
  },
  {
    value: "camunda",
    title: "Camunda",
    description: "Cluster secrets for Camunda Platform 8.",
    category: "Platform",
    icon: "package"
  },
  {
    value: "cloudflare-pages",
    title: "Cloudflare Pages",
    description: "Environment variables for Pages projects.",
    category: "Hosting",
    icon: "globe"
  },
  {
    value: "databricks",
    title: "Databricks",
    description: "Secret scopes in a Databricks workspace.",
    category: "Data",
    icon: "chart-column"
  },
  {
    value: "gcp-secret-manager",
    title: "GCP Secret Manager",
    description: "Versioned secret storage on Google Cloud.",
    category: "Google Cloud",
    icon: "cloud",
    popular: true
  },
  {
    value: "github",
    title: "GitHub",
    description: "Actions, Dependabot, or Codespaces secrets.",
    category: "CI/CD",
    icon: "git",
    popular: true
  },
  {
    value: "gitlab",
    title: "GitLab",
    description: "CI/CD variables for a project or group.",
    category: "CI/CD",
    icon: "git"
  },
  {
    value: "hashicorp-vault",
    title: "HashiCorp Vault",
    description: "KV secrets engine on a Vault cluster.",
    category: "Secrets",
    icon: "vault"
  },
  {
    value: "heroku",
    title: "Heroku",
    description: "Config vars for a Heroku app.",
    category: "Hosting",
    icon: "rocket"
  },
  {
    value: "kubernetes",
    title: "Kubernetes",
    description: "Secrets in a cluster namespace.",
    category: "Infrastructure",
    icon: "package"
  },
  {
    value: "netlify",
    title: "Netlify",
    description: "Environment variables for Netlify sites.",
    category: "Hosting",
    icon: "globe"
  },
  {
    value: "render",
    title: "Render",
    description: "Environment groups on Render.",
    category: "Hosting",
    icon: "rocket"
  },
  {
    value: "terraform-cloud",
    title: "Terraform Cloud",
    description: "Workspace and variable set values.",
    category: "Infrastructure",
    icon: "layout-grid"
  },
  {
    value: "vercel",
    title: "Vercel",
    description: "Push environment variables to Vercel projects.",
    category: "Hosting",
    icon: "rocket",
    popular: true
  }
];
