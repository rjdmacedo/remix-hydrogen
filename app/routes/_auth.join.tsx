import * as React from "react";
import { useEffect, useRef } from "react";
import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { Form, useActionData, useNavigation, useSearchParams } from "@remix-run/react";

import client from "~/api/index.server";
import { isNavigation } from "~/utilities";
import { getApiErrorMessage } from "~/lib";
import { Button, Input, Text } from "~/components/elements";
import { safeRedirect, validateEmail } from "~/utils";
import { LoginDocument, RegisterDocument } from "~/gql/types";
import { createUserSession, getUserAccessToken } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserAccessToken(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = safeRedirect(form.get("redirect-to"), "/account");

  if (!validateEmail(email)) {
    return json({ errors: { email: "Email is invalid", password: null } }, { status: 400 });
  }

  if (typeof password !== "string" || password.length === 0) {
    return json({ errors: { email: null, password: "Password is required" } }, { status: 400 });
  }

  if (password.length < 8) {
    return json({ errors: { email: null, password: "Password is too short" } }, { status: 400 });
  }

  const registerData = await client.request({
    document: RegisterDocument,
    variables: {
      input: {
        email,
        password,
        acceptsMarketing: false,
      },
    },
  });

  const registerErrorMessage = getApiErrorMessage(
    "customerCreate",
    registerData,
    registerData.customerCreate?.customerUserErrors
  );

  if (registerErrorMessage) {
    return json(
      { errors: { email: registerErrorMessage.message ?? "Unknown error", password: null } },
      { status: 401 }
    );
  }

  const loginData = await client.request({
    document: LoginDocument,
    variables: {
      input: {
        email,
        password,
      },
    },
  });

  const loginErrorMessage = getApiErrorMessage(
    "customerAccessTokenCreate",
    loginData,
    loginData.customerAccessTokenCreate?.customerUserErrors
  );

  if (loginErrorMessage) {
    return json({ errors: { email: loginErrorMessage.message ?? "Unknown error", password: null } }, { status: 401 });
  }

  const { accessToken } = loginData?.customerAccessTokenCreate?.customerAccessToken || {};

  if (!accessToken) {
    return json({ errors: { email: "Invalid email or password", password: null } }, { status: 400 });
  }

  return createUserSession({
    request,
    remember: true,
    redirectTo,
    accessToken,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function JoinPage() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get("redirect-to") ?? undefined;

  const { submitting } = isNavigation(navigation);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="flex flex-col items-center justify-center gap-5">
          <div className="w-full">
            <Input
              id="email"
              ref={emailRef}
              name="email"
              type="email"
              label="Email"
              color={actionData?.errors?.email ? "error" : "primary"}
              required
              autoFocus
              autoComplete="email"
              aria-invalid={actionData?.errors?.email ? true : undefined}
              aria-describedby="email-error"
            />
            {actionData?.errors?.email && (
              <Text id="email-error" color="error">
                {actionData.errors.email}
              </Text>
            )}
          </div>

          <div className="w-full">
            <Input
              id="password"
              ref={passwordRef}
              name="password"
              type="password"
              label="Password"
              color={actionData?.errors?.password ? "error" : "primary"}
              autoComplete="current-password"
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
            />
            {actionData?.errors?.password && (
              <Text id="password-error" color="error" width="wide">
                {actionData.errors.password}
              </Text>
            )}
          </div>

          <Input type="hidden" name="redirect-to" value={redirectTo} />

          <Button type="submit" fullWidth color="primary" disabled={submitting} loading={submitting}>
            Create Account
          </Button>

          <div className="flex items-center justify-center gap-2">
            <Text size="sm">Already have an account?</Text>
            <Button
              size="xs"
              type="button"
              variant="link"
              to={{
                pathname: "/login",
                search: searchParams.toString(),
              }}
            >
              Log in
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
