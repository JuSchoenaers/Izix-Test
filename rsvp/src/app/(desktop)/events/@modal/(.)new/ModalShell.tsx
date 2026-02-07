'use client';

import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

type ModalShellProps = Readonly<{
    title: string;
    children: ReactNode;
    closeTo?: string;
    onClose?: () => void;
}>;

export function ModalShell({ title, children, closeTo = "/events", onClose }: ModalShellProps) {
    const router = useRouter();

    const close = () => {
        if (onClose) {
            onClose();
            return;
        }
        router.replace(closeTo);
    };

    return (
        <Dialog open maxWidth="sm" onClose={close} fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
        </Dialog>
    );
}
