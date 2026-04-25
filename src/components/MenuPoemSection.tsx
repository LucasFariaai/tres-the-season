import MenuPoem from "@/components/MenuPoem";
import type { Season } from "@/lib/seasonContext";
import type { MenusContent } from "@/lib/site-editor/types";

type MenuPoemSectionProps = {
  seasonOverride?: Season;
  showHeader?: boolean;
  showCta?: boolean;
  className?: string;
  menus?: MenusContent;
};

export default function MenuPoemSection({
  seasonOverride,
  showHeader = true,
  showCta = true,
  className,
  menus,
}: MenuPoemSectionProps) {
  return (
    <MenuPoem
      seasonOverride={seasonOverride}
      showHeader={showHeader}
      showCta={showCta}
      className={className}
      menus={menus}
    />
  );
}
