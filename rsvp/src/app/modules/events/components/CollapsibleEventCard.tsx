import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Collapse,
    Icon,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import Link from "next/link";
import type { Event } from "@/lib/server/eventsStore";
import { formatEventDate, getEventStatusForEvent, getStatusColor, getStatusLabel } from "@/lib/utils/dateUtils";
import { EVENT_LIFECYCLE_STATUS } from "@/lib/types/events";
import { getStatusBadgeColor } from "./getStatusBadgeColor";

type CollapsibleEventCardProps = Readonly<{
    event: Event;
    expanded: boolean;
    onToggle: () => void;
    fullWidth?: boolean;
}>;

export function CollapsibleEventCard({ event, expanded, onToggle, fullWidth = false }: CollapsibleEventCardProps) {
    const status = getEventStatusForEvent(event);
    const statusLabel = getStatusLabel(status);
    const statusColor = getStatusColor(status);
    const isUpcoming = status === "upcoming";
    const isCancelled = status === "cancelled";
    const canOpen = isCancelled === false && status !== "complete";
    const showBadge = expanded === false;
    const formattedDate = formatEventDate(event.startsAtISO);
    const isDisabled = status === "complete" || status === EVENT_LIFECYCLE_STATUS.cancelled;

    return (
        <Card
            variant="outlined"
            sx={{
                width: fullWidth ? "100%" : { xs: "100%", sm: 320 },
                mx: fullWidth ? 0 : { xs: 0, sm: "auto" },
                opacity: isDisabled ? 0.5 : 1,
            }}
        >
            <CardContent sx={{ pb: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            {showBadge ? (
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 999,
                                        backgroundColor: getStatusBadgeColor(status),
                                    }}
                                />
                            ) : null}
                            <Typography variant="subtitle1" fontWeight={700} noWrap>
                                {event.name}
                            </Typography>
                        </Stack>
                        {isUpcoming ? (
                            <Typography variant="caption" color="text.secondary">
                                Claimed {event.parkingClaimed}/{event.parkingCapacity}
                            </Typography>
                        ) : null}
                    </Box>
                    <IconButton size="small" onClick={onToggle} aria-label="Toggle details">
                        <Icon className="material-icons" fontSize="inherit">
                            {expanded ? "expand_less" : "expand_more"}
                        </Icon>
                    </IconButton>
                </Stack>
            </CardContent>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ pt: 0 }}>
                    <Stack spacing={1}>
                        <Typography variant="body2">
                            Date - <strong>{formattedDate}</strong>
                        </Typography>
                        <Typography variant="body2">Location - {event.location}</Typography>
                    </Stack>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between" }}>
                    <Chip
                        variant="outlined"
                        color={statusColor}
                        label={<Typography variant="caption">{statusLabel}</Typography>}
                        sx={{ borderRadius: "2px" }}
                    />
                    {canOpen ? (
                        <Button
                            component={Link}
                            href={`/events/${event.id}`}
                            variant="outlined"
                            size="small"
                            sx={{ height: 32, px: 1.5, fontSize: "0.75rem" }}
                        >
                            Open
                        </Button>
                    ) : null}
                </CardActions>
            </Collapse>
        </Card>
    );
}
