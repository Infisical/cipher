import { CodeBlock } from "@infisical/cipher/ui/code-block";

const code = `package main

import (
	"context"
	"fmt"

	infisical "github.com/infisical/go-sdk"
)

// main reads one secret and prints its key.
func main() {
	client := infisical.NewInfisicalClient(context.Background(), infisical.Config{
		SiteUrl: "https://app.infisical.com",
	})

	secret, err := client.Secrets().Retrieve(infisical.RetrieveSecretOptions{
		SecretKey:   "DATABASE_URL",
		Environment: "staging",
		ProjectID:   "6f1c2a3b",
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(secret.SecretKey)
}`;

export default function Example() {
  return (
    <CodeBlock label="main.go" icon="file" language="go" lineNumbers highlight={[16]} code={code} />
  );
}
