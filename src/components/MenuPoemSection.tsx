import MenuPoem from "@/components/MenuPoem";
import type { Season } from "@/lib/seasonContext";

type MenuPoemSectionProps = {
  seasonOverride?: Season;
  showHeader?: boolean;
  showCta?: boolean;
  className?: string;
};

export default function MenuPoemSection({
  seasonOverride,
  showHeader = true,
  showCta = true,
  className,
}: MenuPoemSectionProps) {
  return (
    <MenuPoem
      seasonOverride={seasonOverride}
      showHeader={showHeader}
      showCta={showCta}
      className={className}
    />
  );
}
