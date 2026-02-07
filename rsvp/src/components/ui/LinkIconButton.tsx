'use client';

import { IconButton, type IconButtonProps } from "@mui/material";
import Link from "next/link";

export type LinkIconButtonProps = Omit<IconButtonProps, "component" | "href"> & {
    href: string;
    scroll?: boolean;
};

export function LinkIconButton({ href, scroll, ...props }: LinkIconButtonProps) {
    return <IconButton component={Link} href={href} scroll={scroll} {...props} />;
}
