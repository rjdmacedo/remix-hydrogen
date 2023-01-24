import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Text, Button, Input } from "~/components/elements";
import { emailValidation, passwordValidation } from "~/lib/utils";
import { Form, useActionData, useNavigation, useSubmit } from "@remix-run/react";
import type { action } from "~/routes/_nav.account._index";

export function AccountDetailsEdit({
  onClose,
  email: _email = "",
  phone: _phone = "",
  lastName: _lastName = "",
  firstName: _firstName = "",
}: AccountDetailsEditProps) {
  const [email, setEmail] = useState(_email);
  const [phone, setPhone] = useState(_phone);
  const [lastName, setLastName] = useState(_lastName);
  const [phoneError, setPhoneError] = useState<null | string>(null);
  const [emailError, setEmailError] = useState<null | string>(null);
  const [newPasswordError, setNewPasswordError] = useState<null | string>(null);
  const [newPassword2Error, setNewPassword2Error] = useState<null | string>(null);
  const [currentPasswordError, setCurrentPasswordError] = useState<null | string>(null);

  const submit = useSubmit();
  const { state } = useNavigation();
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.errors) {
      actionData.errors.forEach((error: { field: string[]; message: string }) => {
        switch (error.field[1]) {
          case "phone": {
            setPhoneError(error.message);
            break;
          }
          case "email": {
            setEmailError(error.message);
            break;
          }
          default: {
            console.log("Error: ", error);
          }
        }
      });
    } else if (actionData?.success) {
      onClose();
    }
  }, [actionData, onClose]);

  function handleChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setEmailError(null);
    setCurrentPasswordError(null);
    setNewPasswordError(null);
    setNewPassword2Error(null);

    const errorOnEmail = emailValidation(event.currentTarget.email);
    if (errorOnEmail) {
      setEmailError(errorOnEmail);
    }

    let currentPasswordError, newPasswordError, newPassword2Error;

    // Only validate the password fields if the current password has a value
    if (event.currentTarget.currentPassword.value) {
      currentPasswordError = passwordValidation(event.currentTarget.currentPassword);
      if (currentPasswordError) {
        setCurrentPasswordError(currentPasswordError);
      }

      newPasswordError = passwordValidation(event.currentTarget.newPassword);
      if (newPasswordError) {
        setNewPasswordError(newPasswordError);
      }

      newPassword2Error =
        event.currentTarget.newPassword.value !== event.currentTarget.newPassword2.value
          ? "The two passwords entered did not match"
          : null;
      if (newPassword2Error) {
        setNewPassword2Error(newPassword2Error);
      }
    }

    if (errorOnEmail || currentPasswordError || newPasswordError || newPassword2Error) {
      return;
    }
  }

  return (
    <Form
      method="post"
      action="/account"
      onChange={handleChange}
      onSubmit={async (event) => {
        handleChange(event);
        submit(event.currentTarget);
      }}
    >
      {actionData?.errors && (
        <div className="mb-6 flex items-center justify-center rounded bg-red-100">
          <Text color="error">An error occurred after submitting the form.</Text>
        </div>
      )}
      <div className="mt-3">
        <Input
          id="firstname"
          name="firstname"
          type="text"
          color="primary"
          placeholder="First name"
          aria-label="First name"
          autoComplete="given-name"
        />
      </div>
      <div className="mt-3">
        <Input
          id="lastname"
          name="lastname"
          type="text"
          value={lastName}
          color="primary"
          aria-label="Last name"
          autoComplete="family-name"
          placeholder="Last name"
          onChange={(event) => {
            setLastName(event.target.value);
          }}
        />
      </div>
      <div className="mt-3">
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          color="primary"
          aria-label="Mobile"
          autoComplete="tel"
          placeholder="Mobile"
          onChange={(event) => {
            setPhone(event.target.value);
          }}
        />
        {phoneError && <Text color="error">{phoneError}</Text>}
      </div>
      <div className="mt-3">
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          color={emailError ? "error" : "primary"}
          required
          aria-label="Email address"
          placeholder="Email address"
          autoComplete="email"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <p className={`mt-1 text-xs text-red-500 ${!emailError ? "invisible" : ""}`}>{emailError} &nbsp;</p>
      </div>
      <Text as="h3" size="lead">
        Change your password
      </Text>
      <Password required={false} name="currentPassword" label="Current password" passwordError={currentPasswordError} />
      <Password required={false} name="newPassword" label="New password" passwordError={newPasswordError} />
      <Password required={false} name="newPassword2" label="Re-enter new password" passwordError={newPassword2Error} />
      <Text
        size="fine"
        color="subtle"
        className={`mt-1 ${currentPasswordError || newPasswordError ? "text-red-500" : ""}`}
      >
        Passwords must be at least 6 characters.
      </Text>
      {newPassword2Error ? <br /> : null}
      <Text size="fine" className={`mt-1 text-red-500 ${newPassword2Error ? "" : "invisible"}`}>
        {newPassword2Error} &nbsp;
      </Text>
      <div className="mt-6 flex flex-col gap-1">
        <Button type="submit" color="primary" disabled={state !== "idle"} className="mb-2 text-sm">
          Save
        </Button>
        <Button type="button" color="ghost" onClick={() => onClose()} className="text-sm">
          Cancel
        </Button>
      </div>
    </Form>
  );
}

function Password({ name, required = false, passwordError, label }: PasswordProps) {
  const [password, setPassword] = useState("");

  return (
    <Input
      id={name}
      name={name}
      type="password"
      value={password}
      color={passwordError ? "error" : "primary"}
      required={required}
      minLength={8}
      aria-label={label}
      placeholder={label}
      autoComplete={name === "currentPassword" ? "current-password" : undefined}
      onChange={(event) => {
        setPassword(event.target.value);
      }}
    />
  );
}

export async function callAccountUpdateApi({
  email,
  phone,
  lastName,
  firstName,
  newPassword,
  currentPassword,
}: {
  email: string;
  phone: string;
  lastName: string;
  firstName: string;
  newPassword: string;
  currentPassword: string;
}) {
  try {
    const res = await fetch(`/account`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        phone,
        firstName,
        lastName,
        currentPassword,
        newPassword,
      }),
    });
    if (res.ok) {
      return {};
    } else {
      return res.json();
    }
  } catch (_e) {
    return {
      error: "Error saving account. Please try again.",
    };
  }
}

type FormElements = {
  firstName: HTMLInputElement;
  lastName: HTMLInputElement;
  phone: HTMLInputElement;
  email: HTMLInputElement;
  currentPassword: HTMLInputElement;
  newPassword: HTMLInputElement;
  newPassword2: HTMLInputElement;
};

type PasswordProps = {
  name: string;
  label: string;
  required?: boolean;
  passwordError: string | null;
};

type AccountDetailsEditProps = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  onClose: () => void;
};
