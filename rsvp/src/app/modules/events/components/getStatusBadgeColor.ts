import { EVENT_LIFECYCLE_STATUS } from "@/lib/types/events";
import type { getEventStatusForEvent } from "@/lib/utils/dateUtils";

type EventStatus = ReturnType<typeof getEventStatusForEvent>;

export function getStatusBadgeColor(status: EventStatus) {
    switch (status) {
        case EVENT_LIFECYCLE_STATUS.active:
            return "primary.main";
        case "upcoming":
            return "grey.400";
        case EVENT_LIFECYCLE_STATUS.cancelled:
            return "warning.main";
        case "complete":
            return "success.main";
        default:
            return "primary.main";
    }
}
