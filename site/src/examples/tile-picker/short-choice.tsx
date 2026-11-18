import * as React from "react";

import { TilePicker, type TilePickerItem } from "@infisical/cipher/patterns/tile-picker";

const sources: TilePickerItem[] = [
  { value: "github", title: "GitHub", icon: "git" },
  { value: "gitlab", title: "GitLab", icon: "git" },
  { value: "bitbucket", title: "Bitbucket", icon: "git" }
];

export default function Example() {
  const [value, setValue] = React.useState("github");
  return <TilePicker items={sources} searchable={false} value={value} onSelect={setValue} />;
}
