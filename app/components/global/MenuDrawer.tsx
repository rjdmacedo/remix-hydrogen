import { Link } from "@remix-run/react";
import { Text } from "~/components/elements";
import type { EnhancedMenu } from "~/lib/utils";
import { Drawer } from "~/components/global/Drawer";

export function MenuDrawer({ menu, isOpen, onClose }: MenuDrawerProps) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <MenuMobileNav menu={menu} onClose={onClose} />
    </Drawer>
  );
}

function MenuMobileNav({ menu, onClose }: MenuMobileNavProps) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <Link key={item.id} to={item.to} target={item.target} onClick={onClose}>
          <Text as="span" size="copy">
            {item.title}
          </Text>
        </Link>
      ))}
    </nav>
  );
}

type MenuDrawerProps = {
  menu: EnhancedMenu;
  isOpen: boolean;
  onClose: () => void;
};

type MenuMobileNavProps = {
  menu: EnhancedMenu;
  onClose: () => void;
};
