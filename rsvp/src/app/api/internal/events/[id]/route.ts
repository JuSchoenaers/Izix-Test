import { NextResponse } from "next/server";
import { getEventService } from "@/app/modules/events/server/eventsService";

type RouteParams = {
    params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
    const { id } = await params;
    const event = await getEventService(Number(id));

    if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, {
        headers: {
            "Cache-Control": "no-store",
        },
    });
}
