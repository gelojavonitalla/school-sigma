// src/components/common/SafeLink.tsx
import { Link, type LinkProps, UNSAFE_NavigationContext } from "react-router-dom";
import { useContext } from "react";

export default function SafeLink(props: LinkProps) {
  const ctx = useContext(UNSAFE_NavigationContext);
  if (!ctx) {
    const { to, children, ...rest } = props as LinkProps & { children: React.ReactNode };
    const href = typeof to === "string" ? to : (to as any)?.pathname ?? "#";
    return <a href={href} {...(rest as any)}>{children}</a>;
  }
  return <Link {...props} />;
}