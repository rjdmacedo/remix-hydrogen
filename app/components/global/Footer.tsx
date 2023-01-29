import { useLocation } from "react-router-dom";

import { isHome } from "~/utilities";
import { FooterMenu } from "~/components/global";
import { useLocalization } from "~/hooks";
import { Heading, Section } from "~/components/elements";
import type { EnhancedMenu } from "~/lib/utils";

/**
 * A server component that specifies the content of the footer on the website
 */
export function Footer({ menu }: { menu?: EnhancedMenu }) {
  const { state } = useLocalization();
  const { pathname } = useLocation();

  const itemsCount = menu ? (menu?.items?.length + 1 > 4 ? 4 : menu?.items?.length + 1) : [];

  const styles = {
    container: `grid min-h-[25rem] w-full grid-flow-row grid-cols-1 items-start md:grid-cols-2 md:gap-8 md:px-8
    lg:gap-12 lg:grid-cols-${itemsCount} bg-base-200`,
  };

  return (
    <Section
      as="footer"
      role="contentinfo"
      divider={isHome(pathname, state.country) ? "none" : "top"}
      className={styles.container}
    >
      <section className="grid w-full gap-4">
        <Heading size="lead" className="cursor-default" as="h3">
          Country
        </Heading>
        {/*<CountrySelector />*/}
      </section>

      <FooterMenu menu={menu} />

      <div className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}>
        &copy; {new Date().getFullYear()}
      </div>
    </Section>
  );
}
