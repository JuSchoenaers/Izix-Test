'use client';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Icon,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { createEventAction } from "../../actions";
import { useEffect, useMemo, useState } from "react";
import rsvpLists from "@/../data/seed/rsvpLists.json";
import { DateTimeInputs } from "../../new/components/DateTimeInputs";
import { EventTypeSelector } from "../../new/components/EventTypeSelector";
import { PublicEmailsInput } from "../../new/components/PublicEmailsInput";
import { RsvpListSelector } from "../../new/components/RsvpListSelector";

type RsvpList = {
    name: string;
    count: number;
    emails?: string[];
};

export default function NewEventModal() {
    const router = useRouter();
    const pathname = usePathname();
    const [eventType, setEventType] = useState<"Private" | "Public">("Private");
    const [parkingCapacity, setParkingCapacity] = useState(10);
    const [publicEmails, setPublicEmails] = useState<string[]>([]);
    const [selectedListNames, setSelectedListNames] = useState<string[]>([]);

    const mailingLists = useMemo(() => rsvpLists as RsvpList[], []);

    useEffect(() => {
        if (eventType === "Private" && publicEmails.length > 0) {
            setPublicEmails([]);
        }
        if (eventType === "Public" && selectedListNames.length > 0) {
            setSelectedListNames([]);
        }
    }, [eventType, publicEmails.length, selectedListNames.length]);

    const close = () => router.replace("/events");

    if (pathname !== "/events/new") {
        return null;
    }

    return (
        <Dialog open maxWidth="sm" onClose={close} fullWidth>
            <DialogTitle>Create event</DialogTitle>
            <DialogContent>
                <Stack component="form" action={createEventAction} spacing={2}>
                    <Divider />
                    <Typography variant="caption" color="text.secondary">
                        Event information
                    </Typography>
                    
                    <TextField 
                        name="name" 
                        label="Name" 
                        placeholder="Name"
                        required 
                    />
                    
                    <DateTimeInputs
                        dateName="eventDate"
                        timeName="eventTime"
                        endTimeName="eventEndTime"
                        showEndTime
                        minDate={new Date().toISOString().split("T")[0]}
                    />
                    
                    <input type="hidden" name="startsAtISO" id="startsAtISO" />
                    <input type="hidden" name="endsAtISO" id="endsAtISO" />
                    <input
                        type="hidden"
                        name="rsvpListNames"
                        value={eventType === "Private" ? selectedListNames.join(",") : ""}
                    />
                    <input type="hidden" name="eventType" value={eventType} />
                    <input
                        type="hidden"
                        name="publicInviteEmails"
                        value={publicEmails.join(",")}
                    />
                    
                    <TextField 
                        name="location" 
                        label="Location" 
                        placeholder="Address"
                        required 
                    />

                    <EventTypeSelector value={eventType} onChange={setEventType} />

                    <RsvpListSelector
                        lists={mailingLists}
                        selected={selectedListNames}
                        onChange={setSelectedListNames}
                        disabled={eventType !== "Private"}
                    />

                    {eventType === "Public" ? (
                        <PublicEmailsInput values={publicEmails} onChange={setPublicEmails} />
                    ) : null}
                    
                    <Divider />
                    <Typography variant="caption" color="text.secondary">
                        Attendance parking
                    </Typography>
                    
                    <TextField 
                        name="parkingCapacity" 
                        label="Parking spots to reserve" 
                        type="number" 
                        value={parkingCapacity}
                        onChange={(event) => setParkingCapacity(Number(event.target.value))}
                        slotProps={{ htmlInput: { min: 1 } }}
                        helperText="Spots will be held for guests and released if unused upon start of the event"
                        required 
                    />
                    
                    <DialogActions sx={{ px: 0 }}>
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
                                    const endTimeInput = form.querySelector<HTMLInputElement>('[name="eventEndTime"]');
                                    const endIsoInput = form.querySelector<HTMLInputElement>('[name="endsAtISO"]');
                                    
                                    if (dateInput && timeInput && isoInput && dateInput.value && timeInput.value) {
                                        const dateTime = new Date(`${dateInput.value}T${timeInput.value}`);
                                        isoInput.value = dateTime.toISOString();
                                    }
                                    if (dateInput && endTimeInput && endIsoInput && dateInput.value && endTimeInput.value) {
                                        const endDateTime = new Date(`${dateInput.value}T${endTimeInput.value}`);
                                        endIsoInput.value = endDateTime.toISOString();
                                    }
                                }
                            }}
                        >
                            Continue
                        </Button>
                    </DialogActions>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
