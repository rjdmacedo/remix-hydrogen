export const notificationMessages = ["message:info", "message:error", "message:success", "message:warning"] as const;

export const bgColors = ["neutral", "base-100", "base-200", "base-300"] as const;
export const componentStatuses = ["info", "error", "success", "warning"] as const;
export const defaultTheme = "light";
export const componentShapes = ["circle", "square"] as const;
export const componentSizes = ["lg", "md", "sm", "xs"] as const;
export const brandColors = ["primary", "secondary", "accent"] as const;
export const componentPositions = ["top", "bottom", "left", "right"] as const;

export const componentColors = [...brandColors, "ghost", ...componentStatuses] as const;
