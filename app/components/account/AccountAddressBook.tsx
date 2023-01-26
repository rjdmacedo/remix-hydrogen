import React, { useState, useMemo } from "react";
import type { MouseEventHandler } from "react";

import { Text, Button } from "~/components/elements";
import { Modal } from "~/components/global";
import { AccountDeleteAddress } from "~/components/account/AccountDeleteAddress";
import { AccountAddressEdit } from "~/components/account/AccountAddressEdit";

export function AccountAddressBook({ addresses, defaultAddress }: AccountAddressBookProps) {
  const [editingAddress, setEditingAddress] = useState("");
  const [deletingAddress, setDeletingAddress] = useState("");

  const { fullDefaultAddress, addressesWithoutDefault } = useMemo(() => {
    const defaultAddressIndex = addresses.findIndex((address) => address.id === defaultAddress);
    return {
      addressesWithoutDefault: [
        ...addresses.slice(0, defaultAddressIndex),
        ...addresses.slice(defaultAddressIndex + 1, addresses.length),
      ],
      fullDefaultAddress: addresses[defaultAddressIndex],
    };
  }, [addresses, defaultAddress]);

  function close() {
    setEditingAddress("");
    setDeletingAddress("");
  }

  function editAddress(address: string) {
    setEditingAddress(address);
  }

  return (
    <>
      <Modal isOpen={!!deletingAddress} onClose={close} title="Confirm removal">
        <AccountDeleteAddress addressId={deletingAddress} onClose={close} />
      </Modal>
      <Modal isOpen={!!editingAddress} onClose={close}>
        <AccountAddressEdit
          address={editingAddress}
          defaultAddress={fullDefaultAddress === editingAddress}
          close={close}
        />
      </Modal>
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h3 className="text-lead font-bold">Address Book</h3>
        <div>
          {!addresses?.length ? (
            <Text className="mb-1" width="narrow" as="p" size="copy">
              You haven&apos;t saved any addresses yet.
            </Text>
          ) : null}
          <div className="w-48">
            <Button
              color="secondary"
              className="mt-2 mb-6 w-full text-sm"
              onClick={() => {
                editAddress({
                  id: "",
                  /** empty address */
                });
              }}
            >
              Add an Address
            </Button>
          </div>
          {addresses?.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              <RenderAddressConditionally
                editAddress={editAddress}
                fullDefaultAddress={fullDefaultAddress}
                setDeletingAddress={setDeletingAddress}
              />
              {addressesWithoutDefault.map((address) => (
                <Address
                  key={address.id}
                  address={address}
                  setDeletingAddress={setDeletingAddress.bind(null, address.originalId)}
                  editAddress={editAddress}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

function Address({ address, editAddress, defaultAddress, setDeletingAddress }: AddressProps) {
  return (
    <div className="flex flex-col rounded border border-gray-200 p-6 lg:p-8">
      {defaultAddress ? (
        <div className="mb-3 flex flex-row">
          <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary/50">Default</span>
        </div>
      ) : null}
      <ul className="flex-1 flex-row">
        {address.firstName || address.lastName ? (
          <li>{(address.firstName && address.firstName + " ") + address.lastName}</li>
        ) : (
          <></>
        )}
        {address.formatted ? address.formatted.map((line: string) => <li key={line}>{line}</li>) : <></>}
      </ul>

      <div className="mt-6 flex flex-row font-medium">
        <button
          onClick={() => {
            editAddress(address);
          }}
          className="text-left text-sm underline"
        >
          Edit
        </button>
        <button onClick={setDeletingAddress} className="ml-6 text-left text-sm text-primary/50">
          Remove
        </button>
      </div>
    </div>
  );
}

function RenderAddressConditionally({
  editAddress,
  fullDefaultAddress,
  setDeletingAddress,
}: RenderAddressConditionallyProps) {
  return (
    <>
      {fullDefaultAddress ? (
        <Address
          address={fullDefaultAddress}
          editAddress={editAddress}
          defaultAddress
          setDeletingAddress={setDeletingAddress.bind(null, fullDefaultAddress.originalId)}
        />
      ) : null}
    </>
  );
}

type AddressProps = {
  address: any;
  editAddress: (address: any) => void;
  defaultAddress?: boolean;
  setDeletingAddress: MouseEventHandler<HTMLButtonElement>;
};

type AccountAddressBookProps = {
  addresses: any[];
  defaultAddress: any;
};

type RenderAddressConditionallyProps = {
  editAddress: (address: any) => void;
  fullDefaultAddress: any;
  setDeletingAddress: (address: any) => void;
};
