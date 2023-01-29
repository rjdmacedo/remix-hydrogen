import type { Dispatch } from "react";
import { createContext } from "react";
import type { LocalizationState } from "~/provider/localization-provider/lib/reducers";
import type { LocalizationAction } from "~/provider/localization-provider/lib/actions";

export const LocalizationContext = createContext<{
  state: LocalizationState;
  dispatch: Dispatch<LocalizationAction>;
  getRelativePath: (path: string) => string;
} | null>(null);
