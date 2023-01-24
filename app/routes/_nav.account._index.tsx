import * as React from "react";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { flattenConnection } from "@shopify/storefront-kit-react";

import client from "~/api/index.server";
import { Button } from "~/components/elements";
import { PageHeader } from "~/components/global";
import { getCountryCode } from "~/utilities";
import { getApiErrorMessage } from "~/lib";
import { logout, requireCustomerAccessToken } from "~/session.server";
import { AccountDetails, AccountOrderHistory } from "~/components/account";
import type { MailingAddressConnection, OrderConnection } from "~/gql/types";
import { CustomerDetailsWithFeaturedProductsAndCollectionsDocument, CustomerUpdateDocument } from "~/gql/types";

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

  if (!customerAccessToken) return new Response(null, { status: 401 });

  const form = await request.formData();
  const firstName = form.get("firstname");
  const lastName = form.get("lastname");
  const phone = form.get("phone");
  const email = form.get("email");
  const newPw = form.get("newPassword");

  const customer: Customer = {};
  if (email) customer.email = String(email);
  if (phone) customer.phone = String(phone);
  if (newPw) customer.password = String(newPw);
  if (lastName) customer.lastName = String(lastName);
  if (firstName) customer.firstName = String(firstName);

  const data = await client.request({
    document: CustomerUpdateDocument,
    variables: {
      customer,
      customerAccessToken,
    },
  });

  const error = getApiErrorMessage("customerUpdate", data, data.customerUpdate?.customerUserErrors);

  if (error) return json({ errors: error }, { status: 400 });

  return json(null, { status: 200 });
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
