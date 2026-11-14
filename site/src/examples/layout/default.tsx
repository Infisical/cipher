import { Button } from "@infisical/cipher/ui/button";
import { Input } from "@infisical/cipher/ui/input";
import { Container, Grid, Inline, InlineGrow, Measure, Stack } from "@infisical/cipher/ui/layout";
import { Heading, SmallText } from "@infisical/cipher/ui/text";

const tile = "bg-muted px-3 py-2 text-center";

export default function Example() {
  return (
    <Container>
      <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
        <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <Stack gap={8}>
              <span className={tile}>Secrets</span>
              <span className={tile}>Identities</span>
              <span className={tile}>Certificates</span>
            </Stack>
          </div>
          <figcaption className="text-muted-foreground text-xs">{"Stack"}</figcaption>
        </figure>
        <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <Inline gap={8}>
              <Button variant="outline">Form guide</Button>
              <Button variant="outline">Input guide</Button>
              <Button variant="outline">Typography</Button>
            </Inline>
          </div>
          <figcaption className="text-muted-foreground text-xs">
            {"Inline, wraps when the row runs out of room"}
          </figcaption>
        </figure>
        <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <Inline gap={6} align="baseline">
              <Heading level={3} size="display">
                $1,240
              </Heading>
              <SmallText muted>per month</SmallText>
            </Inline>
          </div>
          <figcaption className="text-muted-foreground text-xs">{"Inline, baseline"}</figcaption>
        </figure>
        <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <Inline gap={8}>
              <InlineGrow>
                <Input icon="search" placeholder="Search secrets" aria-label="Search secrets" />
              </InlineGrow>
              <Button variant="outline">Export</Button>
              <Button>Add secret</Button>
            </Inline>
          </div>
          <figcaption className="text-muted-foreground text-xs">
            {"InlineGrow takes the leftover width; the buttons hug their labels"}
          </figcaption>
        </figure>
        <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <Grid columns={3} gap={8}>
              <span className={tile}>Secrets</span>
              <span className={tile}>Identities</span>
              <span className={tile}>Certificates</span>
            </Grid>
          </div>
          <figcaption className="text-muted-foreground text-xs">{"3 columns"}</figcaption>
        </figure>
        <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <Grid columns="1:2" gap={8}>
              <span className={tile}>Details</span>
              <span className={tile}>Activity</span>
            </Grid>
          </div>
          <figcaption className="text-muted-foreground text-xs">
            {"1:2, one column below 896px"}
          </figcaption>
        </figure>
        <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <Grid gap={8}>
              <span className={tile}>Secrets</span>
              <span className={tile}>Identities</span>
              <span className={tile}>Certificates</span>
            </Grid>
          </div>
          <figcaption className="text-muted-foreground text-xs">{"auto-fit"}</figcaption>
        </figure>
        {(["page", "form", "prose"] as const).map((size) => (
          <figure key={size} className="m-0 flex w-full min-w-0 flex-col gap-3">
            <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
              <div className="border border-dashed border-border">
                <Measure size={size}>
                  <span className={`${tile} block`}>Content stops at the {size} measure</span>
                </Measure>
              </div>
            </div>
            <figcaption className="text-muted-foreground text-xs">{size}</figcaption>
          </figure>
        ))}
      </div>
    </Container>
  );
}
