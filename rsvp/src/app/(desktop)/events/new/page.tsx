'use client';

import {
    Button,
    Container,
    Divider,
    Icon,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { useRouter } from "next/navigation";
import { createEventAction } from "../actions";
import { DateTimeInputs } from "./components/DateTimeInputs";

export default function NewEventPage() {
    const router = useRouter();

    const close = () => router.replace("/events");

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                    Create event
                </Typography>
                
                <Stack component="form" action={createEventAction} spacing={2}>
                    <Divider />
                    <Typography variant="caption" color="text.secondary">
                        Basic information
                    </Typography>
                    
                    <TextField 
                        name="name" 
                        label="Event name" 
                        placeholder="Event name"
                        required 
                    />
                    
                    <DateTimeInputs
                        dateName="eventDate"
                        timeName="eventTime"
                        minDate={new Date().toISOString().split("T")[0]}
                    />
                    
                    <input type="hidden" name="startsAtISO" id="startsAtISO" />
                    
                    <TextField 
                        name="location" 
                        label="Event location" 
                        placeholder="Address"
                        required 
                    />
                    
                    <Divider />
                    <Typography variant="caption" color="text.secondary">
                        Guest parking
                    </Typography>
                    
                    <TextField 
                        name="parkingCapacity" 
                        label="Parking spots to reserve" 
                        type="number" 
                        defaultValue={10}
                        slotProps={{ htmlInput: { min: 1 } }}
                        helperText="Spots will be held for guests and released if unused"
                        required 
                    />
                    
                    <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ pt: 2 }}>
                        <Button 
                            onClick={close} 
                            variant="outlined" 
                            type="button"
                            startIcon={<Icon className="material-icons">close</Icon>}
                        >
                            Back
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained"
                            startIcon={<Icon className="material-icons">check</Icon>}
                            onClick={(e) => {
                                const form = e.currentTarget.closest('form');
                                if (form) {
                                    const dateInput = form.querySelector<HTMLInputElement>('[name="eventDate"]');
                                    const timeInput = form.querySelector<HTMLInputElement>('[name="eventTime"]');
                                    const isoInput = form.querySelector<HTMLInputElement>('[name="startsAtISO"]');
                                    
                                    if (dateInput && timeInput && isoInput && dateInput.value && timeInput.value) {
                                        const dateTime = new Date(`${dateInput.value}T${timeInput.value}`);
                                        isoInput.value = dateTime.toISOString();
                                    }
                                }
                            }}
                        >
                            Continue
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    );
}
