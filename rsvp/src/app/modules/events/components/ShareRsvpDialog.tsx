import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

type ShareRsvpDialogProps = Readonly<{
    open: boolean;
    onClose: () => void;
    selectedEmails: string[];
    tokenLinks: string[];
    sending: boolean;
    onSendInvites: () => void;
}>;

export function ShareRsvpDialog({
    open,
    onClose,
    selectedEmails,
    tokenLinks,
    sending,
    onSendInvites,
}: ShareRsvpDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Share RSVP link</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Emails tied to this event
                    </Typography>
                    {selectedEmails.length === 0 ? (
                        <Typography variant="body2">No emails configured.</Typography>
                    ) : (
                        <List dense sx={{ maxHeight: 240, overflow: "auto", border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                            {selectedEmails.map((email) => (
                                <ListItem key={email} sx={{ px: 2 }}>
                                    <Typography variant="body2">{email}</Typography>
                                </ListItem>
                            ))}
                        </List>
                    )}
                    <TextField
                        label="Generated RSVP links"
                        value={tokenLinks.join("\n")}
                        slotProps={{ htmlInput: { readOnly: true } }}
                        multiline
                        minRows={4}
                        placeholder="Click Send invites to generate links."
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    Close
                </Button>
                <Button
                    variant="contained"
                    onClick={onSendInvites}
                    disabled={sending || selectedEmails.length === 0}
                >
                    Send invites
                </Button>
            </DialogActions>
        </Dialog>
    );
}
