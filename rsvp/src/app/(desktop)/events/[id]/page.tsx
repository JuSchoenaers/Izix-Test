import { notFound } from "next/navigation";
import { getEvent } from "@/lib/server/eventsStore";
import { EventDetailView } from "@/app/modules/events/components/EventDetailView";

type EventDetailPageProps = Readonly<{
    params: Promise<{ id: string }>;
}>;

export default async function EventDetailPage({ params }: EventDetailPageProps) {
    const { id } = await params;
    const event = await getEvent(Number(id));
    
    if (!event) {
        notFound();
    }
    
    return <EventDetailView event={event} />;
}
