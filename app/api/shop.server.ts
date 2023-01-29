import client from "~/api/index.server";
import type { LanguageCode } from "~/gql/types";
import { AppHeaderAndFooterMenuDocument } from "~/gql/types";
import { FOOTER_MENU_HANDLE, HEADER_MENU_HANDLE } from "~/lib";

export function getShopWithHeaderAndFooter({ language }: { language: LanguageCode }) {
  return client.request({
    document: AppHeaderAndFooterMenuDocument,
    variables: {
      footerMenuHandle: FOOTER_MENU_HANDLE,
      headerMenuHandle: HEADER_MENU_HANDLE,
      language,
    },
  });
}
