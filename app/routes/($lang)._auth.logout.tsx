import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { logout } from "~/session.server";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { getCountryCode } from "~/utilities";

export async function action({ request }: ActionArgs) {
  const country = getCountryCode(request);
  console.log("action", country);
  return logout(request, country ? `/${country.toLowerCase()}` : "/");
}

export async function loader({ request }: LoaderArgs) {
  const country = getCountryCode(request);
  console.log("loader", country);
  return redirect(country ? `/${country.toLowerCase()}` : "/");
}
