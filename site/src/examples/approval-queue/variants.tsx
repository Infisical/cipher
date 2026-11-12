import { useState } from "react";

import {
  ApprovalQueue,
  ApprovalQueueFooter,
  ApprovalQueueHeader,
  ApprovalQueueItem,
  ApprovalQueueList,
  type ApprovalQueueVariant,
  type ApprovalRequest
} from "@infisical/cipher/patterns/approval-queue";
import { Button } from "@infisical/cipher/ui/button";

const initial: ApprovalRequest[] = [
  {
    id: "stripe",
    object: "stripe_api_key",
    title: (
      <>
        <code>stripe_api_key</code> change in production
      </>
    ),
    description: "Priya Raman asked to rotate the key before Friday's release.",
    age: "4m",
    href: "#approval-queue",
    state: "new"
  },
  {
    id: "db",
    object: "database_url",
    title: (
      <>
        <code>database_url</code> change in production
      </>
    ),
    description: "Marcus Okonkwo-Fitzgerald points it at the new replica.",
    age: "1h",
    href: "#approval-queue",
    state: "pending"
  },
  {
    id: "agent",
    object: "release-notes-agent",
    title: <>release-notes-agent access approved</>,
    description: "Read access to staging for 1 hour, approved by you.",
    age: "2h",
    href: "#approval-queue",
    state: "resolved"
  },
  {
    id: "export",
    object: "audit-export",
    title: <>audit-export access approved</>,
    description: "Read access to audit logs for 1 day, approved by you. Approvals here are final.",
    age: "3h",
    href: "#approval-queue",
    state: "resolved"
  },
  {
    id: "sync",
    object: "vercel-sync",
    title: <>vercel-sync change in staging</>,
    description: "Sarah Lin adds 3 secrets to the sync.",
    age: "3h",
    href: "#approval-queue",
    state: "failed",
    error: "Vercel rejected the token. Reconnect Vercel, then retry."
  }
];

const final = new Set(["export"]);

function useRequests() {
  const [requests, setRequests] = useState(initial);
  const replace = (id: string, next: (request: ApprovalRequest) => ApprovalRequest) =>
    setRequests((value) => value.map((request) => (request.id === id ? next(request) : request)));
  const approve = (id: string) => {
    replace(id, (request) => ({ ...request, state: "pending", error: undefined }));
    window.setTimeout(
      () =>
        replace(id, (request) => ({
          ...request,
          state: "resolved",
          error: undefined,
          title: (
            <>
              <code>{request.object}</code> change approved
            </>
          ),
          description: "Approved by you just now."
        })),
      1200
    );
  };
  const undo = (id: string) =>
    replace(id, (request) => ({
      ...request,
      state: "new",
      error: undefined,
      title: (
        <>
          <code>{request.object}</code> access requested
        </>
      ),
      description: "The approval was taken back."
    }));
  const waiting = `${requests.filter((request) => request.state !== "resolved").length} waiting`;
  const item = (request: ApprovalRequest) => (
    <ApprovalQueueItem
      key={request.id}
      request={request}
      onApprove={approve}
      onUndo={final.has(request.id) ? undefined : undo}
      onRetry={approve}
    />
  );
  return { requests, waiting, item };
}

function Queue({ variant }: { variant: ApprovalQueueVariant }) {
  const { requests, waiting, item } = useRequests();
  return (
    <ApprovalQueue variant={variant}>
      <ApprovalQueueHeader title="Needs you" count={waiting} />
      <ApprovalQueueList>{requests.map(item)}</ApprovalQueueList>
      <ApprovalQueueFooter>
        <Button variant="link" size="sm" asChild>
          <a href="#approval-queue">View history</a>
        </Button>
      </ApprovalQueueFooter>
    </ApprovalQueue>
  );
}

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Queue variant="framed" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"framed"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Queue variant="segmented" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"segmented"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Queue variant="divided" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"divided"}</figcaption>
      </figure>
    </div>
  );
}
