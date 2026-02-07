'use client';

import { Button, Icon } from "@mui/material";

export function ShareRsvpButton({ eventId }: Readonly<{ eventId: number }>) {
    const handleShareRSVP = async () => {
        const email = prompt("Enter guest email for a unique RSVP link:");
        if (!email) {
            return;
        }
        const response = await fetch("/api/public/rsvp/generate-link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eventId,
                email: email.trim(),
            }),
        });
        if (!response.ok) {
            alert("Unable to generate RSVP link.");
            return;
        }
        const data = await response.json();
        const origin = globalThis.location?.origin ?? "";
        const rsvpUrl = data.link ?? new URL(`/rsvp/${eventId}`, origin || "http://localhost").toString();

        try {
            if (navigator.share) {
                await navigator.share({
                    title: "RSVP",
                    url: rsvpUrl,
                });
                return;
            }

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(rsvpUrl);
                alert("RSVP link copied to clipboard!");
                return;
            }

            prompt("Copy this RSVP link:", rsvpUrl);
        } catch {
            prompt("Copy this RSVP link:", rsvpUrl);
        }
    };

    return (
        <Button
            variant="contained"
            onClick={handleShareRSVP}
            startIcon={<Icon className="material-icons">share</Icon>}
        >
            Share RSVP link
        </Button>
    );
}
