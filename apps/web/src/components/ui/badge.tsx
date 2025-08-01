export const Badge = ({
  children = "Default Badge",
  variant = "default",
  className = "",
}: BadgeProps) => {
  const baseStyle = "inline-block rounded px-2 py-1 text-xs font-semibold";
  const variantStyle =
    variant === "secondary"
      ? "bg-slate-100 text-slate-800 border border-slate-300"
      : "bg-gray-200 text-gray-800";

  return <span className={`${baseStyle} ${variantStyle} ${className}`}>{children}</span>;
};
