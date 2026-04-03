import { cn } from "@/lib/utils/cn";

type AvatarSize = "sm" | "md" | "lg" | "xl";

type AvatarProps = {
  initials: string;
  size?: AvatarSize;
  round?: boolean;
};

const sizeClass: Record<AvatarSize, string> = {
  sm: "avatar-sm",
  md: "avatar-md",
  lg: "avatar-lg",
  xl: "avatar-xl",
};

export function Avatar({ initials, size = "md", round = false }: AvatarProps) {
  return <span className={cn("avatar", sizeClass[size], round && "avatar-round")}>{initials}</span>;
}
