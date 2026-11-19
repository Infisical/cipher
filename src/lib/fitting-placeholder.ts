import * as React from "react";

let canvas: HTMLCanvasElement | undefined;

function measurer(element: HTMLInputElement | HTMLTextAreaElement) {
  const style = getComputedStyle(element);
  canvas ??= document.createElement("canvas");
  const context = canvas.getContext("2d");
  const room =
    element.clientWidth -
    parseFloat(style.paddingLeft) -
    parseFloat(style.paddingRight);
  if (!context) return () => true;
  context.font = style.font;
  context.letterSpacing = style.letterSpacing;
  return (text: string) => context.measureText(text).width <= room;
}

function truncate(text: string, fits: (text: string) => boolean) {
  if (fits(text)) return text;
  const characters = Array.from(
    new Intl.Segmenter().segment(text),
    (part) => part.segment,
  );
  const cut = (count: number) =>
    characters.slice(0, count).join("").trimEnd() + "…";
  let low = 0;
  let high = characters.length;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (fits(cut(middle))) low = middle;
    else high = middle - 1;
  }
  return cut(low);
}

/** The full placeholder while it fits the field on one line, else the short one, ending in an ellipsis if even that is too long. With truncate off and no short form, the placeholder passes through untouched. */
export function useFittingPlaceholder(
  ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
  placeholder: string | undefined,
  short: string | undefined,
  { truncate: truncating = false }: { truncate?: boolean } = {},
) {
  const [shown, setShown] = React.useState(placeholder);
  const active = Boolean(placeholder && (short || truncating));
  const [element, setElement] = React.useState<
    HTMLInputElement | HTMLTextAreaElement | null
  >(null);
  React.useLayoutEffect(() => {
    if (ref.current !== element) setElement(ref.current);
  });
  React.useLayoutEffect(() => {
    if (!element || !placeholder || !active) return;
    const measure = () => {
      const fits = measurer(element);
      const chosen = fits(placeholder) ? placeholder : (short ?? placeholder);
      setShown(truncating ? truncate(chosen, fits) : chosen);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    document.fonts?.addEventListener("loadingdone", measure);
    return () => {
      observer.disconnect();
      document.fonts?.removeEventListener("loadingdone", measure);
    };
  }, [element, placeholder, short, truncating, active]);
  return active ? shown : placeholder;
}
