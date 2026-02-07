'use client';

import { Button, Icon } from "@mui/material";

export function SendReminderButton() {
    const handleSendReminder = () => {
        alert("Reminder functionality would send emails to guests who haven't responded yet.");
    };

    return (
        <Button
            variant="outlined"
            size="small"
            startIcon={<Icon className="material-icons">schedule</Icon>}
            onClick={handleSendReminder}
            sx={{
                color: "primary.main",
                borderColor: "primary.main",
            }}
        >
            Send reminder
        </Button>
    );
}
