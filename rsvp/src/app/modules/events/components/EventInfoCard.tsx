import { Card, CardContent, Icon, List, ListItem, Stack, Typography } from "@mui/material";

type EventInfoCardProps = Readonly<{
    eventName: string;
    eventDate: string;
    eventStartTime: string;
    eventEndTime: string | null;
    eventLocation: string;
    invitedCount: number;
}>;

export function EventInfoCard({
    eventName,
    eventDate,
    eventStartTime,
    eventEndTime,
    eventLocation,
    invitedCount,
}: EventInfoCardProps) {
    return (
        <Card sx={{ flex: 1, height: "100%" }}>
            <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    {eventName}
                </Typography>
                <List>
                    <ListItem sx={{ px: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Icon className="material-icons" fontSize="small">event</Icon>
                            <Typography variant="body2">{eventDate}</Typography>
                        </Stack>
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Icon className="material-icons" fontSize="small">location_on</Icon>
                            <Typography variant="body2">{eventLocation}</Typography>
                        </Stack>
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Icon className="material-icons" fontSize="small">schedule</Icon>
                            <Typography variant="body2">
                                {eventStartTime}
                                {eventEndTime ? ` - ${eventEndTime}` : ""}
                            </Typography>
                        </Stack>
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Icon className="material-icons" fontSize="small">group</Icon>
                            <Typography variant="body2">
                                Attendees invited - {invitedCount}
                            </Typography>
                        </Stack>
                    </ListItem>
                </List>
            </CardContent>
        </Card>
    );
}
