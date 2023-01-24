// import { Button, Heading, Text } from "~/components/elements";
// import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
// import { useCart, Image } from "@shopify/storefront-kit-react";
// // import { useCartLine } from "@shopify/storefront-kit-react/dist/types/CartLineProvider";
// import { Link } from "@remix-run/react";
// import type { Image as ImageT } from "@shopify/storefront-kit-react/storefront-api-types";
// // import { CartLinePrice } from "@shopify/storefront-kit-react/dist/types/CartLinePrice";
// // import { useCartActions } from "@shopify/storefront-kit-react/dist/types/useCartActions";
//
// export function CartLineItem() {
//   const { linesRemove, cartFragment } = useCart();
//   // const { id: lineId, quantity, merchandise, cost } = useCartLine();
//
//   return (
//     <li key={lineId} className="flex gap-4">
//       <div className="w-1/4">
//         <Image
//           width={112}
//           height={112}
//           widths={[112]}
//           data={merchandise.image as ImageT}
//           loaderOptions={{
//             scale: 2,
//             crop: "center",
//           }}
//           className="rounded border object-cover object-center"
//         />
//       </div>
//
//       <div className="flex w-3/4 justify-between">
//         <div className="grid gap-2">
//           <Heading as="h3" size="copy">
//             <Link to={`/products/${merchandise.product.handle}`}>
//               {merchandise.product.title}
//             </Link>
//           </Heading>
//
//           <div className="grid pb-2">
//             {(merchandise?.selectedOptions || []).map((option) => (
//               <Text color="notice" key={option.name}>
//                 {option.name}: {option.value}
//               </Text>
//             ))}
//           </div>
//
//           <div className="flex items-center gap-2">
//             <div className="text-copy flex justify-start">
//               <CartLineQuantityAdjust
//                 lineId={lineId}
//                 quantity={quantity}
//                 cartFragment={cartFragment}
//               />
//             </div>
//
//             <Button
//               size="sm"
//               type="button"
//               color="ghost"
//               shape="circle"
//               onClick={() => linesRemove([lineId])}
//             >
//               <span className="sr-only">Remove</span>
//               <TrashIcon className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>
//         <Text className="ml-2">
//           <CartLinePrice as="span" data={{ cost }} />
//         </Text>
//       </div>
//     </li>
//   );
// }
//
// function CartLineQuantityAdjust({
//   lineId,
//   quantity,
//   cartFragment,
// }: {
//   lineId: string;
//   quantity: number;
//   cartFragment: string;
// }) {
//   const { cartLineAdd, cartLineRemove } = useCartActions({
//     cartFragment: cartFragment,
//   });
//
//   return (
//     <>
//       <label htmlFor={`quantity-${lineId}`} className="sr-only">
//         Quantity, {quantity}
//       </label>
//       <div className="border-base-content flex items-center rounded-xl border">
//         <Button
//           aria-label="Decrease quantity"
//           className="btn btn-link btn-sm"
//           onClick={() => cartLineRemove(cartFragment, [lineId])}
//         >
//           <MinusIcon className="h-5 w-5" />
//         </Button>
//         <span className="px-3 text-center">{quantity}</span>
//         <Button
//           aria-label="Increase quantity"
//           className="btn btn-link btn-sm"
//           onClick={() => cartLineAdd(cartFragment, [])}
//         >
//           <PlusIcon className="h-5 w-5" />
//         </Button>
//       </div>
//     </>
//   );
// }
