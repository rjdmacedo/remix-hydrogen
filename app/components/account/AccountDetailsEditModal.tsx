import React, { useEffect, useRef, useState } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";

import { Modal } from "~/components/global";
import { isArray } from "lodash";
import type { action } from "~/routes/_nav.account";
import { isNavigation } from "~/utilities";
import { Text, Button, Input, Alert } from "~/components/elements";

export function AccountDetailsEditModal({
  email,
  phone,
  isOpen,
  onClose,
  lastName,
  firstName,
}: AccountDetailsEditModalProps) {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const { submitting } = isNavigation(navigation);

  const isUpdating = submitting && navigation.formData?.get("_action") === "update";

  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const [emailHasError, setEmailHasError] = useState(false);
  const [phoneHasError, setPhoneHasError] = useState(false);

  const didError = emailHasError || phoneHasError;

  const clearErrors = () => {
    setEmailHasError(false);
    setPhoneHasError(false);
  };

  useEffect(() => {
    if (!isOpen) {
      clearErrors();
      formRef.current?.reset();
    }
  }, [isOpen]);

  useEffect(() => {
    if (actionData?.error === null) {
      clearErrors();
      onClose();
    }

    if (isArray(actionData?.error?.field)) {
      const field = actionData?.error?.field[1] || "";
      switch (field) {
        case "email":
          emailRef.current?.focus();
          setEmailHasError(true);
          break;
        case "phone":
          phoneRef.current?.focus();
          setPhoneHasError(true);
          break;
        default:
          break;
      }
    }
  }, [actionData, onClose]);

  const handleFormChange = (event: any) => {
    event.stopPropagation();
    switch (event.target.name) {
      case "email": {
        setEmailHasError(false);
        break;
      }
      case "phone": {
        setPhoneHasError(false);
        break;
      }
      default:
        break;
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} title="Update your profile">
      <Form ref={formRef} method="post" className="flex flex-col gap-4" replace onChange={handleFormChange}>
        {didError && (
          <Alert status="error">
            <Text size="sm">{actionData?.error?.message}</Text>
          </Alert>
        )}

        <Input
          id="firstname"
          name="firstName"
          type="text"
          defaultValue={firstName}
          label="First name"
          aria-label="First name"
          placeholder="First name"
          autoComplete="given-name"
        />

        <Input
          id="lastname"
          name="lastName"
          type="text"
          defaultValue={lastName}
          label="Last name"
          aria-label="Last name"
          autoComplete="family-name"
          placeholder="Last name"
        />

        <Input
          id="phone"
          ref={phoneRef}
          name="phone"
          type="tel"
          label="Mobile"
          color={phoneHasError ? "error" : undefined}
          aria-label="Mobile"
          defaultValue={phone}
          autoComplete="tel"
          placeholder="Mobile"
        />

        <Input
          id="email"
          ref={emailRef}
          name="email"
          type="email"
          color={emailHasError ? "error" : undefined}
          defaultValue={email}
          label="Email Address"
          aria-label="Email address"
          placeholder="Email address"
          autoComplete="email"
        />

        <Text as="h3" size="lead">
          Change your password
        </Text>
        <Password name="currentPassword" label="Current password" />
        <Password name="newPassword" label="New password" />
        <Password name="newPassword2" label="Re-enter new password" />

        <Button type="submit" color="primary" name="_action" value="update" loading={isUpdating} disabled={isUpdating}>
          {isUpdating ? "Saving..." : "Save"}
        </Button>
        <Button type="reset" color="ghost" onClick={onClose} className="text-sm" disabled={isUpdating}>
          Cancel
        </Button>
      </Form>
    </Modal>
  );
}

function Password({ name, required = false, label }: PasswordProps) {
  return (
    <Input
      id={name}
      name={name}
      type="password"
      required={required}
      minLength={8}
      aria-label={label}
      placeholder={label}
      autoComplete={name === "currentPassword" ? "current-password" : "new-password"}
    />
  );
}

type PasswordProps = {
  name: string;
  label: string;
  required?: boolean;
};

type AccountDetailsEditModalProps = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  isOpen: boolean;
  onClose: () => void;
};
