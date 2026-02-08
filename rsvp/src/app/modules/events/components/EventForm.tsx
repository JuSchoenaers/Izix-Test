import { Button, Divider, Icon, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { format } from "date-fns";

export type EventFormDefaults = {
    id?: number;
    name?: string;
    eventDate?: string;
    eventTime?: string;
    location?: string;
    parkingCapacity?: number;
};

export type EventFormProps = Readonly<{
    action: (formData: FormData) => void;
    defaults?: EventFormDefaults;
    submitLabel: string;
    cancelHref: string;
    cancelLabel?: string;
    submitIcon?: string;
    cancelIcon?: string;
    minDate?: string;
}>;

export function EventForm({
    action,
    defaults,
    submitLabel,
    cancelHref,
    cancelLabel = "Back",
    submitIcon = "check",
    cancelIcon = "close",
    minDate,
}: EventFormProps) {
    const dateMinValue = minDate ?? format(new Date(), "yyyy-MM-dd");

    return (
        <Stack component="form" action={action} spacing={2}>
            {defaults?.id !== undefined && (
                <input type="hidden" name="id" value={defaults.id} />
            )}

            <Divider />
            <Typography variant="caption" color="text.secondary">
                Event information
            </Typography>

            <TextField
                name="name"
                label="Name"
                placeholder="Name"
                defaultValue={defaults?.name ?? ""}
                required
            />

            <Stack direction="row" spacing={2}>
                <TextField
                    name="eventDate"
                    label="Date"
                    type="date"
                    required
                    defaultValue={defaults?.eventDate ?? ""}
                    slotProps={{
                        inputLabel: { shrink: true },
                        htmlInput: { min: dateMinValue },
                    }}
                    sx={{ flex: 1 }}
                />
                <TextField
                    name="eventTime"
                    label="Time"
                    type="time"
                    required
                    defaultValue={defaults?.eventTime ?? ""}
                    slotProps={{
                        inputLabel: { shrink: true },
                    }}
                    sx={{ flex: 1 }}
                />
            </Stack>

            <TextField
                name="location"
                label="Location"
                placeholder="Address"
                defaultValue={defaults?.location ?? ""}
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
                defaultValue={defaults?.parkingCapacity ?? 10}
                slotProps={{ htmlInput: { min: 1 } }}
                helperText="Spots will be held for guests and released if unused upon start of the event"
                required
            />

            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ pt: 2 }}>
                <Button
                    component={Link}
                    href={cancelHref}
                    variant="outlined"
                    type="button"
                    startIcon={cancelIcon ? <Icon className="material-icons">{cancelIcon}</Icon> : undefined}
                >
                    {cancelLabel}
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    startIcon={submitIcon ? <Icon className="material-icons">{submitIcon}</Icon> : undefined}
                >
                    {submitLabel}
                </Button>
            </Stack>
        </Stack>
    );
}
