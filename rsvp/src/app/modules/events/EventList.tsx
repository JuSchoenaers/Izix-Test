import { Box, Grid, Icon, IconButton, Stack, Typography } from "@mui/material";
import { EventCalendarClient } from "@/app/modules/events/EventCalendarClient";
import { listEvents } from "@/lib/server/eventsStore";
import { unstable_noStore as noStore } from "next/cache";
import { EventCardSkeleton } from "@/app/modules/events/components/EventCardSkeleton";
import { getEventListDisplayMonths } from "@/app/modules/events/utils/eventListUtils";

export async function EventList() {
    noStore();
    const events = await listEvents();
    
    return <EventCalendarClient events={events} />;
}

const columnTitleSx = { textAlign: "center" };

export function EventListSkeleton() {
    const displayMonths = getEventListDisplayMonths();
    
    return (
        <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton aria-label="Previous month" disabled>
                    <Icon className="material-icons">chevron_left</Icon>
                </IconButton>
                <Grid container spacing={2} sx={{ flex: 1 }}>
                    {displayMonths.map((month, index) => (
                        <Grid key={month.key} size={index === 1 ? 4 : 3}>
                            <Typography sx={columnTitleSx} variant={month.isCurrent ? "h4" : "h6"}>
                                {month.label}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
                <IconButton aria-label="Next month" disabled>
                    <Icon className="material-icons">chevron_right</Icon>
                </IconButton>
            </Box>
            <Grid container spacing={2}>
                {displayMonths.map((month, index) => (
                    <Grid key={month.key} size={index === 1 ? 4 : 3}>
                        <Stack sx={{ mt: 1 }} spacing={2}>
                            <EventCardSkeleton />
                            {index === 1 && <EventCardSkeleton />}
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}

