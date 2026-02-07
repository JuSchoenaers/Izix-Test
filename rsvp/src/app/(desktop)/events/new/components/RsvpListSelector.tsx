import { MenuItem, TextField } from "@mui/material";

type MailingList = Readonly<{
    name: string;
    count: number;
}>;

type RsvpListSelectorProps = Readonly<{
    lists: MailingList[];
    selected: string[];
    onChange: (selected: string[]) => void;
    disabled?: boolean;
}>;

export function RsvpListSelector({
    lists,
    selected,
    onChange,
    disabled = false,
}: RsvpListSelectorProps) {
    return (
        <TextField
            select
            label="RSVP list"
            name="rsvpListNames"
            fullWidth
            value={selected}
            onChange={(event) => {
                const value = event.target.value;
                onChange(Array.isArray(value) ? value : [value]);
            }}
            disabled={disabled}
            slotProps={{
                select: {
                    multiple: true,
                    displayEmpty: true,
                    renderValue: (value) => {
                        const selectedValue = value as string[];
                        if (selectedValue.length === 0) {
                            return "Select RSVP list";
                        }
                        return selectedValue.join(", ");
                    },
                },
                inputLabel: { shrink: true },
            }}
        >
            {lists.map((list) => (
                <MenuItem key={list.name} value={list.name}>
                    {list.name} ({list.count})
                </MenuItem>
            ))}
        </TextField>
    );
}
