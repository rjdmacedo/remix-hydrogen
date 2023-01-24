import { Disclosure, Transition } from "@headlessui/react";
import { Link } from "@remix-run/react";
import { Text } from "~/components/elements/Text";
import { IconClose } from "../elements/Icon";

export function ProductDetail({
  title,
  content,
  learnMore,
  defaultOpen = false,
}: ProductDetailProps) {
  return (
    <Disclosure
      key={title}
      as="div"
      className="grid w-full gap-2"
      defaultOpen={defaultOpen}
    >
      {({ open }) => (
        <>
          <Disclosure.Button className="text-left">
            <div className="flex justify-between">
              <Text size="lead" as="h4">
                {title}
              </Text>
              <IconClose
                className={`${
                  open ? "" : "rotate-[45deg]"
                } transform-gpu transition-transform duration-200`}
              />
            </div>
          </Disclosure.Button>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className={"grid gap-2 pb-4 pt-2"}>
              <Text as="div">{content}</Text>
              {learnMore && (
                <Link
                  to={learnMore}
                  className="border-primary text-primary border-b pb-px"
                >
                  Learn more
                </Link>
              )}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}

type ProductDetailProps = {
  title: string;
  content: string;
  learnMore?: string;
  defaultOpen?: boolean;
};
