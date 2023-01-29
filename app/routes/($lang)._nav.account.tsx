import * as React from "react";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { flattenConnection } from "@shopify/storefront-kit-react";

import { Button } from "~/components/elements";
import { PageHeader } from "~/components/global";
import { getCountryCode } from "~/utilities";
import { logout, requireCustomerAccessToken } from "~/session.server";
import { AccountDetails, AccountOrderHistory } from "~/components/account";
import type { MailingAddressConnection, OrderConnection } from "~/gql/types";
import { useLocalization } from "~/hooks";
import { customerUpdate, getCustomerWithFeaturedProductsAndCollections } from "~/api/customer.server";

export async function loader({ request }: LoaderArgs) {
  const customerAccessToken = await requireCustomerAccessToken(request);

  const { data } = await getCustomerWithFeaturedProductsAndCollections({
    customerAccessToken,
    country: getCountryCode(request),
  });

  if (!data?.customer) {
    return logout(request, "/login?redirect-to=/account");
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
    const { error } = await customerUpdate({
      customer: {
        email: values.email ? String(values.email) : undefined,
        phone: values.phone ? String(values.phone) : undefined,
        password: values.newPassword ? String(values.newPassword) : undefined,
        lastName: values.lastName ? String(values.lastName) : undefined,
        firstName: values.firstName ? String(values.firstName) : undefined,
      },
      customerAccessToken,
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
  const { getRelativePath } = useLocalization();
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
        <Form action={getRelativePath("logout")} method="post">
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
