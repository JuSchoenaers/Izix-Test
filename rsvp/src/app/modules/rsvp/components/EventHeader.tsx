'use client';

import { Box, Divider, Link, Stack, Typography } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

type EventHeaderProps = Readonly<{
    eventName: string;
    eventDate: string;
    eventTime?: string;
    eventLocation: string;
}>;

export function EventHeader({ eventName, eventDate, eventTime, eventLocation }: EventHeaderProps) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventLocation)}`;
    const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(eventLocation)}&navigate=yes`;

    const handleLocationClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        if (!globalThis.window) {
            return;
        }
        globalThis.window.location.href = wazeUrl;
        globalThis.window.setTimeout(() => {
            globalThis.window.location.href = mapsUrl;
        }, 700);
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Typography 
                variant="h6" 
                component="h1"
                sx={{ 
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 0.75,
                }}
            >
                {eventName}
            </Typography>

            <Stack spacing={0.75} sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        {eventDate}
                    </Typography>
                </Stack>
                {eventTime ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                        <ScheduleOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            {eventTime}
                        </Typography>
                    </Stack>
                ) : null}
                <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Link
                        href={mapsUrl}
                        onClick={handleLocationClick}
                        underline="always"
                        sx={{
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            '&:hover': {
                                color: 'text.primary',
                            },
                        }}
                        aria-label={`Open map for ${eventLocation}`}
                    >
                        {eventLocation}
                    </Link>
                </Stack>
            </Stack>

            <Divider />
        </Box>
    );
}
