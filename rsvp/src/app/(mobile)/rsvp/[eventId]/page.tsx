import { notFound } from 'next/navigation';
import { getEvent } from '@/lib/server/eventsStore';
import { verifyRsvpToken } from "@/lib/server/crypto/tokenService";
import { RSVPView } from './RSVPView';

type RSVPPageProps = Readonly<{
    params: Promise<{ eventId: string }>;
    searchParams?: Promise<{ token?: string }>;
}>;

export async function generateMetadata({ params }: RSVPPageProps) {
    const resolvedParams = await params;
    const event = await getEvent(Number(resolvedParams.eventId));
    
    if (!event) {
        return {
            title: 'Event Not Found - Izix',
        };
    }

    return {
        title: `RSVP - ${event.name} - Izix`,
        description: `Reserve parking for ${event.name}`,
    };
}

export default async function RSVPPage({ params, searchParams }: RSVPPageProps) {
    const resolvedParams = await params;
    const eventId = Number(resolvedParams.eventId);
    const resolvedSearchParams = await searchParams;
    const token = resolvedSearchParams?.token ?? null;

    const event = await getEvent(eventId);
    if (!event) {
        notFound();
    }

    const secret = process.env.RSVP_TOKEN_SECRET;
    const tokenPayload = token && secret ? verifyRsvpToken(token, secret) : null;
    const tokenEmail = tokenPayload?.eventId === eventId ? tokenPayload.email : null;

    return (
        <RSVPView
            event={event}
            token={tokenPayload ? token : null}
            tokenEmail={tokenEmail}
        />
    );
}
