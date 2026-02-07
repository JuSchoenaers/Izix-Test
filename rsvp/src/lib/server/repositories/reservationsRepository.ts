export type Reservation = {
    id: string;
    eventId: number;
    guestName: string;
    guestEmail?: string;
    licensePlate: string;
    createdAt: string; // ISO timestamp
    status: "active" | "cancelled";
};

const store = new Map<string, Reservation>();

function uid() {
    return crypto.randomUUID();
}

export async function createReservation(
    eventId: number,
    guestName: string,
    licensePlate: string,
    guestEmail?: string
): Promise<Reservation> {
    const reservation: Reservation = {
        id: uid(),
        eventId,
        guestName: guestName.trim(),
        guestEmail: guestEmail?.trim().toLowerCase(),
        licensePlate: licensePlate.trim().toUpperCase(),
        createdAt: new Date().toISOString(),
        status: "active",
    };
    store.set(reservation.id, reservation);
    return reservation;
}

export async function getReservation(id: string): Promise<Reservation | undefined> {
    return store.get(id);
}

export async function getEventReservations(eventId: number): Promise<Reservation[]> {
    return Array.from(store.values()).filter((reservation) => reservation.eventId === eventId);
}

export async function getActiveEventReservations(eventId: number): Promise<Reservation[]> {
    return Array.from(store.values()).filter(
        (reservation) => reservation.eventId === eventId && reservation.status === "active"
    );
}

export async function cancelReservation(id: string): Promise<Reservation | null> {
    const reservation = store.get(id);
    if (!reservation) {
        return null;
    }

    const updated: Reservation = {
        ...reservation,
        status: "cancelled",
    };
    store.set(id, updated);
    return updated;
}

export async function findExistingReservation(
    eventId: number,
    licensePlate: string
): Promise<Reservation | undefined> {
    const normalizedPlate = licensePlate.trim().toUpperCase();
    return Array.from(store.values()).find(
        (reservation) =>
            reservation.eventId === eventId &&
            reservation.licensePlate === normalizedPlate &&
            reservation.status === "active"
    );
}

export async function getReservationCount(eventId: number): Promise<number> {
    return Array.from(store.values()).filter(
        (reservation) => reservation.eventId === eventId && reservation.status === "active"
    ).length;
}
