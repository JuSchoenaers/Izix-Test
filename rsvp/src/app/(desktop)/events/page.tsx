import Page from "@/app/_shared/page/page";
import {EventList, EventListSkeleton} from "@/app/modules/events/EventList";
import {Suspense} from "react";

export const dynamic = "force-dynamic";

export default function Events() {

    return (
        <Page
            title="Izix"
            subtitle="Smart parking solutions"
            fullWidth
            ctas={[
                {
                    label: "New event",
                    href: "/events/new",
                    icon: "add",
                    variant: "contained",
                    scroll: false,
                },
            ]}
        >
            <Suspense fallback={<EventListSkeleton/>}>
                <EventList/>
            </Suspense>
        </Page>
    );
}
