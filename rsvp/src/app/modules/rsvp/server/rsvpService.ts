import { RSVP_RESPONSE_STATUS } from "@/lib/types/rsvp";
import { verifyRsvpToken } from "@/lib/server/crypto/tokenService";
import { getEventService, updateEventCountersService } from "@/app/modules/events/server/eventsService";
import {
    cancelReservationService,
    createReservationService,
    findExistingReservationService,
    getReservationService,
} from "@/app/modules/rsvp/server/reservationsService";
import {
    getRsvpResponseService,
    recordRsvpResponseService,
} from "@/app/modules/rsvp/server/rsvpResponsesService";

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

export async function reserveParking(
    eventId: number,
    guestName: string,
    licensePlate: string,
    token?: string | null
): Promise<ReserveParkingResult> {
    try {
        const event = await getEventService(eventId);
        if (!event) {
            return { success: false, error: "Event not found" };
        }
        const secret = process.env.RSVP_TOKEN_SECRET;
        if (!token || !secret) {
            return { success: false, error: "RSVP token required" };
        }
        const tokenPayload = verifyRsvpToken(token, secret);
        if (tokenPayload?.eventId !== eventId) {
            return { success: false, error: "Invalid RSVP token" };
        }
        const guestEmail = tokenPayload.email;
        const existingResponse = await getRsvpResponseService(eventId, guestEmail);
        if (existingResponse?.status === RSVP_RESPONSE_STATUS.reserved) {
            return { success: false, error: "Reservation already recorded" };
        }

        if (event.parkingClaimed >= event.parkingCapacity) {
            return { success: false, error: "No parking spots available" };
        }

        const existing = await findExistingReservationService(eventId, licensePlate);
        if (existing) {
            return {
                success: false,
                error: "This license plate already has a reservation for this event",
            };
        }

        const reservation = await createReservationService(eventId, guestName, licensePlate, guestEmail);

        let rsvpDelta = 1;
        if (existingResponse) {
            rsvpDelta = existingResponse.status === RSVP_RESPONSE_STATUS.declined ? 1 : 0;
        }
        await updateEventCountersService(eventId, {
            parkingDelta: 1,
            rsvpDelta,
        });
        await recordRsvpResponseService(eventId, guestEmail, RSVP_RESPONSE_STATUS.reserved);

        return { success: true, reservationId: reservation.id };
    } catch (error) {
        console.error("Error reserving parking:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}

export async function cancelReservation(
    reservationId: string,
    token?: string | null
): Promise<CancelReservationResult> {
    try {
        const secret = process.env.RSVP_TOKEN_SECRET;
        if (!token || !secret) {
            return { success: false, error: "RSVP token required" };
        }
        const tokenPayload = verifyRsvpToken(token, secret);
        if (!tokenPayload) {
            return { success: false, error: "Invalid RSVP token" };
        }
        const existingResponse = await getRsvpResponseService(tokenPayload.eventId, tokenPayload.email);

        const reservation = await getReservationService(reservationId);
        if (!reservation) {
            if (tokenPayload.eventId) {
                if (existingResponse?.status === RSVP_RESPONSE_STATUS.reserved) {
                    await updateEventCountersService(tokenPayload.eventId, { parkingDelta: -1 });
                }
                await recordRsvpResponseService(
                    tokenPayload.eventId,
                    tokenPayload.email,
                    RSVP_RESPONSE_STATUS.declined
                );
            }
            return { success: true, eventId: tokenPayload.eventId };
        }
        if (tokenPayload.eventId !== reservation.eventId) {
            return { success: false, error: "Invalid RSVP token" };
        }
        if (!reservation.guestEmail || reservation.guestEmail !== tokenPayload.email) {
            return { success: false, error: "Reservation does not match token" };
        }

        if (reservation.status === "cancelled") {
            return { success: false, error: "Reservation already cancelled" };
        }

        await cancelReservationService(reservationId);

        if (!existingResponse || existingResponse.status === RSVP_RESPONSE_STATUS.reserved) {
            await updateEventCountersService(reservation.eventId, { parkingDelta: -1 });
        }
        await recordRsvpResponseService(
            reservation.eventId,
            tokenPayload.email,
            RSVP_RESPONSE_STATUS.declined
        );

        return { success: true, eventId: reservation.eventId };
    } catch (error) {
        console.error("Error cancelling reservation:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}

export async function declineParking(
    eventId: number,
    token?: string | null
): Promise<{ success: boolean; error?: string }> {
    try {
        const event = await getEventService(eventId);
        if (!event) {
            return { success: false, error: "Event not found" };
        }
        const secret = process.env.RSVP_TOKEN_SECRET;
        if (!token || !secret) {
            return { success: false, error: "RSVP token required" };
        }
        const tokenPayload = verifyRsvpToken(token, secret);
        if (tokenPayload?.eventId !== eventId) {
            return { success: false, error: "Invalid RSVP token" };
        }
        const guestEmail = tokenPayload.email;
        const existingResponse = await getRsvpResponseService(eventId, guestEmail);
        if (existingResponse?.status === RSVP_RESPONSE_STATUS.reserved) {
            return { success: false, error: "Parking already reserved" };
        }

        const rsvpDelta = existingResponse?.status === "declined" ? 0 : 1;
        await updateEventCountersService(eventId, { rsvpDelta });
        await recordRsvpResponseService(eventId, guestEmail, RSVP_RESPONSE_STATUS.declined);

        return { success: true };
    } catch (error) {
        console.error("Error declining parking:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}
