'use client';

import { Button, Card, CardContent, Icon, Stack, Typography } from "@mui/material";
import type { Event } from "@/lib/server/eventsStore";

type RSVPProgressCardProps = Readonly<{
    event: Event;
    onSendReminder?: () => void;
}>;

export function RSVPProgressCard({ event, onSendReminder }: RSVPProgressCardProps) {
    const invited = event.invited;
    const rsvpReceived = event.rsvpReceived;
    const needParking = event.parkingClaimed;
    
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: { xs: 1.5, md: 2 } }}>
                    RSVP progress
                </Typography>
                
                <Stack spacing={1} sx={{ mb: { xs: 1.5, md: 2 } }}>
                    <Typography variant="body2">
                        Invited - <strong>{invited}</strong>
                    </Typography>
                    <Typography variant="body2">
                        RSVP Received - <strong>{rsvpReceived}</strong>
                    </Typography>
                    <Typography variant="body2">
                        Claimed - <strong>{needParking}</strong>
                    </Typography>
                </Stack>
                
                <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: { xs: 1.5, md: 2 } }}
                >
                    Some guests may respond closer to the event date
                </Typography>
                
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Icon className="material-icons">schedule</Icon>}
                    onClick={onSendReminder}
                    sx={{ 
                        color: 'primary.main',
                        borderColor: 'primary.main',
                        width: { xs: "100%", sm: "auto" },
                    }}
                    fullWidth
                >
                    Send reminder
                </Button>
            </CardContent>
        </Card>
    );
}
