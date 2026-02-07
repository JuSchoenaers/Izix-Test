export type { RsvpResponse } from "@/lib/server/repositories/rsvpResponsesRepository";
export type { RsvpResponseStatus } from "@/lib/types/rsvp";
import {
    getRsvpResponse,
    getRsvpResponsesForEvent,
    recordRsvpResponse,
} from "@/lib/server/repositories/rsvpResponsesRepository";

export async function recordRsvpResponseService(
    eventId: number,
    email: string,
    status: RsvpResponseStatus
): Promise<RsvpResponse> {
    return recordRsvpResponse(eventId, email, status);
}

export async function getRsvpResponseService(
    eventId: number,
    email: string
): Promise<RsvpResponse | undefined> {
    return getRsvpResponse(eventId, email);
}

export async function getRsvpResponsesForEventService(eventId: number): Promise<RsvpResponse[]> {
    return getRsvpResponsesForEvent(eventId);
}
