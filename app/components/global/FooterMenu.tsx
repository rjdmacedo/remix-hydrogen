import { Disclosure } from "@headlessui/react";

import type { EnhancedMenu, EnhancedMenuItem } from "~/lib/utils";
import { Heading, IconCaret } from "~/components/elements";
import { Link } from "@remix-run/react";

/**
 * A server component that specifies the content of the footer on the website
 */
export function FooterMenu({ menu }: { menu?: EnhancedMenu }) {
  const styles = {
    nav: "grid gap-2 pb-6",
    section: "grid gap-4",
  };

  return (
    <>
      {(menu?.items || []).map((item: EnhancedMenuItem) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Heading className="flex justify-between" size="lead" as="h3">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? "up" : "down"} />
                      </span>
                    )}
                  </Heading>
                </Disclosure.Button>
                {item?.items?.length > 0 && (
                  <div
                    className={`${
                      open ? `h-fit max-h-48` : `max-h-0 md:max-h-fit`
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Disclosure.Panel static>
                      <nav className={styles.nav}>
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.id}
                            to={subItem.to}
                            target={subItem.target}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </nav>
                    </Disclosure.Panel>
                  </div>
                )}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}
