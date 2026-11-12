import { Snippet } from "@infisical/cipher/ui/snippet";

const certificate = [
  "-----BEGIN CERTIFICATE-----",
  "MIIDdzCCAl+gAwIBAgIEAgAAuTANBgkqhkiG9w0BAQUFADBaMQswCQYDVQQGEwJJ",
  "RTESMBAGA1UEChMJQmFsdGltb3JlMRMwEQYDVQQLEwpDeWJlclRydXN0MSIwIAYD",
  "VQQDExlCYWx0aW1vcmUgQ3liZXJUcnVzdCBSb290MB4XDTAwMDUxMjE4NDYwMFoX",
  "DTI1MDUxMjIzNTkwMFowWjELMAkGA1UEBhMCSUUxEjAQBgNVBAoTCUJhbHRpbW9y",
  "ZTETMBEGA1UECxMKQ3liZXJUcnVzdDEiMCAGA1UEAxMZQmFsdGltb3JlIEN5YmVy",
  "-----END CERTIFICATE-----"
].join("\n");

const record =
  "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx3N9q2Lr8vT0uJbW6yZcF4mQp1sHkE7aD5gR2nX9oVtY3iCwB8eUjK6lMzPqS0fA4hN1rG7dL2vT5yW9xK3bQ8mE6pJ0cZ1uH4nR7sD2gF5aY8tV3wB6iL9oP0qX2kM4jC7eN1rT5yU8hG3dF6sA9zQ2wE5rT8yU1iO4pL7kJ0hG3fD6sA9zX2cV5bN8mQ1wE4rT7yU0iO3pL6kJ9hG2fD5sA8zX1cV4bN7mQ0wE3rT6yU9iO2pL5kJ8hG1fD4sA7zX0cV3bN6mIDAQAB";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Snippet
            label="CA certificate"
            copyLabel="Copy certificate"
            value={certificate}
            maxLines={4}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Line breaks, maxLines 4, scrolls"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Snippet
            label="TXT record value"
            copyLabel="Copy record value"
            value={record}
            maxLines={3}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Long value wraps, maxLines 3"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Snippet
            label="Login and run"
            size="md"
            prompt="$"
            value={
              "infisical login --domain=https://eu.infisical.com\ninfisical run --env=staging -- npm start"
            }
            maxLines={4}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"md with prompt"}</figcaption>
      </figure>
    </div>
  );
}
