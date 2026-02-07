"use client";

import {
    Autocomplete,
    Box,
    Divider,
    Grid,
    Icon,
    IconButton,
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import type { Event } from "@/lib/server/eventsStore";
import { getMonthYear } from "@/lib/utils/dateUtils";
import { addMonths, format, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { MonthEventsList } from "@/app/modules/events/components/MonthEventsList";
import {
    getDisplayMonths,
    getMonthBorderRadius,
    groupEventsByMonth,
    type TimeframeOption,
} from "@/app/modules/events/utils/eventCalendarUtils";

const columnTitleSx = { textAlign: "center" };

type EventCalendarClientProps = Readonly<{
    events: Event[];
}>;

export function EventCalendarClient({ events }: EventCalendarClientProps) {
    const [baseMonth, setBaseMonth] = useState(() => new Date());
    const [searchTerm, setSearchTerm] = useState("");
    const [timeframe, setTimeframe] = useState<TimeframeOption>(3);
    const [selectedDate, setSelectedDate] = useState("");
    const [expandedOverrides, setExpandedOverrides] = useState(() => new Map<number, boolean>());

    const displayMonths = useMemo(
        () => getDisplayMonths(baseMonth, timeframe),
        [baseMonth, timeframe]
    );
    const monthKeys = useMemo(() => new Set(displayMonths.map((month) => month.key)), [displayMonths]);
    const filteredEvents = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const hasSearch = normalizedSearch.length > 0;
        const hasSelectedDate = selectedDate.length > 0;

        return events.filter((event) => {
            const eventMonthKey = getMonthYear(event.startsAtISO).key;
            if (monthKeys.has(eventMonthKey) === false) {
                return false;
            }

            const matchesSearch = event.name.toLowerCase().includes(normalizedSearch);
            if (hasSearch && matchesSearch === false) {
                return false;
            }

            if (hasSelectedDate) {
                const eventDate = format(parseISO(event.startsAtISO), "yyyy-MM-dd");
                if (eventDate !== selectedDate) {
                    return false;
                }
            }

            return true;
        });
    }, [events, monthKeys, searchTerm, selectedDate]);
    const groupedEvents = useMemo(() => groupEventsByMonth(filteredEvents), [filteredEvents]);
    const isMultiRow = timeframe !== 3;
    const isSingleRow = timeframe === 3;
    const columnSpan = timeframe === 12 ? 3 : 4;
    const fitTwoRows = timeframe === 6;
    const fitThreeRows = timeframe === 12;
    const toggleExpanded = (id: number, currentExpanded: boolean) => {
        setExpandedOverrides((prev) => {
            const next = new Map(prev);
            next.set(id, currentExpanded === false);
            return next;
        });
    };
    const defaultExpandedIds = useMemo(() => {
        if (fitTwoRows === false) {
            return new Set<number>();
        }
        const ids = new Set<number>();
        groupedEvents.forEach((eventsForMonth) => {
            if (eventsForMonth.length > 0) {
                ids.add(eventsForMonth[0].id);
            }
        });
        return ids;
    }, [fitTwoRows, groupedEvents]);

    const renderMonthEvents = (monthKey: string) => {
        const monthEvents = groupedEvents.get(monthKey) ?? [];
        if (monthEvents.length === 0) {
            return (
                <Box sx={{ textAlign: "center", py: 4, width: "100%" }}>
                    <Typography variant="body2" color="text.secondary">
                        No events this month
                    </Typography>
                </Box>
            );
        }
        return (
            <MonthEventsList
                monthEvents={monthEvents}
                fitThreeRows={fitThreeRows}
                fitTwoRows={fitTwoRows}
                expandedOverrides={expandedOverrides}
                defaultExpandedIds={defaultExpandedIds}
                onToggleExpanded={toggleExpanded}
            />
        );
    };

    return (
        <Stack spacing={{ xs: 2, md: 3 }} sx={{ minHeight: "100vh" }}>
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={{ xs: 2, md: 3 }}
                alignItems={{ xs: "stretch", md: "center" }}
                sx={{ px: { xs: 6, md: 9 }, justifyContent: { xs: "flex-start", md: "center" } }}
            >
                <Autocomplete
                    freeSolo
                    options={Array.from(new Set(events.map((event) => event.name))).sort((a, b) =>
                        a.localeCompare(b)
                    )}
                    value={searchTerm}
                    onInputChange={(_, value) => setSearchTerm(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            label="Search"
                            placeholder="event name"
                            slotProps={{
                                input: {
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Icon className="material-icons">search</Icon>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                width: { xs: "100%", md: 260 },
                                "& .MuiInputBase-root": { height: 40 },
                            }}
                        />
                    )}
                />
                <TextField
                    size="small"
                    label="Calendar time frame"
                    select
                    value={String(timeframe)}
                    onChange={(event) => setTimeframe(Number(event.target.value) as TimeframeOption)}
                    sx={{
                        width: { xs: "100%", md: 180 },
                        "& .MuiInputBase-root": { height: 40 },
                    }}
                >
                    <MenuItem value="3">3 months</MenuItem>
                    <MenuItem value="6">6 months</MenuItem>
                    <MenuItem value="12">12 months</MenuItem>
                </TextField>
                <TextField
                    size="small"
                    label="Event date"
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{
                        width: { xs: "100%", md: 180 },
                        "& .MuiInputBase-root": { height: 40 },
                    }}
                />
            </Stack>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "stretch",
                    gap: 1,
                    flex: 1,
                    px: { xs: 2, md: 3 },
                }}
            >
                <IconButton
                    aria-label="Previous month"
                    onClick={() => setBaseMonth((current) => addMonths(current, -timeframe))}
                    sx={{ alignSelf: "flex-start", mt: 1 }}
                >
                    <Icon className="material-icons">chevron_left</Icon>
                </IconButton>
                {fitTwoRows || fitThreeRows ? (
                    <Box
                        sx={{
                            flex: 1,
                            display: "grid",
                            gridTemplateColumns: fitThreeRows
                                ? "repeat(4, minmax(0, 1fr))"
                                : "repeat(3, minmax(0, 1fr))",
                            gridTemplateRows: fitThreeRows ? "repeat(3, 1fr)" : "repeat(2, 1fr)",
                            height: "calc(100vh - 240px)",
                        }}
                    >
                        {displayMonths.map((month, index) => {
                            const columns = fitThreeRows ? 4 : 3;
                            const rows = fitThreeRows ? 3 : 2;
                            const borderRadius = getMonthBorderRadius(index, columns, rows);
                            return (
                                <Box
                                    key={month.key}
                                    sx={{
                                        position: "relative",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        minHeight: 0,
                                        borderRadius,
                                    }}
                                >
                            <Stack
                                sx={{
                                    mt: { xs: 0, md: 1 },
                                    px: { xs: 2, md: 3 },
                                    py: { xs: 1.5, md: 2 },
                                    alignItems: "center",
                                    height: "100%",
                                }}
                                spacing={2}
                            >
                                    <Typography
                                        sx={columnTitleSx}
                                        variant={month.isCurrent ? "h5" : "h6"}
                                        fontWeight={month.isCurrent ? 700 : 400}
                                    >
                                        {month.label}
                                    </Typography>
                                    <Box
                                        sx={{
                                            flex: 1,
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "center",
                                            overflow: "auto",
                                        }}
                                    >
                                        {renderMonthEvents(month.key)}
                                    </Box>
                                </Stack>
                                {index < displayMonths.length - 1 && isSingleRow ? (
                                    <Divider
                                        orientation="vertical"
                                        sx={{
                                            position: "absolute",
                                            right: 0,
                                            top: 0,
                                            height: "100%",
                                        }}
                                    />
                                ) : null}
                                </Box>
                            );
                        })}
                    </Box>
                ) : (
                    <Grid
                        container
                        spacing={0}
                        sx={{ flex: 1, alignItems: "stretch" }}
                    >
                        {displayMonths.map((month, index) => (
                            <Grid
                                key={month.key}
                                size={{ xs: 12, sm: 6, md: columnSpan }}
                                sx={{
                                    position: "relative",
                                    border: isMultiRow ? "1px solid" : "none",
                                    borderColor: isMultiRow ? "divider" : "transparent",
                                    height: "100%",
                                }}
                            >
                            <Stack
                                sx={{
                                    mt: { xs: 0, md: 1 },
                                    px: isMultiRow ? { xs: 2, md: 3 } : 0,
                                    py: isMultiRow ? { xs: 1.5, md: 2 } : 0,
                                    alignItems: "center",
                                    height: "100%",
                                }}
                                spacing={2}
                            >
                                <Typography
                                    sx={columnTitleSx}
                                    variant={month.isCurrent ? "h5" : "h6"}
                                    fontWeight={month.isCurrent ? 700 : 400}
                                >
                                    {month.label}
                                </Typography>
                                <Box
                                    sx={{
                                        flex: 1,
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "center",
                                        overflow: "visible",
                                    }}
                                >
                                    {renderMonthEvents(month.key)}
                                </Box>
                            </Stack>
                            {index < displayMonths.length - 1 && isSingleRow ? (
                                <Divider
                                    orientation="vertical"
                                    sx={{
                                        position: "absolute",
                                        right: 0,
                                        top: 0,
                                        height: "100%",
                                    }}
                                />
                            ) : null}
                            </Grid>
                        ))}
                    </Grid>
                )}
                <IconButton
                    aria-label="Next month"
                    onClick={() => setBaseMonth((current) => addMonths(current, timeframe))}
                    sx={{ alignSelf: "flex-start", mt: 1 }}
                >
                    <Icon className="material-icons">chevron_right</Icon>
                </IconButton>
            </Box>
        </Stack>
    );
}
