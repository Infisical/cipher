import { Cover } from "@infisical/cipher/ui/cover";

export default function Example() {
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <Cover
          title={
            <>
              Infisical
              <br />
              v4
            </>
          }
          tagline="A quiet interface for secrets, certificates and access."
        />
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"Brand cover, scales with its container"}
      </figcaption>
    </figure>
  );
}
