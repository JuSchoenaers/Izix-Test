'use client';

import { AppBar, Box, Button, Chip, Icon, Stack, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

export type TopBarCta = Readonly<{
    label: string;
    href: string;
    icon?: string;
    variant?: "contained" | "outlined" | "text";
    scroll?: boolean;
}>;

export type TopBarProps = Readonly<{
    title: string;
    subtitle?: string;
    pillText?: string;
    ctas?: TopBarCta[];
    showBack?: boolean;
    onBack?: () => void;
}>;

export function TopBar(props: TopBarProps) {
    const { title, subtitle, pillText, ctas, showBack, onBack } = props;
    return (
        <AppBar position="static">
            <Toolbar>
                {showBack && onBack && (
                    <Button
                        variant="outlined"
                        onClick={onBack}
                        startIcon={<Icon className="material-icons">arrow_back</Icon>}
                        sx={{ mr: 2 }}
                    >
                        Back
                    </Button>
                )}
                <Stack spacing={1} sx={{ flexGrow: 1, p: 2 }}>
                    <Typography variant="h4">{title}</Typography>
                    {subtitle && <Typography variant="body2">{subtitle}</Typography>}
                </Stack>
                {pillText && <Chip size="small" label={pillText} />}
                <Box
                    sx={{
                        display: "flex",
                        flexGrow: 1,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    {ctas?.map((cta) => (
                        <Button
                            key={`${cta.label}-${cta.href}`}
                            variant={cta.variant ?? "contained"}
                            component={Link}
                            href={cta.href}
                            scroll={cta.scroll ?? true}
                            startIcon={cta.icon ? <Icon className="material-icons">{cta.icon}</Icon> : undefined}
                        >
                            {cta.label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
