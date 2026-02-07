import type { Event } from "@/lib/server/eventsStore";
import { addMonths, format } from "date-fns";
import { getMonthYear } from "@/lib/utils/dateUtils";

export type DisplayMonth = { key: string; label: string; isCurrent: boolean };
export type TimeframeOption = 3 | 6 | 12;

export function getDisplayMonths(baseMonth: Date, timeframe: TimeframeOption): DisplayMonth[] {
    if (timeframe === 3) {
        const prevMonth = addMonths(baseMonth, -1);
        const nextMonth = addMonths(baseMonth, 1);

        return [
            {
                key: format(prevMonth, "yyyy-MM"),
                label: format(prevMonth, "MMMM yyyy"),
                isCurrent: false,
            },
            {
                key: format(baseMonth, "yyyy-MM"),
                label: format(baseMonth, "MMMM yyyy"),
                isCurrent: true,
            },
            {
                key: format(nextMonth, "yyyy-MM"),
                label: format(nextMonth, "MMMM yyyy"),
                isCurrent: false,
            },
        ];
    }

    const startMonth = timeframe === 12 ? new Date(baseMonth.getFullYear(), 0, 1) : baseMonth;

    return Array.from({ length: timeframe }, (_, index) => {
        const month = addMonths(startMonth, index);
        return {
            key: format(month, "yyyy-MM"),
            label: format(month, "MMMM yyyy"),
            isCurrent: timeframe === 12
                ? month.getFullYear() === baseMonth.getFullYear() &&
                  month.getMonth() === baseMonth.getMonth()
                : index === 0,
        };
    });
}

export function groupEventsByMonth(events: Event[]): Map<string, Event[]> {
    const grouped = new Map<string, Event[]>();

    events.forEach((event) => {
        const { key } = getMonthYear(event.startsAtISO);
        if (grouped.has(key) === false) {
            grouped.set(key, []);
        }
        grouped.get(key)!.push(event);
    });

    grouped.forEach((monthEvents) => {
        monthEvents.sort((a, b) => {
            const aCancelled = a.status === "cancelled";
            const bCancelled = b.status === "cancelled";
            if (aCancelled !== bCancelled) {
                return aCancelled ? 1 : -1;
            }
            return new Date(a.startsAtISO).getTime() - new Date(b.startsAtISO).getTime();
        });
    });

    return grouped;
}

export function getMonthBorderRadius(index: number, columns: number, rows: number): string {
    const isTopRow = index < columns;
    const isBottomRow = index >= columns * (rows - 1);
    const isLeftCol = index % columns === 0;
    const isRightCol = index % columns === columns - 1;

    if (isTopRow && isLeftCol) {
        return "20px 0 0 0";
    }
    if (isTopRow && isRightCol) {
        return "0 20px 0 0";
    }
    if (isBottomRow && isLeftCol) {
        return "0 0 0 20px";
    }
    if (isBottomRow && isRightCol) {
        return "0 0 20px 0";
    }
    return "0";
}
