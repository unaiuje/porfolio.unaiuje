import {
  Github,
  Globe,
  Instagram,
  Linkedin,
  Link2,
  Mail,
  Youtube,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

export const SOCIAL_ICON_OPTIONS = [
  "github",
  "linkedin",
  "x",
  "mail",
  "instagram",
  "youtube",
  "globe",
  "link",
] as const;

export type SocialIconName = (typeof SOCIAL_ICON_OPTIONS)[number];

const XLogo = (props: LucideProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={props.size ?? 24}
    height={props.size ?? 24}
    className={props.className}
    aria-hidden="true"
  >
    <title>X</title>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ICONS: Record<string, ComponentType<LucideProps>> = {
  github: Github,
  linkedin: Linkedin,
  x: XLogo,
  mail: Mail,
  email: Mail, // legacy kind value used by the first seeded rows
  instagram: Instagram,
  youtube: Youtube,
  globe: Globe,
  link: Link2,
};

export const isSocialIconName = (name: string): name is SocialIconName =>
  (SOCIAL_ICON_OPTIONS as readonly string[]).includes(name);

export const SocialIcon = ({ name, size = 16, className }: { name: string; size?: number; className?: string }) => {
  const Icon = ICONS[name] ?? Globe;
  return <Icon size={size} className={className} />;
};
