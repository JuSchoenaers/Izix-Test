import { NextRequest, NextResponse } from "next/server";
import { resetEventCountersExceptPastService } from "@/app/modules/events/server/eventsService";

export async function GET(request: NextRequest) {
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await resetEventCountersExceptPastService();
    return NextResponse.redirect(new URL("/events", request.url));
}
