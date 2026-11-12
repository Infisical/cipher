import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Button } from "@infisical/cipher/ui/button";
import { Icon } from "@infisical/cipher/ui/icon";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  Media
} from "@infisical/cipher/ui/item";

const manifestImage = `data:image/svg+xml,${encodeURIComponent(
  renderToStaticMarkup(<Icon name="file" xmlns="http://www.w3.org/2000/svg" color="CanvasText" />)
)}`;

export default function Example() {
  const [imageAvailable, setImageAvailable] = useState(true);
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Item variant="outline">
            <ItemMedia variant="icon">
              <Icon name="key" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Staging service</ItemTitle>
              <ItemDescription>Read access to project versions</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button asChild variant="outline">
                <a href="#input">View settings</a>
              </Button>
            </ItemActions>
          </Item>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Explicit parts"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          {(["default", "icon", "image"] as const).map((variant) => (
            <figure key={variant} className="m-0 flex w-full min-w-0 flex-col gap-3">
              <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
                <Item variant="outline">
                  <ItemMedia variant={variant}>
                    {variant === "default" && <span>ENV</span>}
                    {variant === "icon" && <Icon name="file" />}
                    {variant === "image" &&
                      (imageAvailable ? (
                        <img
                          src={manifestImage}
                          alt="Staging deployment manifest thumbnail"
                          onError={() => setImageAvailable(false)}
                        />
                      ) : (
                        <Icon name="file" label="Manifest preview unavailable" />
                      ))}
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Staging deployment manifest</ItemTitle>
                    <ItemDescription>Environment configuration, staging.env</ItemDescription>
                  </ItemContent>
                </Item>
              </div>
              <figcaption className="text-muted-foreground text-xs">{variant}</figcaption>
            </figure>
          ))}
          {!imageAvailable && (
            <p role="status" className="sr-only">
              Manifest preview unavailable
            </p>
          )}
        </div>
        <figcaption className="text-muted-foreground text-xs">{"ItemMedia recipes"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
            {(["sm", "md", 24] as const).map((size) => (
              <figure
                key={size}
                className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center"
              >
                <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
                  <Media icon="key" size={size} />
                </div>
                <figcaption className="text-muted-foreground text-xs">
                  {typeof size === "number" ? `${size}px` : size}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Media sizes"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Item asChild>
            <a href="#input">
              <ItemContent>
                <ItemTitle>Input guide</ItemTitle>
                <ItemDescription>Provider configuration controls</ItemDescription>
              </ItemContent>
            </a>
          </Item>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Linked row"}</figcaption>
      </figure>
    </div>
  );
}
