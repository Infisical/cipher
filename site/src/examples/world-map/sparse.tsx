import { Card } from "@infisical/cipher/ui/card";
import { WorldMap, type WorldMapLocation } from "@infisical/cipher/ui/world-map";

const single: WorldMapLocation[] = [
  { label: "Dublin, IE", country: "IE", lat: 53.35, lng: -6.26, count: 1 }
];

export default function Example() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <Card title="Secret access locations">
        <WorldMap
          label="Secret access locations"
          locations={[]}
          empty="No access in the last 30 days"
        />
      </Card>
      <Card title="Secret access locations">
        <WorldMap label="Secret access locations" locations={single} />
      </Card>
    </div>
  );
}
