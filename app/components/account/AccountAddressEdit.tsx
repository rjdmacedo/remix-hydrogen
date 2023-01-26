import React, { useMemo, useState } from "react";

import { Button, Text } from "~/components/elements";

export function AccountAddressEdit({ close, address, defaultAddress }: AccountAddressEditProps) {
  const isNewAddress = useMemo(() => !Object.keys(address).length, [address]);

  const [zip, setZip] = useState(address?.zip || "");
  const [city, setCity] = useState(address?.city || "");
  const [phone, setPhone] = useState(address?.phone || "");
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState(address?.company || "");
  const [country, setCountry] = useState(address?.country || "");
  const [address1, setAddress1] = useState(address?.address1 || "");
  const [address2, setAddress2] = useState(address?.address2 || "");
  const [lastName, setLastName] = useState(address?.lastName || "");
  const [province, setProvince] = useState(address?.province || "");
  const [firstName, setFirstName] = useState(address?.firstName || "");
  const [submitError, setSubmitError] = useState<null | string>(null);
  const [isDefaultAddress, setIsDefaultAddress] = useState(defaultAddress);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);

    const response = await callUpdateAddressApi({
      id: address?.originalId,
      firstName,
      lastName,
      company,
      address1,
      address2,
      country,
      province,
      city,
      zip,
      phone,
      isDefaultAddress,
    });

    setSaving(false);

    if (response.error) {
      setSubmitError(response.error);
      return;
    }

    close();
  }

  return (
    <>
      <Text className="mt-4 mb-6" as="h3" size="lead">
        {isNewAddress ? "Add address" : "Edit address"}
      </Text>
      <div className="max-w-lg">
        <form noValidate onSubmit={onSubmit}>
          {submitError && (
            <div className="mb-6 flex items-center justify-center rounded bg-red-100">
              <p className="m-4 text-sm text-red-900">{submitError}</p>
            </div>
          )}
          <div className="mt-3">
            <input
              className={`focus:shadow-outline w-full appearance-none rounded border border-gray-500 py-2 px-3 leading-tight text-primary/90 placeholder:text-primary/50`}
              id="firstname"
              name="firstname"
              required
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              aria-label="First name"
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`focus:shadow-outline w-full appearance-none rounded border border-gray-500 py-2 px-3 leading-tight text-primary/90 placeholder:text-primary/50`}
              id="lastname"
              name="lastname"
              required
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              aria-label="Last name"
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`focus:shadow-outline w-full appearance-none rounded border border-gray-500 py-2 px-3 leading-tight text-primary/90 placeholder:text-primary/50`}
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder="Company"
              aria-label="Company"
              value={company}
              onChange={(event) => {
                setCompany(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`focus:shadow-outline w-full appearance-none rounded border border-gray-500 py-2 px-3 leading-tight text-primary/90 placeholder:text-primary/50`}
              id="street1"
              name="street1"
              type="text"
              autoComplete="address-line1"
              placeholder="Address line 1*"
              required
              aria-label="Address line 1"
              value={address1}
              onChange={(event) => {
                setAddress1(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`focus:shadow-outline w-full appearance-none rounded border border-gray-500 py-2 px-3 leading-tight text-primary/90 placeholder:text-primary/50`}
              id="address2"
              name="address2"
              type="text"
              autoComplete="address-line2"
              placeholder="Addresss line 2"
              aria-label="Address line 2"
              value={address2}
              onChange={(event) => {
                setAddress2(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`focus:shadow-outline w-full appearance-none rounded border border-gray-500 py-2 px-3 leading-tight text-primary/90 placeholder:text-primary/50`}
              id="city"
              name="city"
              type="text"
              required
              autoComplete="address-level2"
              placeholder="City"
              aria-label="City"
              value={city}
              onChange={(event) => {
                setCity(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`focus:shadow-outline w-full appearance-none rounded border border-gray-500 py-2 px-3 leading-tight text-primary/90 placeholder:text-primary/50`}
              id="state"
              name="state"
              type="text"
              autoComplete="address-level1"
              placeholder="State / Province"
              required
              aria-label="State"
              value={province}
              onChange={(event) => {
                setProvince(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`focus:shadow-outline w-full appearance-none rounded border border-gray-500 py-2 px-3 leading-tight text-primary/90 placeholder:text-primary/50`}
              id="zip"
              name="zip"
              type="text"
              autoComplete="postal-code"
              placeholder="Zip / Postal Code"
              required
              aria-label="Zip"
              value={zip}
              onChange={(event) => {
                setZip(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`focus:shadow-outline w-full appearance-none rounded border border-gray-500 py-2 px-3 leading-tight text-primary/90 placeholder:text-primary/50`}
              id="country"
              name="country"
              type="text"
              autoComplete="country-name"
              placeholder="Country"
              required
              aria-label="Country"
              value={country}
              onChange={(event) => {
                setCountry(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`focus:shadow-outline w-full appearance-none rounded border border-gray-500 py-2 px-3 leading-tight text-primary/90 placeholder:text-primary/50`}
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Phone"
              aria-label="Phone"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
              }}
            />
          </div>
          <div className="mt-4">
            <input
              type="checkbox"
              value=""
              name="defaultAddress"
              id="defaultAddress"
              checked={isDefaultAddress}
              className="border-1 cursor-pointer rounded-sm border-gray-500"
              onChange={() => setIsDefaultAddress(!isDefaultAddress)}
            />
            <label className="ml-2 inline-block cursor-pointer text-sm" htmlFor="defaultAddress">
              Set as default address
            </label>
          </div>
          <div className="mt-8">
            <Button type="submit" color="primary" disabled={saving} className="focus:shadow-outline w-full rounded">
              Save
            </Button>
          </div>
          <div>
            <Button color="secondary" onClick={close} className="focus:shadow-outline mt-2 w-full rounded">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export async function callUpdateAddressApi({
  id,
  firstName,
  lastName,
  company,
  address1,
  address2,
  country,
  province,
  city,
  phone,
  zip,
  isDefaultAddress,
}: {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  province: string;
  city: string;
  phone: string;
  zip: string;
  isDefaultAddress: boolean;
}) {
  try {
    const res = await fetch(id ? `/account/address/${encodeURIComponent(id)}` : "/account/address", {
      method: id ? "PATCH" : "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        company,
        address1,
        address2,
        country,
        province,
        city,
        phone,
        zip,
        isDefaultAddress,
      }),
    });
    if (res.ok) {
      return {};
    } else {
      return res.json();
    }
  } catch (_e) {
    return {
      error: "Error saving address. Please try again.",
    };
  }
}

type AccountAddressEditProps = {
  close: () => void;
  address: any;
  defaultAddress: boolean;
};
