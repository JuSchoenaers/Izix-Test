import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";

type CancelReservationDialogProps = Readonly<{
    open: boolean;
    isCancelling: boolean;
    onClose: () => void;
    onConfirm: () => void;
}>;

export function CancelReservationDialog({
    open,
    isCancelling,
    onClose,
    onConfirm,
}: CancelReservationDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            slotProps={{
                backdrop: {
                    sx: {
                        backdropFilter: "blur(6px)",
                        backgroundColor: "rgba(15, 23, 42, 0.2)",
                    },
                },
            }}
        >
            <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>
                Confirm cancellation?
            </DialogTitle>
            <DialogContent>
                <Stack spacing={1.5} sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Your parking spot will be released.
                    </Typography>
                    <Stack direction="row" spacing={1.5} justifyContent="center">
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            disabled={isCancelling}
                            sx={{ minWidth: 110 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={onConfirm}
                            disabled={isCancelling}
                            sx={{ minWidth: 110 }}
                        >
                            {isCancelling ? (
                                <CircularProgress size={18} color="inherit" />
                            ) : (
                                "Confirm"
                            )}
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
