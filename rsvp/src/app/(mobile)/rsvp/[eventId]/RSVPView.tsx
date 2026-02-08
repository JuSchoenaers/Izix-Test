'use client';

import { Box, Alert, AlertTitle } from '@mui/material';
import { useState, useTransition, useEffect } from 'react';
import type { Event } from '@/lib/server/eventsStore';
import { EventHeader, ParkingToggle, ParkingForm, ReservationConfirmation } from '@/app/modules/rsvp/components';
import { reserveParkingAction, cancelReservationAction, declineParkingAction } from './actions';
import { getReservationStorageKey } from "./utils/rsvpStorageUtils";

type RSVPState = 
    | 'initial'          // No selection made
    | 'yes-selected'     // Yes selected, form visible
    | 'no-selected'      // No selected, form hidden
    | 'submitting'       // Form being submitted
    | 'confirmed'        // Reservation confirmed
    | 'cancelling';      // Cancellation in progress

type RSVPViewProps = Readonly<{
    event: Event;
    token?: string | null;
    tokenEmail?: string | null;
}>;

export function RSVPView({ event, token = null, tokenEmail = null }: RSVPViewProps) {
    const [reservationId, setReservationId] = useState<string | null>(null);
    const [state, setState] = useState<RSVPState>('yes-selected');
    const [name, setName] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const storedId = localStorage.getItem(getReservationStorageKey(event.id, token));
        if (storedId) {
            setReservationId(storedId);
            setState('confirmed');
        }
    }, [event.id, token]);

    useEffect(() => {
        if (tokenEmail) {
            setName(tokenEmail);
        }
    }, [tokenEmail]);

    const isSubmitting = state === 'submitting' || isPending;
    const isCancelling = state === 'cancelling' || isPending;

    const handleToggleChange = (value: 'yes' | 'no') => {
        setError(null);
        
        if (value === 'no') {
            setState('no-selected');
            startTransition(async () => {
                const result = await declineParkingAction(event.id, token);
                if (!result.success) {
                    setError(result.error || 'Failed to record response');
                }
            });
        } else {
            setState('yes-selected');
        }
    };

    const handleSubmit = async () => {
        setError(null);
        setState('submitting');

        startTransition(async () => {
            const result = await reserveParkingAction(
                event.id,
                name,
                licensePlate,
                token
            );

            if (result.success && result.reservationId) {
                localStorage.setItem(getReservationStorageKey(event.id, token), result.reservationId);
                setReservationId(result.reservationId);
                setState('confirmed');
            } else {
                setError(result.error || 'An error occurred. Please try again.');
                setState('yes-selected');
            }
        });
    };

    const handleCancel = async () => {
        const currentId =
            reservationId || localStorage.getItem(getReservationStorageKey(event.id, token));
        if (!currentId) {
            setError('No reservation found to cancel');
            return;
        }
        
        setError(null);
        setState('cancelling');

        startTransition(async () => {
            const result = await cancelReservationAction(currentId, token);
            
            if (result.success) {
                localStorage.removeItem(getReservationStorageKey(event.id, token));
                setReservationId(null);
                setName('');
                setLicensePlate('');
                setState('no-selected');
            } else {
                setError(result.error || 'Failed to cancel reservation');
                setState('confirmed');
            }
        });
    };

    const eventDate = new Date(event.startsAtISO).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
    const timeFormatter = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });
    const startTime = timeFormatter.format(new Date(event.startsAtISO));
    const endTime = event.endsAtISO ? timeFormatter.format(new Date(event.endsAtISO)) : null;
    const eventTime = endTime ? `${startTime} - ${endTime}` : startTime;
    let toggleValue: 'yes' | 'no' | null = null;
    if (state === 'no-selected') {
        toggleValue = 'no';
    } else if (state === 'yes-selected') {
        toggleValue = 'yes';
    }

    return (
        <Box>
            <EventHeader
                eventName={event.name}
                eventDate={eventDate}
                eventTime={eventTime}
                eventLocation={event.location}
            />

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    <AlertTitle>Error</AlertTitle>
                    {error}
                </Alert>
            )}

            {state !== 'confirmed' && (
                <ParkingToggle
                    value={toggleValue}
                    onChange={handleToggleChange}
                    disabled={isSubmitting}
                />
            )}

            {state === 'yes-selected' && (
                <ParkingForm
                    name={name}
                    licensePlate={licensePlate}
                    onNameChange={setName}
                    onLicensePlateChange={setLicensePlate}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    emailLocked
                    error={error}
                />
            )}

            {state === 'confirmed' && (
                <ReservationConfirmation
                    onCancel={handleCancel}
                    isCancelling={isCancelling}
                />
            )}
        </Box>
    );
}
