import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  image?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserAvatar({
  name,
  image,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const avatarSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "default";

  return (
    <Avatar
      size={avatarSize}
      className={cn(size === "lg" && "size-20", className)}
    >
      {image ? (
        <AvatarImage key={image} src={image} alt={`${name}'s profile`} />
      ) : null}
      <AvatarFallback className={cn(size === "lg" && "text-xl")}>
        {getInitials(name) || "?"}
      </AvatarFallback>
    </Avatar>
  );
}
