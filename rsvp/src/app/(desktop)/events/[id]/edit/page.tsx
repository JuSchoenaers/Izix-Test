'use client';

import {
    Button,
    Container,
    Divider,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { updateEventAction } from "../../actions";
import { useEffect, useState } from "react";
import type { Event } from "@/lib/server/eventsStore";

export default function EditEventPage() {
    const router = useRouter();
    const params = useParams();
    const eventId = Number(params.id);
    
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetch(`/api/internal/events/${eventId}`)
            .then(res => res.json())
            .then(data => {
                setEvent(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [eventId]);

    const close = () => router.back();

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Typography>Loading...</Typography>
            </Container>
        );
    }
    
    if (!event) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Typography>Event not found</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                    Edit event
                </Typography>
                
                <Stack component="form" action={updateEventAction} spacing={2}>
                    <input type="hidden" name="id" value={event.id} />
                    
                    <Divider />
                    <Typography variant="caption" color="text.secondary">
                        Event information
                    </Typography>
                    
                    <TextField 
                        name="name" 
                        label="Name" 
                        defaultValue={event.name}
                        required 
                    />
                    <TextField 
                        name="startsAtISO" 
                        label="Date" 
                        type="datetime-local"
                        defaultValue={event.startsAtISO.slice(0, 16)}
                        required 
                    />
                    <TextField 
                        name="location" 
                        label="Location" 
                        defaultValue={event.location}
                        required 
                    />
                    
                    <Divider />
                    <Typography variant="caption" color="text.secondary">
                        Guest Parking
                    </Typography>
                    
                    <TextField 
                        name="parkingCapacity" 
                        label="Parking spots to reserve" 
                        type="number" 
                        defaultValue={event.parkingCapacity}
                        slotProps={{ htmlInput: { min: 1 } }}
                        helperText="Spots will be held for guests and released if unused upon start of the event"
                        required 
                    />
                    
                    <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ pt: 2 }}>
                        <Button onClick={close} variant="outlined" type="button">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained">
                            Save changes
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    );
}
