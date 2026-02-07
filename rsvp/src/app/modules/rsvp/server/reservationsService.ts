export type { Reservation } from "@/lib/server/repositories/reservationsRepository";
import {
    cancelReservation,
    createReservation,
    findExistingReservation,
    getActiveEventReservations,
    getEventReservations,
    getReservation,
    getReservationCount,
} from "@/lib/server/repositories/reservationsRepository";

export async function createReservationService(
    eventId: number,
    guestName: string,
    licensePlate: string,
    guestEmail?: string
): Promise<Reservation> {
    return createReservation(eventId, guestName, licensePlate, guestEmail);
}

export async function getReservationService(id: string): Promise<Reservation | undefined> {
    return getReservation(id);
}

export async function getEventReservationsService(eventId: number): Promise<Reservation[]> {
    return getEventReservations(eventId);
}

export async function getActiveEventReservationsService(eventId: number): Promise<Reservation[]> {
    return getActiveEventReservations(eventId);
}

export async function cancelReservationService(id: string): Promise<Reservation | null> {
    return cancelReservation(id);
}

export async function findExistingReservationService(
    eventId: number,
    licensePlate: string
): Promise<Reservation | undefined> {
    return findExistingReservation(eventId, licensePlate);
}

export async function getReservationCountService(eventId: number): Promise<number> {
    return getReservationCount(eventId);
}
