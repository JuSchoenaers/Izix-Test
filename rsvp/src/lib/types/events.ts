export const EVENT_LIFECYCLE_STATUS = {
    active: 'active',
    cancelled: 'cancelled',
} as const;

export type EventLifecycleStatus = (typeof EVENT_LIFECYCLE_STATUS)[keyof typeof EVENT_LIFECYCLE_STATUS];
