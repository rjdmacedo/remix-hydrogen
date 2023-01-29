import * as React from "react";
import { useEffect, useRef } from "react";
import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { Form, useActionData, useNavigation, useSearchParams } from "@remix-run/react";

import { isNavigation } from "~/utilities";
import { safeRedirect, validateEmail } from "~/utils";
import { Button, Input, Text, Checkbox } from "~/components/elements";
import { createUserSession, getUserAccessToken } from "~/session.server";
import { createCustomerAccessToken } from "~/api/customer.server";

export async function loader({ request }: LoaderArgs) {
  const userAccessToken = await getUserAccessToken(request);
  return userAccessToken ? redirect("/") : json(null);
}

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const remember = form.get("remember");

  const redirectTo = safeRedirect(form.get("redirect-to"), "/");

  if (!validateEmail(email)) {
    return json({ errors: { email: "Email is invalid", password: null } }, { status: 400 });
  }

  if (typeof password !== "string" || password.length === 0) {
    return json({ errors: { password: "Password is required", email: null } }, { status: 400 });
  }

  if (password.length < 8) {
    return json({ errors: { password: "Password is too short", email: null } }, { status: 400 });
  }

  const { data, error } = await createCustomerAccessToken({ email, password });

  if (error || !data) {
    return json({ errors: { email: error?.message ?? "Unknown error", password: null } }, { status: 401 });
  }

  return createUserSession({
    request,
    remember: remember === "on",
    redirectTo,
    accessToken: data.accessToken,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get("redirect-to") || "/";

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

          <div className="flex w-full">
            <Checkbox
              id="remember"
              name="remember"
              size="xs"
              color="primary"
              label={<Text color="primary">Remember me</Text>}
            />
          </div>

          <Button type="submit" fullWidth color="primary" disabled={submitting} loading={submitting}>
            Log in
          </Button>

          <div className="flex items-center justify-center">
            <Text size="sm">Don't have an account?</Text>
            <Button
              size="sm"
              type="button"
              variant="link"
              to={{
                pathname: "/join",
                search: searchParams.toString(),
              }}
            >
              Sign up
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
