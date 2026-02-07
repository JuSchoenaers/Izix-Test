import { format, parseISO, isBefore, isToday, startOfDay } from 'date-fns';
import { EVENT_LIFECYCLE_STATUS, type EventLifecycleStatus } from '@/lib/types/events';

export function formatEventDate(isoString: string): string {
    try {
        const date = parseISO(isoString);
        return format(date, 'dd/MM/yyyy');
    } catch {
        return isoString;
    }
}

export function formatEventDateLong(isoString: string): string {
    try {
        const date = parseISO(isoString);
        return format(date, 'd MMM yyyy');
    } catch {
        return isoString;
    }
}

export function getMonthYear(isoString: string): { key: string; label: string } {
    try {
        const date = parseISO(isoString);
        return {
            key: format(date, 'yyyy-MM'),
            label: format(date, 'MMMM yyyy'),
        };
    } catch {
        return { key: 'unknown', label: 'Unknown' };
    }
}

export const EVENT_STATUS = {
    upcoming: 'upcoming',
    active: 'active',
    complete: 'complete',
    cancelled: 'cancelled',
} as const;

export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];

export function getEventStatus(isoString: string): EventStatus {
    try {
        const eventDate = startOfDay(parseISO(isoString));
        const today = startOfDay(new Date());
        
        if (isBefore(eventDate, today)) {
            return EVENT_STATUS.complete;
        }
        if (isToday(eventDate)) {
            return EVENT_STATUS.active;
        }
        return EVENT_STATUS.upcoming;
    } catch {
        return EVENT_STATUS.upcoming;
    }
}

export function getEventStatusForEvent(event: { startsAtISO: string; status?: EventLifecycleStatus }): EventStatus {
    if (event.status === EVENT_LIFECYCLE_STATUS.cancelled) {
        return EVENT_STATUS.cancelled;
    }
    return getEventStatus(event.startsAtISO);
}

export function getStatusLabel(status: EventStatus): string {
    switch (status) {
        case 'complete':
            return 'Complete';
        case 'active':
            return 'Active';
        case 'upcoming':
            return 'Upcoming';
        case 'cancelled':
            return 'Cancelled';
    }
}

export function getStatusColor(status: EventStatus): 'success' | 'primary' | 'default' | 'warning' {
    switch (status) {
        case 'complete':
            return 'success';
        case 'active':
            return 'primary';
        case 'upcoming':
            return 'default';
        case 'cancelled':
            return 'warning';
    }
}
