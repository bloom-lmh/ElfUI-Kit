import {
    defineDirective,
    defineEmits,
    defineHtml,
    defineProps,
    defineStyle,
    useEffect,
    useHost,
    useHostFlag,
    useRef,
} from "@elfui/core";
import type { DirectiveBinding } from "@elfui/core";

import styles from "./style.scss?inline";
import { useDateAdapter } from "../../../composables";
import { useLocaleProvider } from "../../Providers/context";
import type { CalendarDateCell, CalendarProps, CalendarRenderValue, CalendarSlots } from "./types";

export type { CalendarDateCell, CalendarDateCellRenderer, CalendarProps, CalendarRenderValue, CalendarSlots } from "./types";

type DayCell = CalendarDateCell;

type CalendarView = "days" | "months" | "years";

const props = defineProps<CalendarProps>({
    modelValue: { type: null, default: "" },
    viewDate: { type: String, default: "" },
    defaultValue: { type: String, default: "" },
    firstDayOfWeek: { type: Number, default: undefined },
    range: { type: Boolean, default: false },
    disabledDate: { type: Function, default: undefined },
    cellClassName: { type: Function, default: undefined },
    renderDateCell: { type: Function, default: undefined },
    showWeekNumber: { type: Boolean, default: false },
    locale: { type: String, default: "" },
    ariaLabel: { type: String, default: "Calendar" },
});

const emit = defineEmits(["update:modelValue", "change", "panel-change"]);
const host = useHost();
const locale = useLocaleProvider();
const dateService = useDateAdapter();

const mountCellContent = (element: HTMLElement, value: CalendarRenderValue): void => {
    element.replaceChildren();
    for (const item of (Array.isArray(value) ? value : [value])) {
        if (item == null) continue;
        if (typeof item === "object" && "nodeType" in item) element.appendChild(item);
        else element.appendChild(element.ownerDocument.createTextNode(String(item)));
    }
};
const elfCalendarCell = defineDirective((element: HTMLElement, binding: DirectiveBinding<CalendarRenderValue>) => {
    mountCellContent(element, binding.value);
});

const parseDate = (source: unknown): Date => {
    return dateService.adapter.parse(source) ?? dateService.adapter.now();
};
const toIso = (date: Date): string => dateService.adapter.toISODate(date);
const resolvedFirstDayOfWeek = (): number => {
    const value = Number(props.firstDayOfWeek);
    return Number.isInteger(value) && value >= 0 && value <= 6
        ? value
        : dateService.firstDayOfWeek;
};

const selectedDate = (): Date => {
    const source = Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue;
    return parseDate(source || props.defaultValue);
};

const viewedSourceDate = (): Date => parseDate(props.viewDate || props.defaultValue || selectedDate());
const hasSelectedValue = (): boolean => Array.isArray(props.modelValue)
    ? props.modelValue.some(Boolean)
    : Boolean(props.modelValue);

const viewedDate = useRef(viewedSourceDate());
const selectedIso = useRef(toIso(selectedDate()));
const focusedIso = useRef(toIso(selectedDate()));
const rangeStart = useRef<string | null>(null);
const committedRange = useRef<string[]>(
    Array.isArray(props.modelValue) ? props.modelValue.map(String).filter(Boolean).sort() : [],
);
const view = useRef<CalendarView>("days");
const yearPageStart = useRef(Math.floor(dateService.adapter.getYear(selectedDate()) / 12) * 12);
let syncedModelValue = "__elf-calendar-unset__";
let pendingModelValue = "";
let pendingModelToken = 0;

const expectModelValue = (value: string | string[]): void => {
    pendingModelValue = JSON.stringify(value);
    const token = ++pendingModelToken;
    window.setTimeout(() => {
        if (token === pendingModelToken) pendingModelValue = "";
    }, 80);
};

const resolvedLocale = (): string =>
    props.locale || dateService.context.locale || locale.name;
const resolvedDateContext = () => ({
    ...dateService.context,
    locale: resolvedLocale(),
});

const syncSelectedDom = (iso: string): void => {
    host.shadowRoot?.querySelectorAll<HTMLElement>(".day").forEach((element) => {
        const selected = element.dataset.date === iso;
        element.classList.toggle("is-current", selected);
        element.setAttribute("aria-selected", selected ? "true" : "false");
    });
};

const syncRangeDraftDom = (iso: string): void => {
    host.shadowRoot?.querySelectorAll<HTMLElement>(".day").forEach((element) => {
        const isStart = element.dataset.date === iso;
        element.classList.remove("is-current", "is-range-end", "is-in-range");
        element.classList.toggle("is-range-start", isStart);
        element.setAttribute("aria-selected", isStart ? "true" : "false");
    });
};

