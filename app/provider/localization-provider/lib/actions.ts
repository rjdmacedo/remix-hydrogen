import type { CountryCode } from "~/gql/types";

export type LocalizationAction = { type: "SET_COUNTRY"; payload: CountryCode };
