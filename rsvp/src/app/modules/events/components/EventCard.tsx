'use client';

import { Box, Card, CardActions, CardHeader, Chip, List, ListItem, Button, Typography } from "@mui/material";
import type { Event } from "@/lib/server/eventsStore";
import { formatEventDate, getEventStatusForEvent, getStatusLabel, getStatusColor } from "@/lib/utils/dateUtils";
import Link from "next/link";
import { EVENT_LIFECYCLE_STATUS } from "@/lib/types/events";

type EventCardProps = Readonly<{
    event: Event;
    fullWidth?: boolean;
}>;

export function EventCard({ event, fullWidth = false }: EventCardProps) {
    const status = getEventStatusForEvent(event);
    const statusLabel = getStatusLabel(status);
    const statusColor = getStatusColor(status);
    const formattedDate = formatEventDate(event.startsAtISO);
    const showParking = status === "upcoming";
    const showOpenButton = status !== EVENT_LIFECYCLE_STATUS.cancelled && status !== "complete";

    return (
        <Card
            sx={{
                width: fullWidth ? "100%" : { xs: "100%", sm: 320 },
                mx: fullWidth ? 0 : { xs: 0, sm: "auto" },
            }}
        >
            <CardHeader
                title={event.name}
                slotProps={{
                    title: {
                        variant: "h6",
                        sx: { wordBreak: "break-word", fontSize: { xs: "1rem", md: "1.25rem" } },
                    },
                }}
                action={
                    showParking ? (
                        <Box sx={{ textAlign: "right", minWidth: 80 }}>
                            <Typography variant="caption" color="text.secondary">
                                Claimed
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={700}>
                                {event.parkingClaimed}/{event.parkingCapacity}
                            </Typography>
                        </Box>
                    ) : null
                }
            />
            <List dense>
                <ListItem sx={{ py: 0.5 }}>
                    <Typography variant="body2">
                        Date - <strong>{formattedDate}</strong>
                    </Typography>
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                    <Typography variant="body2">
                        Location - {event.location}
                    </Typography>
                </ListItem>
               
            </List>
            <CardActions sx={{ px: 2, pb: 2, justifyContent: { xs: "space-between", sm: "space-between" } }}>
                <Chip
                    variant="outlined"
                    color={statusColor}
                    label={<Typography variant="caption">{statusLabel}</Typography>}
                    sx={{ borderRadius: "2px" }}
                />
                {showOpenButton ? (
                    <Button
                        component={Link}
                        href={`/events/${event.id}`}
                        variant="outlined"
                        size="small"
                        sx={{ width: { xs: "auto", sm: "auto" }, height: 32, px: 1.5, fontSize: "0.75rem" }}
                    >
                        Open
                    </Button>
                ) : null}
            </CardActions>
        </Card>
    );
}