useEffect(() => {
    const signature = JSON.stringify(props.modelValue ?? "");
    if (pendingModelValue && signature !== pendingModelValue) return;
    if (signature === pendingModelValue) pendingModelValue = "";
    if (signature === syncedModelValue) return;
    syncedModelValue = signature;
    const selected = selectedDate();
    selectedIso.set(toIso(selected));
    committedRange.set(Array.isArray(props.modelValue) ? props.modelValue.map(String).filter(Boolean).sort() : []);
    rangeStart.set(null);
    focusedIso.set(toIso(selected));
    viewedDate.set(viewedSourceDate());
    yearPageStart.set(Math.floor(dateService.adapter.getYear(selected) / 12) * 12);
    queueMicrotask(() => {
        if (!props.range && hasSelectedValue()) syncSelectedDom(selectedIso.peek());
    });
});

const monthTitle = (): string => {
    return dateService.adapter.format(viewedDate.value, "YYYY-MM", resolvedDateContext());
};

const yearTitle = (): string =>
    resolvedLocale().toLowerCase().startsWith("zh")
        ? locale.t("calendar.year", { year: dateService.adapter.getYear(viewedDate.value) })
        : dateService.adapter.format(viewedDate.value, "YYYY", resolvedDateContext());

const monthLabel = (): string =>
    resolvedLocale().toLowerCase().startsWith("zh")
        ? locale.t("calendar.month", { month: dateService.adapter.getMonth(viewedDate.value) + 1 })
        : dateService.adapter.format(viewedDate.value, "monthLong", resolvedDateContext());

const monthItems = (): Array<{ id: number; label: string; active: boolean }> =>
    Array.from({ length: 12 }, (_, month) => ({
        id: month,
        label: dateService.adapter.format(
            dateService.adapter.create(dateService.adapter.getYear(viewedDate.value), month),
            "monthShort",
            resolvedDateContext(),
        ),
        active: month === dateService.adapter.getMonth(viewedDate.value),
    }));

const yearItems = (): Array<{ id: number; active: boolean }> =>
    Array.from({ length: 12 }, (_, index) => {
        const id = yearPageStart.value + index;
        return { id, active: id === dateService.adapter.getYear(viewedDate.value) };
    });

const yearRangeTitle = (): string => `${yearPageStart.value}–${yearPageStart.value + 11}`;

const weekDays = (): string[] => {
    const sunday = dateService.adapter.create(2023, 0, 1);
    const names = Array.from({ length: 7 }, (_, index) =>
        dateService.adapter.format(
            dateService.adapter.add(sunday, index, "day"),
            "weekdayShort",
            resolvedDateContext(),
        ),
    );
    const start = resolvedFirstDayOfWeek();
    return [...names.slice(start), ...names.slice(0, start)];
};

const days = (): DayCell[] => {
    const current = viewedDate.value;
    const first = dateService.adapter.create(
        dateService.adapter.getYear(current),
        dateService.adapter.getMonth(current),
    );
    const startOffset =
        (dateService.adapter.getWeekday(first) - resolvedFirstDayOfWeek() + 7) % 7;
    const start = dateService.adapter.add(first, -startOffset, "day");
    return Array.from({ length: 42 }, (_, index) => {
        const date = dateService.adapter.add(start, index, "day");
        const iso = toIso(date);
        const value = committedRange.value;
        const pendingRangeStart = rangeStart.value;
        const rangeStartValue = pendingRangeStart || value[0] || "";
        // A new first click starts a fresh draft. Keeping the committed end here
        // would visually connect the new start to the previous range.
        const rangeEndValue = pendingRangeStart ? "" : value[1] || "";
        return {
            iso,
            label: dateService.adapter.getDate(date),
            muted: dateService.adapter.getMonth(date) !== dateService.adapter.getMonth(current),
            current: !props.range && hasSelectedValue() && iso === selectedIso.value,
            disabled: typeof props.disabledDate === "function" && Boolean(props.disabledDate(date)),
            rangeStart: Boolean(rangeStartValue) && iso === rangeStartValue,
            rangeEnd: Boolean(rangeEndValue) && iso === rangeEndValue,
            inRange: Boolean(rangeStartValue && rangeEndValue) && iso > rangeStartValue && iso < rangeEndValue,
        };
    });
};

const isDateDisabled = (date: Date): boolean =>
    typeof props.disabledDate === "function" && Boolean(props.disabledDate(date));

