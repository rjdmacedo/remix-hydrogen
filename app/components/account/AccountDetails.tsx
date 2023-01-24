import { useCallback, useState } from "react";
import { Modal } from "~/components/global";
import { useNavigation } from "@remix-run/react";
import { AccountDetailsEdit } from "~/components/account/AccountDetailsEdit";
import { Button } from "~/components/elements";

export function AccountDetails({ phone, email, lastName, firstName }: AccountDetailsProps) {
  const { state } = useNavigation();
  const [isEditing, setIsEditing] = useState(false);

  const handleOnClose = useCallback(() => setIsEditing(false), []);

  return (
    <>
      <Modal onClose={handleOnClose} isOpen={isEditing} title="Update your profile">
        <AccountDetailsEdit
          phone={phone}
          email={email}
          onClose={handleOnClose}
          lastName={lastName}
          firstName={firstName}
        />
      </Modal>
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h3 className="text-lead font-bold">Account Details</h3>
        <div className="rounded border border-gray-200 p-6 lg:p-8">
          <div className="flex">
            <h3 className="flex-1 text-base font-bold">Profile & Security</h3>
            <Button variant="link" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </div>
          <div className="mt-4 text-sm text-primary/50">Name</div>
          {state !== "idle" ? (
            <TextSkeleton />
          ) : (
            <p className="mt-1">{firstName || lastName ? `${firstName || ""} ${lastName || ""}` : "Add name"}</p>
          )}

          <div className="mt-4 text-sm text-primary/50">Contact</div>
          {state !== "idle" ? <TextSkeleton /> : <p className="mt-1">{phone ?? "Add mobile"}</p>}

          <div className="mt-4 text-sm text-primary/50">Email address</div>
          {state !== "idle" ? <TextSkeleton /> : <p className="mt-1">{email}</p>}

          <div className="mt-4 text-sm text-primary/50">Password</div>
          {state !== "idle" ? <TextSkeleton /> : <p className="mt-1">**************</p>}
        </div>
      </div>
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
