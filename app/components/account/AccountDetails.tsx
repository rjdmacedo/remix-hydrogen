import { useCallback, useState } from "react";
import { useNavigation } from "@remix-run/react";

import { Button } from "~/components/elements";
import { isNavigation } from "~/utilities";
import { AccountDetailsEditModal } from "~/components/account/AccountDetailsEditModal";

export function AccountDetails({ phone, email, lastName, firstName }: AccountDetailsProps) {
  const navigation = useNavigation();
  const { reloading } = isNavigation(navigation);
  const [isEditing, setIsEditing] = useState(false);

  const openModal = () => {
    setIsEditing(true);
  };

  const closeModal = useCallback(() => {
    setIsEditing(false);
  }, []);

  return (
    <>
      <div className="grid w-full gap-2 p-4 py-6 md:gap-4 md:p-8 lg:p-12">
        <h3 className="text-lead font-bold">Account Details</h3>
        <div className="rounded border p-4 lg:p-6">
          <div className="flex">
            <h3 className="flex-1 text-base font-bold">Profile & Security</h3>
            <Button type="button" variant="link" size="sm" onClick={openModal}>
              Edit
            </Button>
          </div>
          <div className="mt-4 text-sm text-primary/50">Name</div>
          {reloading && navigation.formData?.get("_action") === "update" ? (
            <TextSkeleton />
          ) : (
            <p className="mt-1">{firstName || lastName ? `${firstName || ""} ${lastName || ""}` : "Add name"}</p>
          )}

          <div className="mt-4 text-sm text-primary/50">Contact</div>
          {reloading ? <TextSkeleton /> : <p className="mt-1">{phone ?? "Add mobile"}</p>}

          <div className="mt-4 text-sm text-primary/50">Email address</div>
          {reloading ? <TextSkeleton /> : <p className="mt-1">{email}</p>}

          <div className="mt-4 text-sm text-primary/50">Password</div>
          {reloading ? <TextSkeleton /> : <p className="mt-1">**************</p>}
        </div>
      </div>

      <AccountDetailsEditModal
        phone={phone}
        email={email}
        lastName={lastName}
        firstName={firstName}
        isOpen={isEditing}
        onClose={closeModal}
      />
    </>
  );
}

function TextSkeleton() {
  return <div className="h-7 w-1/3 animate-pulse rounded bg-base-200"></div>;
}

type AccountDetailsProps = {
  email?: string;
  phone?: string;
  lastName?: string;
  firstName?: string;
};
