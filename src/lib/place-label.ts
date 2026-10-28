/** «شهر · محله»؛ محله‌ی خالی نقطه‌ی آویزان نمی‌سازد. */
export const placeLabel = (city: string, district?: string): string => {
    const d = district?.trim();
    return d ? `${city} · ${d}` : city;
};
