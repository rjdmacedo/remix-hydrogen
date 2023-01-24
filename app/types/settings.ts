import type React from "react";
import type { notificationMessages } from "~/types/constants";

export type ThemeMode = "light" | "dark";

export type SettingsContextProps = {
  themeMode: ThemeMode;

  // Mode
  onToggleMode: VoidFunction;
  onChangeMode: (event: React.ChangeEvent<HTMLInputElement> | "light" | "dark") => void;

  // Reset
  onResetSetting: VoidFunction;
};

export type SettingsValueProps = {
  themeMode: ThemeMode;
};

export type FlashNotification = {
  name: (typeof notificationMessages)[number];
  value: string;
};
