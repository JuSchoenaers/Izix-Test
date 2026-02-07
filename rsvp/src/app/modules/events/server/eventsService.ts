export type { Event } from "@/lib/server/repositories/eventsRepository";
import {
    createEvent,
    deleteEvent,
    getEvent,
    listEvents,
    resetEventCountersExceptPast,
    simulateRSVP,
    updateEvent,
    updateEventCounters,
} from "@/lib/server/repositories/eventsRepository";

export async function listEventsService(): Promise<Event[]> {
    return listEvents();
}

export async function getEventService(id: number): Promise<Event | undefined> {
    return getEvent(id);
}

export async function createEventService(
    input: Omit<Event, "id" | "invited" | "rsvpReceived" | "parkingClaimed" | "inviteOnly" | "rsvpRequired">
): Promise<Event> {
    return createEvent(input);
}

export async function updateEventService(
    id: number,
    input: Partial<Omit<Event, "id">>
): Promise<Event | null> {
    return updateEvent(id, input);
}

export async function updateEventCountersService(
    eventId: number,
    delta: { rsvpDelta?: number; parkingDelta?: number }
): Promise<Event | null> {
    return updateEventCounters(eventId, delta);
}

export async function deleteEventService(id: number): Promise<boolean> {
    return deleteEvent(id);
}

export async function resetEventCountersExceptPastService() {
    return resetEventCountersExceptPast();
}

export async function simulateRsvpService(eventId: number, needsParking: boolean) {
    return simulateRSVP(eventId, needsParking);
}
