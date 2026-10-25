/**
 * `pasoonate` تایپ رسمی ندارد. فقط همان سطحی که واقعاً استفاده می‌شود اینجا
 * اعلام شده تا `strict` راضی بماند و `any` وارد پروژه نشود.
 */
declare module 'pasoonate' {
    interface CalendarManager {
        gregorian(dateTime?: string): CalendarManager;
        jalali(dateTime?: string): CalendarManager;
        format(pattern: string): string;
        getTimestamp(): number;
        getYear(): number;
        getMonth(): number;
        getDay(): number;
        getHour(): number;
        getMinute(): number;
        getSecond(): number;
        dayOfWeek(): number;
    }

    const Pasoonate: {
        make(timestamp?: number, timezoneOffset?: number): CalendarManager;
        setLocale(locale: string): void;
        getLocale(): string;
    };

    export default Pasoonate;
}
