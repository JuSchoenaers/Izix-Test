'use server';

import {
    cancelReservation,
    declineParking,
    reserveParking,
} from "@/app/modules/rsvp/server/rsvpService";
import { revalidatePath } from 'next/cache';

export type ReserveParkingResult = {
    success: boolean;
    reservationId?: string;
    error?: string;
};

export type CancelReservationResult = {
    success: boolean;
    eventId?: number;
    error?: string;
};

export async function reserveParkingAction(
    eventId: number,
    guestName: string,
    licensePlate: string,
    token?: string | null
): Promise<ReserveParkingResult> {
    const result = await reserveParking(eventId, guestName, licensePlate, token);
    if (result.success) {
        revalidatePath(`/rsvp/${eventId}`);
        revalidatePath(`/events/${eventId}`);
        revalidatePath('/events');
    }
    return result;
}

export async function cancelReservationAction(
    reservationId: string,
    token?: string | null
): Promise<CancelReservationResult> {
    const result = await cancelReservation(reservationId, token);
    if (result.success && result.eventId) {
        revalidatePath(`/rsvp/${result.eventId}`);
        revalidatePath(`/events/${result.eventId}`);
        revalidatePath('/events');
    }
    return result;
}

export async function declineParkingAction(
    eventId: number,
    token?: string | null
): Promise<{ success: boolean; error?: string }> {
    const result = await declineParking(eventId, token);
    if (result.success) {
        revalidatePath(`/events/${eventId}`);
        revalidatePath('/events');
    }
    return result;
}
