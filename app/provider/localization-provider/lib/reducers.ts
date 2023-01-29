import { produce } from "immer";
import type { CountryCode } from "~/gql/types";
import { LocalizationAction } from "~/provider/localization-provider/lib/actions";

export type LocalizationState = {
  country?: CountryCode;
};

export const reducer = produce((draft: LocalizationState, action: LocalizationAction) => {
  switch (action.type) {
    case "SET_COUNTRY":
      draft.country = action.payload;
      break;
  }
});
