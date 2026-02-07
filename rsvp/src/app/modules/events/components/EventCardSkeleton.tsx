import { Skeleton, Stack } from "@mui/material";

export function EventCardSkeleton() {
    return (
        <Stack spacing={1} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <Skeleton variant="text" width="65%" height={28} />
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="rounded" height={28} width={90} />
        </Stack>
    );
}
