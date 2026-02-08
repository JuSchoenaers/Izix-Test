export function getReservationStorageKey(eventId: number, token?: string | null): string {
    if (!token) {
        return `rsvp-reservation-${eventId}`;
    }
    return `rsvp-reservation-${eventId}-${token}`;
}
