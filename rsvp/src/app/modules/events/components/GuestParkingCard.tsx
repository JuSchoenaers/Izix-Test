'use client';

import { Box, Card, CardContent, Icon, IconButton, LinearProgress, Stack, Typography } from "@mui/material";
import type { Event } from "@/lib/server/eventsStore";
import { StatBox } from "@/components/ui/StatBox";

type GuestParkingCardProps = Readonly<{
    event: Event;
    onBack?: () => void;
}>;

export function GuestParkingCard({ event, onBack }: GuestParkingCardProps) {
    const reserved = event.parkingCapacity;
    const claimed = event.parkingClaimed;
    const remaining = Math.max(0, reserved - claimed);
    
    const progressPercent = reserved > 0 ? (claimed / reserved) * 100 : 0;
    
    return (
        <Card>
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: { xs: 2, md: 3 } }}>
                    {onBack && (
                        <IconButton onClick={onBack} aria-label="Back to events">
                            <Icon className="material-icons">arrow_back</Icon>
                        </IconButton>
                    )}
                    <Typography variant="h6" fontWeight={700}>
                        Attendance parking
                    </Typography>
                </Stack>
                
                <Stack 
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2} 
                    alignItems={{ xs: "stretch", sm: "center" }}
                    justifyContent={{ sm: "center" }}
                    sx={{ mb: { xs: 2, md: 3 } }}
                >
                    <StatBox label="Claimed" value={`${claimed} / ${reserved}`} />
                    <StatBox label="Remaining" value={remaining} />
                </Stack>
                
                <Box sx={{ mb: 2 }}>
                    <LinearProgress 
                        variant="determinate" 
                        value={progressPercent}
                        sx={{ height: 10, borderRadius: 5 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                            {claimed}/{reserved}
                        </Typography>
                    </Box>
                </Box>
                
                <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    textAlign="center"
                >
                    Spots are held for guests and released if unused.
                </Typography>
            </CardContent>
        </Card>
    );
}
