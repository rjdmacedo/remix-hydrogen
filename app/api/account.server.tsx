import client from "~/api/index.server";
import { getApiErrorMessage } from "~/lib";
import { CustomerUpdateDocument } from "~/gql/types";
import type { CustomerUpdateInput } from "~/gql/types";

async function updateAccount(variables: { customer: CustomerUpdateInput; customerAccessToken: string }) {
  const data = await client.request({
    document: CustomerUpdateDocument,
    variables,
  });

  return {
    error: getApiErrorMessage("customerUpdate", data, data.customerUpdate?.customerUserErrors),
  };
}

export { updateAccount };
