import client from "~/api/index.server";
import { getApiErrorMessage } from "~/lib";
import type {
  CustomerAccessTokenCreateInput,
  CustomerCreateInput,
  CustomerDetailsWithFeaturedProductsAndCollectionsQueryVariables,
  CustomerUpdateInput,
  CustomerQueryVariables,
} from "~/gql/types";
import {
  CustomerAccessTokenCreateDocument,
  CustomerCreateDocument,
  CustomerDetailsWithFeaturedProductsAndCollectionsDocument,
  CustomerDocument,
  CustomerUpdateDocument,
} from "~/gql/types";

export async function customerCreate(input: CustomerCreateInput) {
  const data = await client.request({
    document: CustomerCreateDocument,
    variables: { input },
  });

  return {
    customer: data.customerCreate?.customer,
    error: getApiErrorMessage("customerCreate", data, data.customerCreate?.customerUserErrors),
  };
}

export async function customerUpdate(variables: { customer: CustomerUpdateInput; customerAccessToken: string }) {
  const data = await client.request({
    document: CustomerUpdateDocument,
    variables,
  });

  return {
    error: getApiErrorMessage("customerUpdate", data, data.customerUpdate?.customerUserErrors),
  };
}

export async function createCustomerAccessToken(input: CustomerAccessTokenCreateInput) {
  const data = await client.request({
    document: CustomerAccessTokenCreateDocument,
    variables: { input },
  });

  return {
    data: data.customerAccessTokenCreate?.customerAccessToken,
    error: getApiErrorMessage("customerAccessTokenCreate", data, data.customerAccessTokenCreate?.customerUserErrors),
  };
}

export async function getCustomer(variables: CustomerQueryVariables) {
  return await client.request({
    document: CustomerDocument,
    variables,
  });
}

export async function getCustomerWithFeaturedProductsAndCollections(
  variables: CustomerDetailsWithFeaturedProductsAndCollectionsQueryVariables
) {
  const data = await client.request({
    document: CustomerDetailsWithFeaturedProductsAndCollectionsDocument,
    variables,
  });

  return {
    data: {
      customer: data.customer,
      featuredProducts: data.featuredProducts,
      featuredCollections: data.featuredCollections,
    },
  };
}
