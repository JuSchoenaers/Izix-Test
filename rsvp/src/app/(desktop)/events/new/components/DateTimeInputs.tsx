import { Stack, TextField } from "@mui/material";

type DateTimeInputsProps = Readonly<{
    dateName: string;
    timeName: string;
    endTimeName?: string;
    dateLabel?: string;
    timeLabel?: string;
    endTimeLabel?: string;
    dateValue?: string;
    timeValue?: string;
    endTimeValue?: string;
    showEndTime?: boolean;
    minDate?: string;
}>;

export function DateTimeInputs({
    dateName,
    timeName,
    endTimeName,
    dateLabel = "Date",
    timeLabel = "Time",
    endTimeLabel = "End time",
    dateValue,
    timeValue,
    endTimeValue,
    showEndTime = false,
    minDate,
}: DateTimeInputsProps) {
    return (
        <Stack direction="row" spacing={2}>
            <TextField
                name={dateName}
                label={dateLabel}
                type="date"
                required
                defaultValue={dateValue ?? ""}
                slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: minDate ? { min: minDate } : undefined,
                }}
                sx={{ flex: 1 }}
            />
            <TextField
                name={timeName}
                label={timeLabel}
                type="time"
                required
                defaultValue={timeValue ?? ""}
                slotProps={{
                    inputLabel: { shrink: true },
                }}
                sx={{ flex: 1 }}
            />
            {showEndTime ? (
                <TextField
                    name={endTimeName}
                    label={endTimeLabel}
                    type="time"
                    required
                    defaultValue={endTimeValue ?? ""}
                    slotProps={{
                        inputLabel: { shrink: true },
                    }}
                    sx={{ flex: 1 }}
                />
            ) : null}
        </Stack>
    );
}
