export function getReservationStorageKey(eventId: number): string {
    return `rsvp-reservation-${eventId}`;
}
