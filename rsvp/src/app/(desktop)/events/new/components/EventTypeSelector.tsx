import { FormControl, FormLabel, Radio, RadioGroup, Stack, Typography } from "@mui/material";

type EventTypeSelectorProps = Readonly<{
    value: "Public" | "Private";
    onChange: (value: "Public" | "Private") => void;
}>;

export function EventTypeSelector({ value, onChange }: EventTypeSelectorProps) {
    return (
        <FormControl>
            <FormLabel sx={{ mb: 1 }}>Event visibility</FormLabel>
            <RadioGroup
                value={value}
                onChange={(event) => onChange(event.target.value as "Public" | "Private")}
            >
                <Stack direction="row" spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Radio value="Private" />
                        <Typography>Private</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Radio value="Public" />
                        <Typography>Public</Typography>
                    </Stack>
                </Stack>
            </RadioGroup>
        </FormControl>
    );
}
