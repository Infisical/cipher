import { Button } from "@infisical/cipher/ui/button";
import { CodeBlock } from "@infisical/cipher/ui/code-block";
import { Tooltip } from "@infisical/cipher/ui/tooltip";

const privateKey = [
  "-----BEGIN PRIVATE KEY-----",
  "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDExampleOnlyNot",
  "ARealKeyQ2xpZW50S2V5Rm9yRG9jdW1lbnRhdGlvblB1cnBvc2VzT25seUV4YW1w",
  "bGVTaWduaW5nS2V5TWF0ZXJpYWxUaGF0SXNOb3RVc2VkQW55d2hlcmVJblByb2R1",
  "Y3Rpb25UaGlzSXNKdXN0UGxhY2Vob2xkZXJUZXh0Rm9yVGhlU2hvd2Nhc2VQYWdl",
  "-----END PRIVATE KEY-----"
].join("\n");

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <CodeBlock
            sensitive
            label="private-key.pem"
            icon="file-key"
            copyLabel="Copy private key"
            wrap
            code={privateKey}
            actions={
              <Tooltip content="Download">
                <Button variant="ghost" icon="download" iconOnly>
                  Download private key
                </Button>
              </Tooltip>
            }
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Masked until revealed; copy and download use the real value"}
        </figcaption>
      </figure>
    </div>
  );
}
