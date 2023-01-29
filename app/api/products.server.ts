import client from "~/api/index.server";
import {
  ProductIdDocument,
  AllProductsDocument,
  ProductWithRecommendationsDocument,
  FeaturedProductsAndCollectionsDocument,
} from "~/gql/types";
import type {
  ProductIdQueryVariables,
  AllProductsQueryVariables,
  ProductWithRecommendationsQueryVariables,
  FeaturedProductsAndCollectionsQueryVariables,
} from "~/gql/types";

export function getProductId(variables: ProductIdQueryVariables) {
  return client.request({
    document: ProductIdDocument,
    variables,
  });
}

export function getProductWithRecommendations(variables: ProductWithRecommendationsQueryVariables) {
  return client.request({
    document: ProductWithRecommendationsDocument,
    variables,
  });
}

export function getFeaturedProductsAndCollections(variables: FeaturedProductsAndCollectionsQueryVariables) {
  return client.request({
    document: FeaturedProductsAndCollectionsDocument,
    variables,
  });
}

export function getAllProducts(variables: AllProductsQueryVariables) {
  return client.request({
    document: AllProductsDocument,
    variables,
  });
}
