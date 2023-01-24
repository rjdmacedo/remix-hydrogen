import { CartDetails } from "~/components/cart";
import { Drawer } from "~/components/global/Drawer";

export function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <CartDetails layout="drawer" onClose={onClose} />
    </Drawer>
  );
}
