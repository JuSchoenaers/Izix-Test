import { Autocomplete, TextField } from "@mui/material";

type PublicEmailsInputProps = Readonly<{
    values: string[];
    onChange: (values: string[]) => void;
}>;

export function PublicEmailsInput({ values, onChange }: PublicEmailsInputProps) {
    return (
        <Autocomplete
            multiple
            freeSolo
            options={[] as string[]}
            value={values}
            onChange={(_, newValue) => onChange(newValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Public invite emails"
                    placeholder="Add email and press enter"
                />
            )}
        />
    );
}
