import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getUserByAccessToken } from "~/models/user.server";
import type { FlashNotification } from "~/types/settings";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const storage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET],
    httpOnly: true,
    sameSite: "lax",
  },
});

const CUSTOMER_ACCESS_TOKEN = "customerAccessToken";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return storage.getSession(cookie);
}

export async function getUser(request: Request) {
  const userAccessToken = await getUserAccessToken(request);
  if (userAccessToken === undefined) return null;

  // const user = await getUserById(userAccessToken);
  // if (user) return user;

  throw await logout(request);
}

export async function getUserAccessToken(request: Request): Promise<string | undefined> {
  const session = await getSession(request);
  return session.get(CUSTOMER_ACCESS_TOKEN);
}

export async function requireCustomerAccessToken(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const userAccessToken = await getUserAccessToken(request);

  if (!userAccessToken) {
    const searchParams = new URLSearchParams([["redirect-to", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userAccessToken;
}

export async function requireCustomer(request: Request) {
  const customerAccessToken = await requireCustomerAccessToken(request);
  console.log("customerAccessToken", customerAccessToken);

  const { customer } = await getUserByAccessToken(customerAccessToken);
  console.log("customer", customer);
  if (customer) return customer;

  throw await logout(request);
}

export async function createUserSession({
  request,
  remember,
  redirectTo,
  accessToken,
}: {
  request: Request;
  remember: boolean;
  redirectTo: string;
  accessToken: string;
}) {
  const session = await getSession(request);
  session.set(CUSTOMER_ACCESS_TOKEN, accessToken);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request, redirectTo: string = "/", flash?: FlashNotification) {
  const session = await getSession(request);
  flash && session.flash(flash.name, flash.value);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
