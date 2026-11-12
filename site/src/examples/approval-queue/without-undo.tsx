import { useState } from "react";

import { ApprovalQueue, type ApprovalRequest } from "@infisical/cipher/patterns/approval-queue";

const initial: ApprovalRequest[] = [
  {
    id: "rotation",
    object: "github_token",
    title: (
      <>
        <code>github_token</code> rotation in production
      </>
    ),
    description: "Dana Whitfield asked to rotate the token after the audit.",
    age: "12m",
    href: "#approval-queue",
    state: "new"
  },
  {
    id: "export",
    object: "audit-export",
    title: <>audit-export access approved</>,
    description: "Read access to audit logs for 1 day, approved by you. Approvals here are final.",
    age: "1h",
    href: "#approval-queue",
    state: "resolved"
  }
];

export default function Example() {
  const [requests, setRequests] = useState(initial);
  const approve = (id: string) =>
    setRequests((value) =>
      value.map((request) =>
        request.id === id
          ? {
              ...request,
              state: "resolved",
              error: undefined,
              title: (
                <>
                  <code>{request.object}</code> change approved
                </>
              ),
              description: "Approved by you just now."
            }
          : request
      )
    );
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <ApprovalQueue requests={requests} onApprove={approve} onRetry={approve} />
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"Resolved rows without undo"}
      </figcaption>
    </figure>
  );
}
