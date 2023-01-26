import * as React from "react";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { flattenConnection } from "@shopify/storefront-kit-react";

import client from "~/api/index.server";
import { Button } from "~/components/elements";
import { PageHeader } from "~/components/global";
import { updateAccount } from "~/api/account.server";
import { getCountryCode } from "~/utilities";
import { logout, requireCustomerAccessToken } from "~/session.server";
import { AccountDetails, AccountOrderHistory } from "~/components/account";
import type { MailingAddressConnection, OrderConnection } from "~/gql/types";
import { CustomerDetailsWithFeaturedProductsAndCollectionsDocument } from "~/gql/types";

export async function loader({ request }: LoaderArgs) {
  const customerAccessToken = await requireCustomerAccessToken(request);

  const data = await client.request({
    document: CustomerDetailsWithFeaturedProductsAndCollectionsDocument,
    variables: {
      country: getCountryCode(request.url),
      customerAccessToken,
    },
  });

  if (!data?.customer) {
    return logout(request, "/login");
  }

  return json({
    customer: data.customer,
    featured: {
      products: data.featuredProducts,
      collections: data.featuredCollections,
    },
  });
}

export async function action({ request }: LoaderArgs) {
  const customerAccessToken = await requireCustomerAccessToken(request);

  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "update") {
    const { error } = await updateAccount({
      customerAccessToken,
      customer: {
        email: values.email ? String(values.email) : undefined,
        phone: values.phone ? String(values.phone) : undefined,
        password: values.newPw ? String(values.newPw) : undefined,
        lastName: values.lastName ? String(values.lastName) : undefined,
        firstName: values.firstName ? String(values.firstName) : undefined,
      },
    });

    return json({
      error,
    });
  }

  return json({
    error: null,
  });
}

export default function AccountPage() {
  const data = useLoaderData<typeof loader>();

  const { customer } = data;

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}.`
      : `Welcome to your account.`
    : "Account Details";

  const orders = flattenConnection(customer?.orders as OrderConnection);
  const addresses = flattenConnection(customer?.addresses as MailingAddressConnection).map((address) => ({
    ...address,
    id: address.id!.substring(0, address.id!.lastIndexOf("?")),
    originalId: address.id,
  }));

  const defaultAddress = customer?.defaultAddress?.id?.substring(0, customer.defaultAddress.id.lastIndexOf("?"));

  return (
    <>
      <PageHeader heading={heading}>
        <Form action="/logout" method="post">
          <Button wide variant="outline" color="error" type="submit">
            Sign out
          </Button>
        </Form>
      </PageHeader>

      {orders && <AccountOrderHistory orders={orders} />}

      <AccountDetails
        email={customer?.email as string}
        phone={customer?.phone as string}
        lastName={customer?.lastName as string}
        firstName={customer?.firstName as string}
      />
    </>
  );
}

type Customer = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
};
