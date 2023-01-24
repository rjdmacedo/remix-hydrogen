import React, { Fragment, useCallback } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { Listbox, Transition } from "@headlessui/react";

import { Text, IconCheck, Skeleton, Badge } from "~/components/elements";
import { useProduct } from "@shopify/storefront-kit-react";

export function ProductOptions({ name, values, loaded = true, handleChange }: ProductOptionsProps) {
  const asDropdown = values.length > 7;

  return asDropdown ? (
    loaded ? (
      <OptionsDropdown name={name} values={values} handleChange={handleChange} />
    ) : (
      <Skeleton />
    )
  ) : loaded ? (
    <OptionsGrid values={values} name={name} handleChange={handleChange} />
  ) : (
    <>
      {values.map((value) => (
        <Skeleton key={value} type="badge" />
      ))}
    </>
  );
}

function OptionsGrid({ name, values, handleChange }: ProductOptionsGridProps) {
  const { selectedOptions } = useProduct();

  return (
    <>
      {values.map((value) => {
        const id = `product-option-${name}-${value}`;
        const checked = selectedOptions![name] === value;

        return (
          <Text as="label" key={id} htmlFor={id}>
            <input
              id={`product-option-${name}-${value}`}
              type="radio"
              name={`option[${name}]`}
              value={value}
              checked={checked}
              className="sr-only"
              onChange={() => handleChange(name, value)}
            />
            <Badge color={checked ? "primary" : "ghost"} className="cursor-pointer">
              {value}
            </Badge>
          </Text>
        );
      })}
    </>
  );
}

// TODO: De-dupe UI with CountrySelector
function OptionsDropdown({ name, values, handleChange }: ProductOptionsDropdownProps) {
  const { selectedOptions } = useProduct();

  const updateSelectedOption = useCallback(
    (value: string) => {
      handleChange(name, value);
    },
    [name, handleChange]
  );

  return (
    <div className="relative w-full">
      <Listbox onChange={updateSelectedOption} value="">
        <Listbox.Button className="relative w-full cursor-default rounded-lg border py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">{selectedOptions![name]}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
          </span>
        </Listbox.Button>

        <Transition as={Fragment} leave="transition ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="absolute z-10 mt-3 max-h-60 w-full overflow-auto rounded-md border bg-base-100 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {values.map((value) => {
              const isSelected = selectedOptions![name] === value;
              const id = `option-${name}-${value}`;

              return (
                <Listbox.Option key={id} value={value}>
                  {({ active }) => (
                    <div
                      className={`flex w-full cursor-pointer items-center justify-start rounded p-2 text-left transition ${
                        active ? "bg-primary/10" : null
                      }`}
                    >
                      {value}
                      {isSelected ? (
                        <span className="ml-2">
                          <IconCheck />
                        </span>
                      ) : null}
                    </div>
                  )}
                </Listbox.Option>
              );
            })}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
}

type ProductOptionsProps = {
  values: any[];
  loaded?: boolean;
  [key: string]: any;
} & React.ComponentProps<typeof OptionsGrid>;

type ProductOptionsGridProps = {
  values: string[];
  name: string;
  handleChange: (name: string, value: string) => void;
};

type ProductOptionsDropdownProps = {
  name: string;
  values: string[];
  handleChange: (name: string, value: string) => void;
};
