import { useContext } from "react";
import { LocalizationContext } from "~/context/localization-context";

export const useLocalization = () => {
  const context = useContext(LocalizationContext);

  if (context === null) {
    throw Error("useLocalization() must be invoked as a child of the LocalizationProvider");
  }

  return context;
};
