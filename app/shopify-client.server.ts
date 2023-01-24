import { createStorefrontClient } from "@shopify/storefront-kit-react";

const client = createStorefrontClient({
  contentType: "graphql",
  storeDomain: process.env.PUBLIC_STOREFRONT_DOMAIN || "",
  storefrontApiVersion: process.env.PUBLIC_STOREFRONT_API_VERSION || "",
  privateStorefrontToken: process.env.PRIVATE_STOREFRONT_API_TOKEN,
});

export const getShopifyDomain = client.getShopifyDomain;
export const getStorefrontApiUrl = client.getStorefrontApiUrl;
export const getPrivateTokenHeaders = client.getPrivateTokenHeaders;
