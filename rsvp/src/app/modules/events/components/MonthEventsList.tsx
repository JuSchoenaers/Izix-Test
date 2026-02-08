import { Box, Card, Icon, IconButton, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import type { Event } from "@/lib/server/eventsStore";
import { getEventStatusForEvent } from "@/lib/utils/dateUtils";
import { EVENT_LIFECYCLE_STATUS } from "@/lib/types/events";
import { EventCard } from "./EventCard";
import { CollapsibleEventCard } from "./CollapsibleEventCard";
import { getStatusBadgeColor } from "./getStatusBadgeColor";

type MonthEventsListProps = Readonly<{
    monthEvents: Event[];
    fitThreeRows: boolean;
    fitTwoRows: boolean;
    expandedOverrides: Map<number, boolean>;
    defaultExpandedIds: Set<number>;
    onToggleExpanded: (id: number, currentExpanded: boolean) => void;
}>;

export function MonthEventsList({
    monthEvents,
    fitThreeRows,
    fitTwoRows,
    expandedOverrides,
    defaultExpandedIds,
    onToggleExpanded,
}: MonthEventsListProps) {
    if (fitThreeRows) {
        return (
            <Stack spacing={1} sx={{ alignItems: "stretch", width: "100%", px: { xs: 2, md: 2 } }}>
                {monthEvents.map((event) => {
                    const status = getEventStatusForEvent(event);
                    const isUpcoming = status === "upcoming";
                    const canOpen = status !== "complete" && status !== EVENT_LIFECYCLE_STATUS.cancelled;
                    const isDisabled = status === "complete" || status === EVENT_LIFECYCLE_STATUS.cancelled;

                    return (
                        <Card
                            key={event.id}
                            variant="outlined"
                            sx={{
                                px: 1,
                                py: 0.75,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                                opacity: isDisabled ? 0.5 : 1,
                            }}
                        >
                            <Box sx={{ minWidth: 0 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: 999,
                                            backgroundColor: getStatusBadgeColor(status),
                                        }}
                                    />
                                    <Typography variant="body2" fontWeight={600} noWrap>
                                        {event.name}
                                    </Typography>
                                </Stack>
                                <Typography variant="caption" color="text.secondary">
                                    {format(parseISO(event.startsAtISO), "dd/MM/yyyy")}
                                    {isUpcoming
                                        ? ` · ${event.parkingClaimed}/${event.parkingCapacity}`
                                        : ""}
                                </Typography>
                            </Box>
                            {canOpen ? (
                                <IconButton
                                    component={Link}
                                    href={`/events/${event.id}`}
                                    size="small"
                                    aria-label="Open event"
                                >
                                    <Icon className="material-icons" fontSize="inherit">
                                        open_in_new
                                    </Icon>
                                </IconButton>
                            ) : null}
                        </Card>
                    );
                })}
            </Stack>
        );
    }

    return (
        <Stack spacing={2} sx={{ alignItems: "center", width: "100%", px: { xs: 2, md: 2 } }}>
            {monthEvents.map((event) => {
                if (fitTwoRows) {
                    const expanded = expandedOverrides.get(event.id) ?? defaultExpandedIds.has(event.id);
                    return (
                        <CollapsibleEventCard
                            key={event.id}
                            event={event}
                            expanded={expanded}
                            onToggle={() => onToggleExpanded(event.id, expanded)}
                            fullWidth
                        />
                    );
                }
                return <EventCard key={event.id} event={event} fullWidth />;
            })}
        </Stack>
    );
}
