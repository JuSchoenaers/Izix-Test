import fs from "node:fs/promises";
import path from "node:path";
import type { EventLifecycleStatus } from "@/lib/types/events";
import { EVENT_LIFECYCLE_STATUS } from "@/lib/types/events";

export type Event = {
    id: number;
    name: string;
    startsAtISO: string;
    endsAtISO?: string;
    location: string;
    parkingCapacity: number;
    rsvpListNames?: string[];
    eventType?: "Private" | "Public";
    publicInviteEmails?: string[];
    status?: EventLifecycleStatus;

    invited: number;
    rsvpReceived: number;
    parkingClaimed: number;

    inviteOnly: boolean;
    rsvpRequired: boolean;
};

const DATA_DIR = path.join(process.cwd(), "data", "seed");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");

type PersistedEvents = {
    nextId: number;
    events: Event[];
};

async function readPersistedEvents(): Promise<PersistedEvents> {
    try {
        const raw = await fs.readFile(EVENTS_FILE, "utf8");
        const parsed = JSON.parse(raw) as PersistedEvents;
        if (!parsed || !Array.isArray(parsed.events) || typeof parsed.nextId !== "number") {
            return { nextId: 1, events: [] };
        }
        return parsed;
    } catch (error: unknown) {
        const err = error as NodeJS.ErrnoException;
        if (err.code === "ENOENT") {
            await fs.mkdir(DATA_DIR, { recursive: true });
            return { nextId: 1, events: [] };
        }
        throw error;
    }
}

async function writePersistedEvents(data: PersistedEvents): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(EVENTS_FILE, JSON.stringify(data), "utf8");
}

export async function listEvents(): Promise<Event[]> {
    const { events } = await readPersistedEvents();
    return events;
}

export async function getEvent(id: number): Promise<Event | undefined> {
    const { events } = await readPersistedEvents();
    return events.find((event) => event.id === id);
}

export async function createEvent(
    input: Omit<Event, "id" | "invited" | "rsvpReceived" | "parkingClaimed" | "inviteOnly" | "rsvpRequired">
): Promise<Event> {
    const persisted = await readPersistedEvents();
    const event: Event = {
        id: persisted.nextId,
        invited: input.parkingCapacity,
        rsvpReceived: 0,
        parkingClaimed: 0,
        inviteOnly: true,
        rsvpRequired: true,
        status: input.status ?? EVENT_LIFECYCLE_STATUS.active,
        ...input,
    };
    const updated: PersistedEvents = {
        nextId: persisted.nextId + 1,
        events: [...persisted.events, event],
    };
    await writePersistedEvents(updated);
    return event;
}

export async function updateEvent(
    id: number,
    input: Partial<Omit<Event, "id">>
): Promise<Event | null> {
    const persisted = await readPersistedEvents();
    const index = persisted.events.findIndex((event) => event.id === id);
    const existing = index >= 0 ? persisted.events[index] : undefined;
    if (!existing) {
        return null;
    }

    const updated: Event = {
        ...existing,
        ...input,
    };
    const nextEvents = [...persisted.events];
    nextEvents[index] = updated;
    await writePersistedEvents({ nextId: persisted.nextId, events: nextEvents });
    return updated;
}

type EventCounterDelta = {
    rsvpDelta?: number;
    parkingDelta?: number;
};

export async function updateEventCounters(
    eventId: number,
    delta: EventCounterDelta
): Promise<Event | null> {
    const persisted = await readPersistedEvents();
    const index = persisted.events.findIndex((event) => event.id === eventId);
    const event = index >= 0 ? persisted.events[index] : undefined;
    if (!event) {
        return null;
    }

    const nextRsvp = Math.max(0, event.rsvpReceived + (delta.rsvpDelta ?? 0));
    const nextParkingRaw = event.parkingClaimed + (delta.parkingDelta ?? 0);
    const nextParking = Math.max(0, Math.min(event.parkingCapacity, nextParkingRaw));

    const updated: Event = {
        ...event,
        rsvpReceived: nextRsvp,
        parkingClaimed: nextParking,
    };

    const nextEvents = [...persisted.events];
    nextEvents[index] = updated;
    await writePersistedEvents({ nextId: persisted.nextId, events: nextEvents });
    return updated;
}

export async function deleteEvent(id: number): Promise<boolean> {
    const persisted = await readPersistedEvents();
    const nextEvents = persisted.events.filter((event) => event.id !== id);
    if (nextEvents.length === persisted.events.length) {
        return false;
    }
    await writePersistedEvents({ nextId: persisted.nextId, events: nextEvents });
    return true;
}

type ResetCountersResult = {
    updated: number;
    skipped: number;
};

function isPastEvent(event: Event): boolean {
    const reference = event.endsAtISO || event.startsAtISO;
    const timestamp = new Date(reference).getTime();
    if (Number.isNaN(timestamp)) {
        return false;
    }
    return timestamp < Date.now();
}

export async function resetEventCountersExceptPast(): Promise<ResetCountersResult> {
    const persisted = await readPersistedEvents();
    let updated = 0;
    let skipped = 0;

    const nextEvents = persisted.events.map((event) => {
        if (isPastEvent(event)) {
            skipped += 1;
            return event;
        }
        updated += 1;
        return {
            ...event,
            rsvpReceived: 0,
            parkingClaimed: 0,
            status: event.status === EVENT_LIFECYCLE_STATUS.cancelled ? EVENT_LIFECYCLE_STATUS.active : event.status,
        };
    });

    await writePersistedEvents({ nextId: persisted.nextId, events: nextEvents });
    return { updated, skipped };
}

export async function simulateRSVP(
    eventId: number,
    needsParking: boolean
): Promise<Event | null> {
    const persisted = await readPersistedEvents();
    const index = persisted.events.findIndex((event) => event.id === eventId);
    const event = index >= 0 ? persisted.events[index] : undefined;
    if (!event) {
        return null;
    }

    const updated: Event = {
        ...event,
        rsvpReceived: event.rsvpReceived + 1,
        parkingClaimed: needsParking ? event.parkingClaimed + 1 : event.parkingClaimed,
    };
    const nextEvents = [...persisted.events];
    nextEvents[index] = updated;
    await writePersistedEvents({ nextId: persisted.nextId, events: nextEvents });
    return updated;
}
