import { addMonths, format } from "date-fns";

type DisplayMonth = { key: string; label: string; isCurrent: boolean };

export function getEventListDisplayMonths(): DisplayMonth[] {
    const now = new Date();
    const prevMonth = addMonths(now, -1);
    const nextMonth = addMonths(now, 1);

    return [
        {
            key: format(prevMonth, "yyyy-MM"),
            label: format(prevMonth, "MMMM yyyy"),
            isCurrent: false,
        },
        {
            key: format(now, "yyyy-MM"),
            label: format(now, "MMMM yyyy"),
            isCurrent: true,
        },
        {
            key: format(nextMonth, "yyyy-MM"),
            label: format(nextMonth, "MMMM yyyy"),
            isCurrent: false,
        },
    ];
}
