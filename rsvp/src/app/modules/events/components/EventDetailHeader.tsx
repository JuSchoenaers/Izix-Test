import {
    AppBar,
    Box,
    Button,
    Chip,
    Icon,
    Stack,
    Toolbar,
} from "@mui/material";

type EventDetailHeaderProps = Readonly<{
    inviteOnly: boolean;
    rsvpRequired: boolean;
    onBack: () => void;
    onEdit: () => void;
    onShare: () => void;
    showEdit: boolean;
}>;

export function EventDetailHeader({
    inviteOnly,
    rsvpRequired,
    onBack,
    onEdit,
    onShare,
    showEdit,
}: EventDetailHeaderProps) {
    return (
        <AppBar position="static">
            <Toolbar
                sx={{
                    gap: 2,
                    position: "relative",
                    flexWrap: { xs: "wrap", md: "nowrap" },
                    alignItems: { xs: "flex-start", md: "center" },
                    minHeight: { md: 72 },
                }}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ flex: { md: 1 }, minWidth: 0, width: { xs: "100%", md: "auto" }, order: 1 }}
                >
                    <Button
                        variant="outlined"
                        onClick={onBack}
                        startIcon={<Icon className="material-icons">arrow_back</Icon>}
                    >
                        Back
                    </Button>
                </Stack>

                <Box
                    sx={{
                        position: { xs: "static", md: "absolute" },
                        left: { md: "50%" },
                        transform: { md: "translateX(-50%)" },
                        display: "flex",
                        justifyContent: { xs: "flex-start", md: "center" },
                        width: { xs: "100%", md: "auto" },
                        order: 2,
                    }}
                >
                    {inviteOnly && (
                        <Chip
                            size="small"
                            variant="outlined"
                            sx={{ color: "text.secondary", borderColor: "divider" }}
                            label={`Invite only${rsvpRequired ? " - RSVP Required" : ""}`}
                        />
                    )}
                </Box>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    sx={{ flex: { md: 1 }, justifyContent: { md: "flex-end" }, width: { xs: "100%", md: "auto" }, order: 3 }}
                >
                    {showEdit ? (
                        <Button
                            variant="outlined"
                            onClick={onEdit}
                            startIcon={<Icon className="material-icons">edit</Icon>}
                            fullWidth
                            sx={{ width: { xs: "100%", sm: "auto" } }}
                        >
                            Edit event
                        </Button>
                    ) : null}
                    <Button
                        variant="contained"
                        onClick={onShare}
                        startIcon={<Icon className="material-icons">share</Icon>}
                        fullWidth
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                        Share RSVP link
                    </Button>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
