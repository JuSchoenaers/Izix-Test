'use client';

import {
    Autocomplete,
    Button,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import type { SyntheticEvent } from "react";
import { useMemo, useState, useEffect, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { updateEventActionNoRedirect } from "../../../actions";
import { ModalShell } from "../../(.)new/ModalShell";
import type { Event } from "@/lib/server/eventsStore";
import rsvpLists from "@/../data/seed/rsvpLists.json";

type RsvpList = {
    name: string;
    count: number;
    emails?: string[];
};

export default function EditEventModal() {
    const router = useRouter();
    const params = useParams();
    const eventId = Number(params.id);

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [eventType, setEventType] = useState<"Private" | "Public">("Private");
    const [publicEmails, setPublicEmails] = useState<string[]>([]);
    const [selectedListNames, setSelectedListNames] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const mailingLists = useMemo(() => rsvpLists as RsvpList[], []);
    const defaultListName = mailingLists[0]?.name ?? "";

    useEffect(() => {
        fetch(`/api/internal/events/${eventId}`)
            .then((res) => res.json())
            .then((data: Event) => {
                setEvent(data);
                setEventType(data.eventType ?? "Private");
                setPublicEmails(data.publicInviteEmails ?? []);
                setSelectedListNames(data.rsvpListNames ?? []);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [eventId]);

    useEffect(() => {
        if (eventType === "Private" && publicEmails.length > 0) {
            setPublicEmails([]);
        }
        if (eventType === "Public" && selectedListNames.length > 0) {
            setSelectedListNames([]);
        }
    }, [eventType, publicEmails.length, selectedListNames.length]);

    const close = () => router.back();

    if (loading) {
        return (
            <ModalShell title="Edit event" closeTo={`/events/${eventId}`} onClose={close}>
                <Typography sx={{ py: 2 }}>Loading...</Typography>
            </ModalShell>
        );
    }

    if (!event) {
        return (
            <ModalShell title="Edit event" closeTo={`/events/${eventId}`} onClose={close}>
                <Typography sx={{ py: 2 }}>Event not found</Typography>
            </ModalShell>
        );
    }

    const startsAt = parseISO(event.startsAtISO);
    const endsAt = parseISO(event.endsAtISO ?? event.startsAtISO);
    const eventDateValue = format(startsAt, "yyyy-MM-dd");
    const eventTimeValue = format(startsAt, "HH:mm");
    const eventEndTimeValue = format(endsAt, "HH:mm");
    const selectedListValue = selectedListNames.length
        ? selectedListNames.join(",")
        : defaultListName;
    const rsvpListNamesValue = eventType === "Private" ? selectedListValue : "";

    const handleSubmit = (formEvent: SyntheticEvent<HTMLFormElement>) => {
        formEvent.preventDefault();
        const form = formEvent.currentTarget;
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

        startTransition(async () => {
            await updateEventActionNoRedirect(new FormData(form));
            router.replace(`/events/${eventId}`, { scroll: false });
            router.refresh();
        });
    };

    return (
        <ModalShell title="Edit event" closeTo={`/events/${eventId}`} onClose={close}>
            <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ pt: 1 }}>
                <input type="hidden" name="id" value={event.id} />
                <input type="hidden" name="startsAtISO" value={`${eventDateValue}T${eventTimeValue}:00`} />
                <input type="hidden" name="endsAtISO" value={`${eventDateValue}T${eventEndTimeValue}:00`} />
                <input type="hidden" name="eventType" value={eventType} />
                <input type="hidden" name="rsvpListNames" value={rsvpListNamesValue} />
                <input type="hidden" name="publicInviteEmails" value={publicEmails.join(",")} />

                <Divider />
                <Typography variant="caption" color="text.secondary">
                    Basic information
                </Typography>

                <TextField name="name" label="Event name" defaultValue={event.name} required />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                        name="eventDate"
                        label="Event date"
                        type="date"
                        defaultValue={eventDateValue}
                        slotProps={{ inputLabel: { shrink: true } }}
                        fullWidth
                        required
                    />
                    <TextField
                        name="eventTime"
                        label="Event time"
                        type="time"
                        defaultValue={eventTimeValue}
                        slotProps={{ inputLabel: { shrink: true } }}
                        fullWidth
                        required
                    />
                    <TextField
                        name="eventEndTime"
                        label="End time"
                        type="time"
                        defaultValue={eventEndTimeValue}
                        slotProps={{ inputLabel: { shrink: true } }}
                        fullWidth
                        required
                    />
                </Stack>

                <TextField name="location" label="Location" defaultValue={event.location} required />

                <FormControl>
                    <FormLabel>Event type</FormLabel>
                    <RadioGroup
                        row
                        value={eventType}
                        onChange={(event) => setEventType(event.target.value as "Private" | "Public")}
                    >
                        <FormControlLabel value="Private" control={<Radio />} label="Private" />
                        <FormControlLabel value="Public" control={<Radio />} label="Public" />
                    </RadioGroup>
                </FormControl>

                <TextField
                    label="RSVP Mailing list"
                    select
                    value={selectedListNames}
                    onChange={(event) =>
                        setSelectedListNames(
                            typeof event.target.value === "string"
                                ? event.target.value.split(",")
                                : event.target.value
                        )
                    }
                    disabled={eventType !== "Private"}
                    slotProps={{
                        select: {
                            multiple: true,
                            displayEmpty: true,
                            renderValue: (value) => {
                                const selected = value as string[];
                                if (selected.length === 0) {
                                    return "Select RSVP list";
                                }
                                return selected.join(", ");
                            },
                        },
                        inputLabel: { shrink: true },
                    }}
                >
                    {mailingLists.map((list) => (
                        <MenuItem key={list.name} value={list.name}>
                            {list.name} - {list.count} members
                        </MenuItem>
                    ))}
                </TextField>

                {eventType === "Public" && (
                    <Autocomplete
                        multiple
                        freeSolo
                        value={publicEmails}
                        onChange={(_, value) => setPublicEmails(value)}
                        options={[]}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Invite emails"
                                placeholder="Add email addresses"
                            />
                        )}
                    />
                )}

                <Divider />
                <Typography variant="caption" color="text.secondary">
                    Attendance parking
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

                <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ pt: 1 }}>
                    <Button onClick={close} variant="outlined" type="button">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isPending}
                    >
                        {isPending ? "Saving..." : "Save changes"}
                    </Button>
                </Stack>
            </Stack>
        </ModalShell>
    );
}
