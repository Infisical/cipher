import { Label } from "@infisical/cipher/ui/label";
import { Textarea } from "@infisical/cipher/ui/textarea";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <div className="space-y-2">
        <Label htmlFor="multiline-env">Environment variables</Label>
        <Textarea
          id="multiline-env"
          mono
          placeholder={
            "DATABASE_URL=postgres://localhost:5432/app\nREDIS_URL=redis://localhost:6379\nLOG_LEVEL=info"
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="multiline-reason">Access reason</Label>
        <Textarea
          id="multiline-reason"
          placeholder={"Why you need access\nHow long you need it for"}
        />
      </div>
    </div>
  );
}
