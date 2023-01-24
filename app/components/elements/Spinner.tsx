import clsx from "clsx";

export function Spinner({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  fill?: string;
  className?: string;
}) {
  // const {themeMode} = useSettings();
  const isDark = false; // themeMode === 'dark';

  const sizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-7 w-7",
  };

  const styles = clsx(className, sizes[size], `animate-spin ${isDark ? "text-gray-300 " : "text-gray-700"}`);

  return (
    <svg fill="none" className={styles} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" className="opacity-25" stroke="currentColor" strokeWidth="4"></circle>
      <path
        fill="currentColor"
        className="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
