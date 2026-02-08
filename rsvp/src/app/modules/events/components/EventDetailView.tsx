'use client';

import {
    Alert,
    Box,
    Container,
    Snackbar,
    Stack,
} from "@mui/material";
import type { Event } from "@/lib/server/eventsStore";
import { formatEventDateLong } from "@/lib/utils/dateUtils";
import { GuestParkingCard } from "@/app/modules/events/components/GuestParkingCard";
import { RSVPProgressCard } from "@/app/modules/events/components/RSVPProgressCard";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import rsvpLists from "@/../data/seed/rsvpLists.json";
import { EventDetailHeader } from "./EventDetailHeader";
import { EventInfoCard } from "./EventInfoCard";
import { ShareRsvpDialog } from "./ShareRsvpDialog";

type RsvpList = {
    name: string;
    count: number;
    emails: string[];
};

type EventDetailViewProps = Readonly<{
    event: Event;
}>;

export function EventDetailView({ event }: EventDetailViewProps) {
    const router = useRouter();
    const formattedDate = formatEventDateLong(event.startsAtISO);
    const formattedStartTime = format(parseISO(event.startsAtISO), "HH:mm");
    const formattedEndTime = event.endsAtISO
        ? format(parseISO(event.endsAtISO), "HH:mm")
        : null;
    const mailingLists = useMemo(() => rsvpLists as RsvpList[], []);
    const [shareOpen, setShareOpen] = useState(false);
    const [sending, setSending] = useState(false);
    const [snackbar, setSnackbar] = useState<{ message: string; severity: "success" | "error" } | null>(null);
    const [tokenLinks, setTokenLinks] = useState<string[]>([]);
    const [origin, setOrigin] = useState("");
    const rsvpUrl = origin ? `${origin}/rsvp/${event.id}` : `/rsvp/${event.id}`;
    const selectedEmails = useMemo(() => {
        if (event.eventType === "Public") {
            return event.publicInviteEmails ?? [];
        }
        const selectedLists = event.rsvpListNames ?? [];
        const emails = mailingLists
            .filter((list) => selectedLists.includes(list.name))
            .flatMap((list) => list.emails);
        return Array.from(new Set(emails));
    }, [event.eventType, event.publicInviteEmails, event.rsvpListNames, mailingLists]);

    useEffect(() => {
        setOrigin(globalThis.location?.origin ?? "");
    }, []);

    const handleShareRSVP = async () => {
        setTokenLinks([]);
        setShareOpen(true);
    };
    const handleCloseShare = () => setShareOpen(false);

    const generateRsvpLinks = async (emails: string[]) => {
        const results = await Promise.allSettled(
            emails.map(async (email) => {
                const response = await fetch("/api/public/rsvp/generate-link", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        eventId: event.id,
                        email,
                        rsvpUrl,
                    }),
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Failed to generate link");
                }
                const data = await response.json();
                return data.link as string;
            })
        );
        const links = results
            .filter((result): result is PromiseFulfilledResult<string> => result.status === "fulfilled")
            .map((result) => result.value)
            .filter(Boolean);
        const failures = results.length - links.length;
        return { links, failures };
    };

    const copyLinksToClipboard = async (links: string[]) => {
        if (!navigator.clipboard?.writeText) {
            return false;
        }
        await navigator.clipboard.writeText(links.join("\n"));
        return true;
    };

    const getInviteSnackbar = (linksCount: number, failures: number, copied: boolean) => {
        if (copied) {
            return {
                message: failures
                    ? `Copied ${linksCount} links. ${failures} failed.`
                    : "RSVP links copied to clipboard",
                severity: failures ? "error" as const : "success" as const,
            };
        }
        return {
            message: failures
                ? `Generated ${linksCount} links. ${failures} failed. Copy manually below.`
                : "Links generated. Copy manually below.",
            severity: failures ? "error" as const : "success" as const,
        };
    };

    const handleSendInvites = async () => {
        const emails = selectedEmails.map((email) => email.trim()).filter(Boolean);
        if (emails.length === 0) {
            setSnackbar({ message: "No RSVP list configured for this event", severity: "error" });
            return;
        }

        try {
            setSending(true);
            const { links, failures } = await generateRsvpLinks(emails);
            setTokenLinks(links);
            if (links.length === 0) {
                throw new Error("No links generated. Check RSVP_TOKEN_SECRET.");
            }
            let copied = false;
            try {
                copied = await copyLinksToClipboard(links);
            } catch {
                copied = false;
            }
            const snackbar = getInviteSnackbar(links.length, failures, copied);
            setSnackbar(snackbar);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to generate RSVP links";
            setSnackbar({ message, severity: "error" });
        } finally {
            setSending(false);
        }
    };

    const handleSendReminder = () => {
        alert("Reminder functionality would send emails to guests who haven't responded yet.");
    };

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
            <EventDetailHeader
                inviteOnly={event.inviteOnly}
                rsvpRequired={event.rsvpRequired}
                onBack={() => router.push("/events")}
                onEdit={() => router.push(`/events/${event.id}/edit`, { scroll: false })}
                onShare={handleShareRSVP}
                showEdit={event.rsvpReceived === 0}
            />

            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                <Stack spacing={3}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="stretch">
                        <Box sx={{ flex: { md: 1 }, display: "flex" }}>
                            <EventInfoCard
                                eventName={event.name}
                                eventDate={formattedDate}
                                eventStartTime={formattedStartTime}
                                eventEndTime={formattedEndTime}
                                eventLocation={event.location}
                                invitedCount={event.invited}
                            />
                        </Box>
                        <Box sx={{ flex: { md: 2 } }}>
                            <Stack spacing={3}>
                                <GuestParkingCard event={event} />
                            </Stack>
                        </Box>
                    </Stack>
                    <RSVPProgressCard
                        event={event}
                        onSendReminder={handleSendReminder}
                    />
                </Stack>
            </Container>

            <ShareRsvpDialog
                open={shareOpen}
                onClose={handleCloseShare}
                selectedEmails={selectedEmails}
                tokenLinks={tokenLinks}
                sending={sending}
                onSendInvites={handleSendInvites}
            />

            <Snackbar
                open={Boolean(snackbar)}
                autoHideDuration={3000}
                onClose={() => setSnackbar(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                {snackbar ? (
                    <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
                ) : undefined}
            </Snackbar>
        </Box>
    );
}
