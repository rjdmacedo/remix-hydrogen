import fetch from "cross-fetch";
import { GraphQLClient } from "graphql-request";
import { getPrivateTokenHeaders, getStorefrontApiUrl } from "~/shopify-client.server";

const client = new GraphQLClient(getStorefrontApiUrl(), {
  fetch,
  headers: getPrivateTokenHeaders(),
});

export default client;
