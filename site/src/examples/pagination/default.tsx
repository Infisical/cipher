import * as React from "react";

import { Pagination } from "@infisical/cipher/ui/pagination";

export default function PaginationExamples() {
  const [page, setPage] = React.useState(2);
  const [size, setSize] = React.useState(25);
  const [shown, setShown] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Pagination
            label="Secrets pages"
            page={page}
            onPageChange={setPage}
            total={412}
            pageSize={size}
            pageSizeOptions={[10, 25, 50]}
            onPageSizeChange={setSize}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"numbered"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Pagination label="Audit log pages" variant="compact" pageCount={8} defaultPage={3} />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"compact"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Pagination
            label="Activity pages"
            variant="more"
            page={shown}
            total={60}
            pageSize={25}
            loading={loading}
            onLoadMore={() => {
              setLoading(true);
              timer.current = setTimeout(() => {
                setShown((current) => current + 1);
                setLoading(false);
              }, 700);
            }}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"more"}</figcaption>
      </figure>
    </div>
  );
}
