import { Icon, iconNames } from "@infisical/cipher/ui/icon";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      {iconNames.map((name) => (
        <span key={name} className="flex min-w-0 flex-col items-center gap-2 text-center text-sm">
          <Icon name={name} />
          <span>{name}</span>
        </span>
      ))}
    </div>
  );
}
