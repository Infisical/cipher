import { useState } from "react";
import { StarIcon } from "lucide-react";

import { Button } from "@infisical/cipher/ui/button";
import { Icon } from "@infisical/cipher/ui/icon";

export default function Example() {
  const [favorite, setFavorite] = useState(true);
  const [shown, setShown] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon-row"
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={favorite}
        onClick={() => setFavorite(!favorite)}
      >
        <Icon icon={StarIcon} filled={favorite} />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        iconOnly
        icon={shown ? "eye-off" : "eye"}
        aria-pressed={shown}
        onClick={() => setShown(!shown)}
      >
        {shown ? "Hide value" : "Reveal value"}
      </Button>
    </div>
  );
}
