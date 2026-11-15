import { Card } from "@infisical/cipher/ui/card";
import { WorldMap, type WorldMapLocation } from "@infisical/cipher/ui/world-map";

const locations: WorldMapLocation[] = [
  { label: "Ashburn, US", country: "US", lat: 39.04, lng: -77.49, count: 18420 },
  { label: "San Francisco, US", country: "US", lat: 37.77, lng: -122.42, count: 9312 },
  { label: "Frankfurt, DE", country: "DE", lat: 50.11, lng: 8.68, count: 7204 },
  { label: "Toronto, CA", country: "CA", lat: 43.65, lng: -79.38, count: 4108 },
  { label: "London, GB", country: "GB", lat: 51.51, lng: -0.13, count: 3550 },
  { label: "Singapore, SG", country: "SG", lat: 1.35, lng: 103.82, count: 2210 },
  { label: "Bengaluru, IN", country: "IN", lat: 12.97, lng: 77.59, count: 1640 },
  { label: "Sydney, AU", country: "AU", lat: -33.87, lng: 151.21, count: 980 },
  { label: "Sao Paulo, BR", country: "BR", lat: -23.55, lng: -46.63, count: 612 },
  { label: "Local network", count: 1290 }
];

export default function Example() {
  return (
    <Card title="Secret access locations" className="w-full">
      <WorldMap label="Secret access locations" locations={locations} />
    </Card>
  );
}
