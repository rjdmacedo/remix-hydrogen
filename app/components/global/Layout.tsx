import React from "react";
import { useLocation } from "react-router-dom";

import { isHome } from "~/utilities";
import { parseMenu } from "~/lib";
import { Header, Footer } from "~/components/global";
import type { AppHeaderAndFooterMenuQuery, Menu } from "~/gql/types";
import { Link } from "~/components/global/Link";
import { useLocalization } from "~/hooks";

export function Layout({ data, children }: Props) {
  const { pathname } = useLocation();
  const { state } = useLocalization();

  const shopName = data ? data.shop.name : "Remix 📀 Demo Store";

  /**
   * Modify specific links/routes (optional)
   * @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
   * e.g here we map:
   *  - /blogs/news -> /news
   *  - /blog/news/blog-post -> /news/blog-post
   *  - /collections/all -> /products
   */
  const customPrefixes = { BLOG: "", CATALOG: "products" };

  const headerMenu = data?.headerMenu ? parseMenu(data.headerMenu as Menu, customPrefixes) : undefined;

  const footerMenu = data?.footerMenu ? parseMenu(data.footerMenu as Menu, customPrefixes) : undefined;

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Link to="#main-content" className="sr-only">
          Skip to content
        </Link>

        <Header title={shopName} menu={headerMenu} />

        <main role="main" id="main-content" className={`flex-grow ${isHome(pathname, state.country) ? "-mt-nav" : ""}`}>
          {children}
        </main>
      </div>

      <Footer menu={footerMenu} />
    </>
  );
}

type Props = {
  data: AppHeaderAndFooterMenuQuery;
  children: React.ReactNode;
};
