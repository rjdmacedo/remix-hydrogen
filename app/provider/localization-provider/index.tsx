import React, { useMemo, useReducer } from "react";
import { reducer } from "~/provider/localization-provider/lib/reducers";
import { LocalizationContext } from "~/context/localization-context";
import type { CountryCode } from "~/gql/types";

export const LocalizationProvider: React.FC<Props> = ({ country, children }) => {
  const [state, dispatch] = useReducer(reducer, {
    country,
  });

  const value = useMemo(
    () => ({
      state,
      dispatch,
      getRelativePath: (path: string) => {
        if (country) {
          return ["", country.toLowerCase(), path].join("/").replace(/\/+/g, "/");
        }
        return ["", path].join("/").replace(/\/+/g, "/");
      },
    }),
    [state, country]
  );

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
};

type Props = {
  country?: CountryCode;
  children: React.ReactNode;
};
