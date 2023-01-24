import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import clsx from "clsx";
import { Button, Heading } from "~/components/elements";
import { XMarkIcon } from "@heroicons/react/24/outline";

function Drawer({ open, heading, onClose, children, width = "md", openFrom = "right" }: DrawerProps) {
  const offScreen = {
    right: "translate-x-full",
    left: "-translate-x-full",
  };

  const styles = {
    panel: clsx(width ? `max-w-${width}` : "", "w-screen pointer-events-auto bg-base-100"),
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`pointer-events-none fixed inset-y-0 flex max-w-full ${openFrom === "right" ? "right-0" : ""}`}
            >
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom={offScreen[openFrom]}
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo={offScreen[openFrom]}
              >
                <Dialog.Panel className={styles.panel}>
                  <div className="flex h-full flex-col overflow-y-scroll shadow-xl">
                    <header className="flex h-nav items-center px-4 sm:px-6">
                      <div className="flex w-full items-center justify-between">
                        {heading !== null && (
                          <Dialog.Title>
                            <Heading as="span" size="lead" id="cart-contents">
                              {heading}
                            </Heading>
                          </Dialog.Title>
                        )}
                        <div className="ml-3 flex h-7 items-center gap-3">
                          <Button size="sm" color="ghost" shape="circle" onClick={onClose}>
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </div>
                    </header>
                    {children}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

type DrawerProps = {
  open: boolean;
  heading?: string;
  width?: "min" | "xs" | "sm" | "md" | "lg" | "xl" | "full";
  onClose: () => void;
  children: React.ReactNode;
  openFrom: "right" | "left";
};

/* Use for associating aria-labelledby with the title*/
Drawer.Title = Dialog.Title;

export { Drawer };
