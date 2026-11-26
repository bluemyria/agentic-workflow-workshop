import { Badge } from "@/components/atoms/badge";
import type { Level } from "@/types/session";
import { useTranslations } from "next-intl";

interface LevelBadgeProps {
  level: Level;
}

/** A session's experience level as a translated accent badge. */
export function LevelBadge({ level }: LevelBadgeProps) {
  const t = useTranslations("SessionLevel");

  return <Badge variant="accent">{t(level)}</Badge>;
}
