export interface HolidayClosure {
  id: string;
  /** Local calendar date YYYY-MM-DD */
  date: string;
  name: string;
  closed: boolean;
  observanceLabel?: string;
  footerText?: string;
}

/** Add rows here when the shop is closed; banner auto-hides the day after `date`. */
export const HOLIDAY_CLOSURES: HolidayClosure[] = [
  {
    id: "memorial-day-2026",
    date: "2026-05-25",
    name: "Memorial Day",
    closed: true,
    observanceLabel: "In Observance of Memorial Day",
    footerText: "We Honor & Remember",
  },
  {
    id: "independence-day-2026",
    date: "2026-07-04",
    name: "Independence Day",
    closed: true,
    observanceLabel: "In Observance of Independence Day",
    footerText: "We Honor & Remember",
  },
  {
    id: "labor-day-2026",
    date: "2026-09-07",
    name: "Labor Day",
    closed: true,
    observanceLabel: "In Observance of Labor Day",
  },
  {
    id: "thanksgiving-2026",
    date: "2026-11-26",
    name: "Thanksgiving",
    closed: true,
    observanceLabel: "In Observance of Thanksgiving",
  },
  {
    id: "christmas-2026",
    date: "2026-12-25",
    name: "Christmas",
    closed: true,
    observanceLabel: "In Observance of Christmas",
  },
];

export function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Show the closure banner on the holiday and any earlier days;
 * hide automatically starting the calendar day after the holiday.
 */
export function isHolidayNoticeActive(holidayDate: Date, now = new Date()): boolean {
  return startOfLocalDay(now).getTime() <= startOfLocalDay(holidayDate).getTime();
}

export function formatHolidayDate(isoDate: string): string {
  return parseLocalDate(isoDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** Nearest upcoming (or today) closed holiday that should still show a banner. */
export function getActiveHolidayClosure(
  closures = HOLIDAY_CLOSURES,
  now = new Date()
): HolidayClosure | null {
  const active = closures
    .filter((holiday) => holiday.closed && isHolidayNoticeActive(parseLocalDate(holiday.date), now))
    .sort(
      (a, b) =>
        parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime()
    );

  return active[0] ?? null;
}

export function getDismissStorageKey(holidayId: string): string {
  return `cars-holiday-dismissed-${holidayId}`;
}