const select = (event: Event): void => {
    const iso = (event.currentTarget as HTMLElement).dataset.date;
    if (!iso) return;
    focusedIso.set(iso);
    if (days().find((day) => day.iso === iso)?.disabled) return;
    if (props.range) {
        const start = rangeStart.value;
        if (!start || start === iso) {
            rangeStart.set(iso);
            syncRangeDraftDom(iso);
            return;
        }
        const value = start < iso ? [start, iso] : [iso, start];
        rangeStart.set(null);
        committedRange.set(value);
        expectModelValue(value);
        emit("update:modelValue", value);
        emit("change", value);
        return;
    }
    selectedIso.set(iso);
    syncSelectedDom(iso);
    expectModelValue(iso);
    emit("update:modelValue", iso);
    emit("change", iso);
};

const focusDay = (date: Date): void => {
    const iso = toIso(date);
    focusedIso.set(iso);
    viewedDate.set(
        dateService.adapter.create(
            dateService.adapter.getYear(date),
            dateService.adapter.getMonth(date),
        ),
    );
    queueMicrotask(() => {
        host.shadowRoot?.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`)?.focus();
    });
};

const onDayFocus = (event: Event): void => {
    const iso = (event.currentTarget as HTMLElement).dataset.date;
    if (iso) focusedIso.set(iso);
};

const onDayKeydown = (event: KeyboardEvent): void => {
    const iso = (event.currentTarget as HTMLElement).dataset.date;
    if (!iso) return;
    const current = parseDate(iso);
    let next = current;
    const firstDay = resolvedFirstDayOfWeek();

    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select(event);
        return;
    }

    let navigationStep = 0;
    if (event.key === "ArrowLeft") navigationStep = -1;
    else if (event.key === "ArrowRight") navigationStep = 1;
    else if (event.key === "ArrowUp") navigationStep = -7;
    else if (event.key === "ArrowDown") navigationStep = 7;
    else if (event.key === "Home") {
        next = dateService.adapter.add(
            current,
            -((dateService.adapter.getWeekday(current) - firstDay + 7) % 7),
            "day",
        );
    } else if (event.key === "End") {
        next = dateService.adapter.add(
            current,
            (firstDay + 6 - dateService.adapter.getWeekday(current) + 7) % 7,
            "day",
        );
    }
    else if (event.key === "PageUp" || event.key === "PageDown") {
        const monthOffset = event.key === "PageUp" ? -1 : 1;
        next = dateService.adapter.add(current, monthOffset, "month");
    } else if (!navigationStep) return;

    if (navigationStep) {
        next = dateService.adapter.add(current, navigationStep, "day");
        let attempts = 0;
        while (isDateDisabled(next) && attempts < 366) {
            next = dateService.adapter.add(next, Math.sign(navigationStep), "day");
            attempts += 1;
        }
    } else if (isDateDisabled(next)) {
        const direction = event.key === "PageUp" ? -1 : 1;
        let attempts = 0;
        while (isDateDisabled(next) && attempts < 31) {
            next = dateService.adapter.add(next, direction, "day");
            attempts += 1;
        }
    }

    event.preventDefault();
    focusDay(next);
};

const shiftMonth = (offset: number): void => {
    const date = viewedDate.value;
    const monthStart = dateService.adapter.create(
        dateService.adapter.getYear(date),
        dateService.adapter.getMonth(date),
    );
    const next = dateService.adapter.add(monthStart, offset, "month");
    viewedDate.set(next);
    emit("panel-change", next);
};

const shiftPeriod = (offset: number): void => {
    const date = viewedDate.value;
    if (view.value === "days") {
        shiftMonth(offset);
        return;
    }
    if (view.value === "months") {
        const monthStart = dateService.adapter.create(
            dateService.adapter.getYear(date),
            dateService.adapter.getMonth(date),
        );
        viewedDate.set(dateService.adapter.add(monthStart, offset, "year"));
        return;
    }
    yearPageStart.set(yearPageStart.value + offset * 12);
};

const showDays = (): void => view.set("days");

const showMonths = (): void => view.set(view.value === "months" ? "days" : "months");

const showYears = (): void => {
    yearPageStart.set(Math.floor(dateService.adapter.getYear(viewedDate.value) / 12) * 12);
    view.set(view.value === "years" ? "days" : "years");
};

const selectMonth = (event: Event): void => {
    const month = Number((event.currentTarget as HTMLElement).dataset.month);
    if (!Number.isFinite(month)) return;
    const date = viewedDate.value;
    viewedDate.set(dateService.adapter.create(dateService.adapter.getYear(date), month));
    showDays();
};

const selectYear = (event: Event): void => {
    const year = Number((event.currentTarget as HTMLElement).dataset.year);
    if (!Number.isFinite(year)) return;
    const date = viewedDate.value;
    viewedDate.set(dateService.adapter.create(year, dateService.adapter.getMonth(date)));
    view.set("months");
};

const isView = (candidate: CalendarView): boolean => view.value === candidate;
const dateFromCell = (cell: DayCell): Date => parseDate(cell.iso);
const renderDateCell = (cell: DayCell): CalendarRenderValue =>
    typeof props.renderDateCell === "function" ? props.renderDateCell(cell, dateFromCell(cell)) : cell.label;
const cellClass = (cell: DayCell): string =>
    typeof props.cellClassName === "function" ? String(props.cellClassName(dateFromCell(cell)) || "") : "";
const dayWeeks = (): DayCell[][] => {
    const cells = days();
    return Array.from({ length: 6 }, (_, index) => cells.slice(index * 7, index * 7 + 7));
};
const weekKey = (week: DayCell[]): string => week[0]?.iso || "week";
const weekNumber = (week: DayCell[]): number =>
    week[0] ? dateService.adapter.getWeekNumber(dateFromCell(week[0])) : 0;

useHostFlag("data-show-week-number", () => Boolean(props.showWeekNumber));

defineStyle(styles);

const Calendar = defineHtml<CalendarProps, Record<string, never>, CalendarSlots>(`
    <section class="calendar" part="calendar">
        <header class="header">
            <button class="nav" type="button" :aria-label=${locale.t("calendar.previousPeriod")} @click=${() => shiftPeriod(-1)}>
                <slot v-if=${isView("days")} name="prev-month">‹</slot>
                <slot v-else name="prev-year">‹</slot>
            </button>
            <div class="header-title">
                <template v-if=${isView("years")}>
                    <span class="period-label">${yearRangeTitle()}</span>
                </template>
                <template v-else>
                    <button class="period-button" type="button" @click=${showYears}>${yearTitle()}</button>
                    <button class="period-button" type="button" @click=${showMonths}>${monthLabel()}</button>
                </template>
            </div>
            <button class="nav" type="button" :aria-label=${locale.t("calendar.nextPeriod")} @click=${() => shiftPeriod(1)}>
                <slot v-if=${isView("days")} name="next-month">›</slot>
                <slot v-else name="next-year">›</slot>
            </button>
        </header>
        <div v-if=${isView("days")} class="calendar-body">
            <div :class=${["week", { "has-week-number": props.showWeekNumber }]}>
                <span v-if=${props.showWeekNumber} aria-hidden="true">#</span>
                <span v-for="name in weekDays()" :key="name">{{ name }}</span>
            </div>
            <div class="days" role="grid" :aria-label=${props.ariaLabel || "Calendar"}>
                <div v-for="(week, weekIndex) in dayWeeks()" :key="weekKey(week)" :class=${["week-row", { "has-week-number": props.showWeekNumber }]} role="row">
                    <span v-if=${props.showWeekNumber} class="week-number" :aria-label="'Week ' + weekNumber(week)">{{ weekNumber(week) }}</span>
                    <button
                        v-for="day in week"
                        :key="day.iso"
                        type="button"
                        :class="['day', cellClass(day), { 'is-muted': day.muted, 'is-current': day.current, 'is-disabled': day.disabled, 'is-range-start': day.rangeStart, 'is-range-end': day.rangeEnd, 'is-in-range': day.inRange }]"
                        :data-date="day.iso"
                        :disabled="day.disabled"
                        :aria-label="day.iso"
                        :aria-selected="day.current || day.rangeStart || day.rangeEnd ? 'true' : 'false'"
                        :tabindex="day.iso === focusedIso ? 0 : -1"
                        @click=${select}
                        @focus=${onDayFocus}
                        @keydown=${onDayKeydown}
                    >
                        <span v-if=${props.renderDateCell} class="date-cell-content" v-elf-calendar-cell="renderDateCell(day)"></span>
                        <slot v-else name="date-cell">{{ day.label }}</slot>
                    </button>
                </div>
            </div>
        </div>
        <div v-if=${isView("months")} class="choice-grid month-grid" :aria-label=${locale.t("calendar.selectMonth")}>
            <button
                v-for="option in monthItems()"
                :key="option.id"
                type="button"
                :class="['choice', { 'is-active': option.active }]"
                :data-month="option.id"
                @click=${selectMonth}
            >{{ option.label }}</button>
        </div>
        <div v-if=${isView("years")} class="choice-grid year-grid" :aria-label=${locale.t("calendar.selectYear")}>
            <button
                v-for="option in yearItems()"
                :key="option.id"
                type="button"
                :class="['choice', { 'is-active': option.active }]"
                :data-year="option.id"
                @click=${selectYear}
            >{{ option.id }}</button>
        </div>
        <footer class="calendar-footer">
            <button type="button" class="today-button" @click=${() => { viewedDate.set(dateService.adapter.now()); showDays(); }}>${locale.t("calendar.today")}</button>
            <slot name="header"><span class="month-title">${monthTitle()}</span></slot>
        </footer>
    </section>
`);

export { Calendar };
