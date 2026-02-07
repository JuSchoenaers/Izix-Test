import type { RsvpResponseStatus } from "@/lib/types/rsvp";

export type RsvpResponse = {
    eventId: number;
    email: string;
    status: RsvpResponseStatus;
    updatedAt: string;
};

const store = new Map<string, RsvpResponse>();

function keyFor(eventId: number, email: string) {
    return `${eventId}:${email.toLowerCase()}`;
}

export async function recordRsvpResponse(
    eventId: number,
    email: string,
    status: RsvpResponseStatus
): Promise<RsvpResponse> {
    const response: RsvpResponse = {
        eventId,
        email: email.trim().toLowerCase(),
        status,
        updatedAt: new Date().toISOString(),
    };
    store.set(keyFor(eventId, email), response);
    return response;
}

export async function getRsvpResponse(eventId: number, email: string): Promise<RsvpResponse | undefined> {
    return store.get(keyFor(eventId, email));
}

export async function getRsvpResponsesForEvent(eventId: number): Promise<RsvpResponse[]> {
    return Array.from(store.values()).filter((response) => response.eventId === eventId);
}
