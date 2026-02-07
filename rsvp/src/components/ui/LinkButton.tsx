'use client';

import { Button, type ButtonProps } from "@mui/material";
import Link from "next/link";

export type LinkButtonProps = Omit<ButtonProps, "component" | "href"> & {
    href: string;
    scroll?: boolean;
};

export function LinkButton({ href, scroll, ...props }: LinkButtonProps) {
    return <Button component={Link} href={href} scroll={scroll} {...props} />;
}
