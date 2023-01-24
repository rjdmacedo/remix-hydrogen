import {
  SunIcon,
  MoonIcon,
  UserIcon,
  Bars2Icon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useWindowScroll } from "react-use";

// import { useSettings } from "~/contexts";
import type { EnhancedMenu } from "~/lib/utils";
import { useLocation } from "react-router-dom";
import useDrawer from "~/hooks/use-drawer";
import { MenuDrawer, CartDrawer } from "~/components/global";
import { useCart } from "@shopify/storefront-kit-react";
import { Input, Badge, Button, Heading, Spinner, Indicator } from "~/components/elements";
import { Link } from "@remix-run/react";
import { Swap } from "~/components/elements/Swap";
import { getCountryCode } from "~/utilities";

/**
 * A client component that specifies the content of the header on the website
 */
export function Header({ title, menu }: HeaderProps) {
  const { pathname } = useLocation();

  const countryCode = getCountryCode(pathname);

  const { isOpen: isCartOpen, openDrawer: openCart, closeDrawer: closeCart } = useDrawer();

  const { isOpen: isMenuOpen, openDrawer: openMenu, closeDrawer: closeMenu } = useDrawer();

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu!} />
      <DesktopHeader menu={menu} title={title} openCart={openCart} countryCode={countryCode} />
      <MobileHeader title={title} openCart={openCart} openMenu={openMenu} countryCode={countryCode} />
    </>
  );
}

function MobileHeader({ title, openCart, openMenu, countryCode }: MobileHeaderProps) {
  const { y } = useWindowScroll();
  const { status, totalQuantity } = useCart();

  const styles = {
    header: `${
      y > 20 && "drop-shadow-lg backdrop-blur-xl"
    } sticky top-0 z-40 lg:hidden h-nav flex w-full items-center justify-between gap-4 bg-base-100/70 p-4 leading-none transition duration-300 focus:hidden`,
    section: {
      left: "flex w-full items-center justify-start gap-4",
      middle: "flex w-full flex-grow items-center justify-center self-stretch",
      right: "flex w-full items-center justify-end gap-4",
    },
  };

  return (
    <header role="banner" className={styles.header}>
      <div className={styles.section.left}>
        <Button size="sm" color="ghost" shape="circle" onClick={openMenu} animation>
          <Bars2Icon className="h-4 w-4" />
        </Button>

        <form
          className="items-center gap-4 outline-0 sm:flex"
          action={`/${countryCode ? countryCode + "/" : ""}search`}
        >
          <Button size="sm" type="submit" color="ghost" shape="circle" animation>
            <MagnifyingGlassIcon className="h-4 w-4" />
          </Button>
          <Input name="q" size="sm" type="search" placeholder="Search" className="hidden md:block" />
        </form>
      </div>

      <Link to="/" className={styles.section.middle}>
        <Heading className="text-center font-bold" as="h1">
          {title}
        </Heading>
      </Link>

      <div className={styles.section.right}>
        <Button to="/account" size="sm" color="ghost" shape="circle" animation>
          <UserIcon className="h-4 w-4" />
        </Button>

        <Indicator
          item={
            totalQuantity > 0 && (
              <Badge size="sm" color="primary">
                {totalQuantity}
              </Badge>
            )
          }
        >
          <Button size="sm" color="ghost" shape="circle" onClick={openCart} animation>
            {["idle", "uninitialized"].includes(status) ? (
              <ShoppingBagIcon className="fade-in h-4 w-4" />
            ) : (
              <Spinner size="sm" />
            )}
          </Button>
        </Indicator>
      </div>
    </header>
  );
}

function DesktopHeader({ menu, title, openCart, countryCode }: DesktopHeaderProps) {
  const { y } = useWindowScroll();
  const { status, totalQuantity } = useCart();
  // const { themeMode, onToggleMode } = useSettings();

  const styles = {
    header: `${
      y > 20 && "backdrop-blur-xl"
    } sticky top-0 z-40 hidden h-nav w-full items-center justify-between gap-8 bg-base-100/70 py-4 px-12 leading-none transition duration-300 focus:hidden lg:block lg:flex`,
    section: {
      left: "flex items-center gap-8",
      right: "flex items-center gap-3",
    },
  };

  return (
    <header role="banner" className={styles.header}>
      <div className={styles.section.left}>
        <Link className="font-bold" to="/">
          {title}
        </Link>
        <nav className="flex gap-8">
          {/* Top level menu items */}
          {(menu?.items || []).map((item) => (
            <Link key={item.id} to={item.to} target={item.target} className="link-hover link">
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className={styles.section.right}>
        <form className="flex items-center gap-3 outline-0" action={`/${countryCode ? countryCode + "/" : ""}search`}>
          <Input name="q" size="sm" type="search" placeholder="Search" className="bg-transparent" />
          <Button size="sm" type="submit" color="ghost" shape="circle" className="ml-1">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </Button>
        </form>
        <Button
          size="sm"
          color="ghost"
          shape="circle"
          onClick={() => {
            // onToggleMode()
          }}
          animation
        >
          <Swap
            rotate
            active={true} //themeMode === "dark"
            onElement={<SunIcon className="h-4 w-4" />}
            offElement={<MoonIcon className="h-4 w-4" />}
            onClick={(e) => e.preventDefault()}
          />
        </Button>
        <Button size="sm" to="/account" color="ghost" shape="circle" animation>
          <UserIcon className="h-4 w-4" />
        </Button>

        <Indicator
          item={
            totalQuantity > 0 && (
              <Badge size="md" color="primary">
                {totalQuantity}
              </Badge>
            )
          }
        >
          <Button size="sm" color="ghost" shape="circle" onClick={openCart} animation>
            {["idle", "uninitialized"].includes(status) ? (
              <ShoppingBagIcon className="fade-in h-4 w-4" />
            ) : (
              <Spinner size="sm" />
            )}
          </Button>
        </Indicator>
      </div>
    </header>
  );
}

type HeaderProps = {
  title: string;
  menu?: EnhancedMenu;
};

type MobileHeaderProps = {
  title: string;
  openCart: () => void;
  openMenu: () => void;
  countryCode?: string | null;
};

type DesktopHeaderProps = {
  menu?: EnhancedMenu;
  title: string;
  openCart: () => void;
  countryCode?: string | null;
};
