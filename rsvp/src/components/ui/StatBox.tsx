import { Box, Typography } from "@mui/material";

type StatBoxProps = Readonly<{
    label: string;
    value: number | string;
    highlighted?: boolean;
}>;

export function StatBox({ label, value, highlighted = false }: StatBoxProps) {
    return (
        <Box
            sx={{
                border: "1px solid",
                borderColor: highlighted ? "primary.main" : "divider",
                borderRadius: 2,
                p: 2,
                minWidth: { xs: "100%", sm: 100 },
                width: { xs: "100%", sm: "auto" },
                textAlign: "center",
                backgroundColor: highlighted ? "rgba(53, 238, 203, 0.1)" : "transparent",
            }}
        >
            <Typography
                variant="body2"
                color={highlighted ? "primary.main" : "text.secondary"}
            >
                {label}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
                {value}
            </Typography>
        </Box>
    );
}
