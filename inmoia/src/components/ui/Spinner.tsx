type SpinnerProps = {
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

export function Spinner({ size = "md" }: SpinnerProps) {
  return <span className={`spinner inline-block ${sizeMap[size]}`} aria-label="Cargando" />;
}
