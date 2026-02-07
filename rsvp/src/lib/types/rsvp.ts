export const RSVP_RESPONSE_STATUS = {
    reserved: 'reserved',
    declined: 'declined',
} as const;

export type RsvpResponseStatus = (typeof RSVP_RESPONSE_STATUS)[keyof typeof RSVP_RESPONSE_STATUS];
