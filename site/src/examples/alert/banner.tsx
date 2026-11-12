import { useState } from "react";

import { Banner } from "@infisical/cipher/ui/alert";
import { Button } from "@infisical/cipher/ui/button";

export default function Example() {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <Banner
      onDismiss={() => setVisible(false)}
      action={
        <Button variant="link" asChild>
          <a href="#rules">Read guidance</a>
        </Button>
      }
    >
      This example uses synthetic values.
    </Banner>
  ) : (
    <Button variant="outline" onClick={() => setVisible(true)}>
      Show banner
    </Button>
  );
}
