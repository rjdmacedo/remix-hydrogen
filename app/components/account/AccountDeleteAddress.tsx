import { Text, Button } from "~/components/elements";

export function AccountDeleteAddress({ onClose, addressId }: AccountDeleteAddressProps) {
  async function deleteAddress(id: string) {
    const response = await callDeleteAddressApi(id);
    if (response.error) {
      alert(response.error);
      return;
    }
    onClose();
  }

  return (
    <>
      <Text as="p">Are you sure you wish to remove this address?</Text>
      <div className="mt-6">
        <Button
          color="primary"
          className="text-sm"
          onClick={async () => {
            await deleteAddress(addressId);
          }}
        >
          Confirm
        </Button>
        <Button color="secondary" className="mt-2 text-sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </>
  );
}

export async function callDeleteAddressApi(id: string) {
  try {
    const res = await fetch(`/account/address/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
    if (res.ok) {
      return {};
    } else {
      return res.json();
    }
  } catch (_e) {
    return {
      error: "Error removing address. Please try again.",
    };
  }
}

type AccountDeleteAddressProps = {
  addressId: string;
  onClose: () => void;
};
