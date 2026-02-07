import { NextRequest, NextResponse } from "next/server";
import { getEventService } from "@/app/modules/events/server/eventsService";
import { signRsvpToken } from "@/lib/server/crypto/tokenService";

type GenerateLinkPayload = {
    eventId: number;
    email: string;
    rsvpUrl?: string;
};

function getTokenExpiry(eventEndsAtISO?: string, eventStartsAtISO?: string): number | null {
    const source = eventEndsAtISO || eventStartsAtISO;
    if (!source) {
        return null;
    }
    const timestamp = new Date(source).getTime();
    if (Number.isNaN(timestamp)) {
        return null;
    }
    return timestamp;
}

export async function POST(request: NextRequest) {
    const { eventId, email, rsvpUrl }: GenerateLinkPayload = await request.json();

    if (!eventId || !email) {
        return NextResponse.json({ error: "Missing eventId or email" }, { status: 400 });
    }

    const event = await getEventService(eventId);
    if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const secret = process.env.RSVP_TOKEN_SECRET;
    if (!secret) {
        return NextResponse.json({ error: "RSVP token secret is not configured" }, { status: 500 });
    }

    const exp = getTokenExpiry(event.endsAtISO, event.startsAtISO);
    if (!exp) {
        return NextResponse.json({ error: "Event date is not configured" }, { status: 400 });
    }

    const token = signRsvpToken({ eventId: event.id, email, exp }, secret);
    const origin = request.headers.get("origin") ?? "";
    const baseUrl = rsvpUrl || (origin ? `${origin}/rsvp/${event.id}` : `/rsvp/${event.id}`);
    const url = new URL(baseUrl, origin || "http://localhost");
    url.searchParams.set("token", token);

    return NextResponse.json({ link: url.toString() });
}
