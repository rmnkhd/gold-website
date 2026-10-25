import { IRAN_CITIES, type IranCity } from '../statics/iran-cities.ts';

/** یکسان‌سازی املای فارسی/عربی برای مقایسه: ی/ک، آ→ا، حذف نیم‌فاصله، فاصله و اعراب */
export const normalizeFa = (value: string): string =>
    value
        .replace(/[يى]/g, 'ی')
        .replace(/ك/g, 'ک')
        .replace(/[آأإ]/g, 'ا')
        .replace(/[ً-ٰٟـ]/g, '')
        .replace(/[‌‏‎\s]+/g, '')
        .toLowerCase();

/** شهر را با نام (با هر املا) پیدا می‌کند؛ مقدار قدیمیِ آزاد که در فهرست نیست `undefined` است */
export const findCity = (name: string | undefined | null): IranCity | undefined => {
    const key = normalizeFa(name ?? '');
    if (!key) return undefined;
    return IRAN_CITIES.find((c) => normalizeFa(c.name) === key);
};

/** جست‌وجو: نام شهر با پیشوند، سپس میان‌واژه، سپس نام استان */
export const searchCities = (query: string): readonly IranCity[] => {
    const q = normalizeFa(query);
    if (!q) return IRAN_CITIES;
    const rank = (c: IranCity): number => {
        const n = normalizeFa(c.name);
        if (n.startsWith(q)) return 0;
        if (n.includes(q)) return 1;
        if (normalizeFa(c.province).includes(q)) return 2;
        return 3;
    };
    return IRAN_CITIES.map((c) => ({ c, r: rank(c) }))
        .filter((x) => x.r < 3)
        .sort((a, b) => a.r - b.r)
        .map((x) => x.c);
};
