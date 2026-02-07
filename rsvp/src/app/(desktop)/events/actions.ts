'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createEventService, updateEventService } from "@/app/modules/events/server/eventsService";
import { EVENT_LIFECYCLE_STATUS } from '@/lib/types/events';

function getFormString(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === 'string' ? value : '';
}

export async function createEventAction(formData: FormData) {
    const name = getFormString(formData, 'name').trim();
    const startsAtISO = getFormString(formData, 'startsAtISO');
    const endsAtISO = getFormString(formData, 'endsAtISO');
    const location = getFormString(formData, 'location').trim();
    const parkingCapacity = Number(formData.get('parkingCapacity') ?? 0);
    const eventType = (getFormString(formData, 'eventType') || 'Private') as "Private" | "Public";
    const rsvpListNamesValue = getFormString(formData, 'rsvpListNames');
    const rsvpListNames = rsvpListNamesValue
        ? rsvpListNamesValue.split(',').map((name) => name.trim()).filter(Boolean)
        : [];
    const publicInviteEmailsValue = getFormString(formData, 'publicInviteEmails');
    const publicInviteEmails = publicInviteEmailsValue
        ? publicInviteEmailsValue.split(',').map((email) => email.trim()).filter(Boolean)
        : [];
    if (!name || !startsAtISO || !endsAtISO || !location || parkingCapacity <= 0) {
        throw new Error('All fields are required');
    }

    await createEventService({
        name,
        startsAtISO,
        endsAtISO,
        location,
        parkingCapacity,
        rsvpListNames,
        eventType,
        publicInviteEmails,
    });
    revalidatePath('/events');
    redirect('/events');
}

export async function updateEventAction(formData: FormData) {
    const updated = await updateEventFromForm(formData);
    if (!updated) {
        throw new Error('Event not found');
    }
    revalidatePath('/events');
    revalidatePath(`/events/${updated.id}`);
    redirect(`/events/${updated.id}`);
}

export async function updateEventActionNoRedirect(formData: FormData) {
    const updated = await updateEventFromForm(formData);
    if (!updated) {
        throw new Error('Event not found');
    }
    revalidatePath('/events');
    revalidatePath(`/events/${updated.id}`);
    return { id: updated.id };
}

export async function cancelEventActionNoRedirect(id: number) {
    if (!id) {
        throw new Error('Event not found');
    }
    const updated = await updateEventService(id, { status: EVENT_LIFECYCLE_STATUS.cancelled });
    if (!updated) {
        throw new Error('Event not found');
    }
    revalidatePath('/events');
    revalidatePath(`/events/${id}`);
    return { id };
}

async function updateEventFromForm(formData: FormData) {
    const id = Number(formData.get('id') ?? 0);
    const name = getFormString(formData, 'name').trim();
    const startsAtISOValue = getFormString(formData, 'startsAtISO');
    const endsAtISOValue = getFormString(formData, 'endsAtISO');
    const eventDate = getFormString(formData, 'eventDate');
    const eventTime = getFormString(formData, 'eventTime');
    const eventEndTime = getFormString(formData, 'eventEndTime');
    const startsAtISO = startsAtISOValue || (eventDate && eventTime
        ? new Date(`${eventDate}T${eventTime}`).toISOString()
        : '');
    const endsAtISO = endsAtISOValue || (eventDate && eventEndTime
        ? new Date(`${eventDate}T${eventEndTime}`).toISOString()
        : '');
    const location = getFormString(formData, 'location').trim();
    const parkingCapacity = Number(formData.get('parkingCapacity') ?? 0);
    const eventType = getFormString(formData, 'eventType') as "Private" | "Public";
    const rsvpListNamesValue = getFormString(formData, 'rsvpListNames');
    const rsvpListNames = rsvpListNamesValue
        ? rsvpListNamesValue.split(',').map((name) => name.trim()).filter(Boolean)
        : [];
    const publicInviteEmailsValue = getFormString(formData, 'publicInviteEmails');
    const publicInviteEmails = publicInviteEmailsValue
        ? publicInviteEmailsValue.split(',').map((email) => email.trim()).filter(Boolean)
        : [];

    if (!id || !name || !startsAtISO || !location || parkingCapacity <= 0) {
        throw new Error('All fields are required');
    }

    return updateEventService(id, {
        name,
        startsAtISO,
        endsAtISO: endsAtISO || undefined,
        location,
        parkingCapacity,
        eventType: eventType || undefined,
        rsvpListNames,
        publicInviteEmails,
    });
}
