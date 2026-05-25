"use client";

import * as React from "react";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    LinkProps {
  activeClassName?: string;
  pendingClassName?: string;
  exact?: boolean;
}

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    {
      href,
      className,
      activeClassName,
      pendingClassName,
      exact = false,
      ...props
    },
    ref
  ) => {
    const pathname = usePathname();

    const isActive = exact
      ? pathname === href
      : pathname?.startsWith(href.toString());

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          className,
          isActive && activeClassName,
          pendingClassName 
        )}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
