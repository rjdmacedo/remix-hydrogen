import React, { useEffect, useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";

import { Modal } from "~/components/global";
import { isArray } from "lodash";
import { Text, Button, Input } from "~/components/elements";
import { AnimatePresence, motion } from "framer-motion";

export function AccountDetailsEditModal({
  phone,
  email,
  isOpen,
  onClose,
  lastName,
  firstName,
}: AccountDetailsEditModalProps) {
  const account = useFetcher();

  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };

  useEffect(() => {
    if (isOpen) {
      clearErrors();
      formRef.current?.reset();
    }
  }, [isOpen]);

  useEffect(() => {
    if (account.data?.error === null) {
      onClose();
    }

    clearErrors();
    if (isArray(account.data?.error?.field)) {
      const field = account.data?.error?.field[1] || "";
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
  }, [account.data, onClose]);

  const isUpdating = account.submission?.formData?.get("_action") === "update";

  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const [emailHasError, setEmailHasError] = useState(false);
  const [phoneHasError, setPhoneHasError] = useState(false);

  const clearErrors = () => {
    setEmailHasError(false);
    setPhoneHasError(false);
  };

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
      <account.Form ref={formRef} method="post" action="/account" replace onChange={handleFormChange}>
        <fieldset className="flex flex-col gap-3" disabled={isUpdating}>
          <Input
            id="firstname"
            name="firstName"
            type="text"
            label="First Name"
            aria-label="First name"
            placeholder="First name"
            autoComplete="given-name"
            defaultValue={firstName}
          />

          <Input
            id="lastname"
            name="lastName"
            type="text"
            label="Last name"
            aria-label="Last Name"
            autoComplete="family-name"
            placeholder="Last name"
            defaultValue={lastName}
          />

          <Input
            id="phone"
            ref={phoneRef}
            name="phone"
            type="tel"
            label="Phone"
            color={phoneHasError ? "error" : undefined}
            aria-label="Phone"
            autoComplete="tel"
            placeholder="Phone"
            defaultValue={phone}
          />
          <AnimatePresence>
            <motion.div variants={variants} animate={phoneHasError ? "open" : "closed"}>
              <Text color="error" size="fine" className="absolute -top-1">
                {phoneHasError && account.data?.error?.message}
              </Text>
            </motion.div>
          </AnimatePresence>

          <Input
            id="email"
            ref={emailRef}
            name="email"
            type="email"
            color={emailHasError ? "error" : undefined}
            label="Email Address"
            aria-label="Email address"
            placeholder="Email address"
            defaultValue={email}
            autoComplete="email"
          />
          <AnimatePresence>
            <motion.div variants={variants} animate={emailHasError ? "open" : "closed"}>
              <Text color="error" size="fine" className="absolute -top-1">
                {emailHasError && account.data?.error?.message}
              </Text>
            </motion.div>
          </AnimatePresence>

          <Text as="h3" size="lead" className="my-3">
            Change your password
          </Text>

          <Password name="currentPassword" label="Current password" />
          <Password name="newPassword" label="New password" />

          <Button type="submit" color="primary" name="_action" value="update" loading={isUpdating}>
            {isUpdating ? "Saving..." : "Save"}
          </Button>
          <Button type="reset" color="ghost" onClick={onClose} className="text-sm">
            Cancel
          </Button>
        </fieldset>
      </account.Form>
    </Modal>
  );
}

function Password({ name, required = false, label }: PasswordProps) {
  return (
    <Input
      id={name}
      name={name}
      type="password"
      label={label}
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
