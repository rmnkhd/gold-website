/**
 * محاسبه‌ی قیمت طلای ساخته‌شده (تابع خالص — بدون وابستگی به UI).
 *
 * فرمول رایج بازار ایران (فرض اولیه؛ پیش از انتشار با حسابدار صنف تطبیق داده شود):
 *   ارزش طلا = وزن × قیمت گرم همان عیار
 *   اجرت     = درصدی از ارزش طلا
 *   سود      = درصدی از (ارزش طلا + اجرت)
 *   مالیات   = ۹٪ فقط از (اجرت + سود) — نه از خودِ طلا
 * مبالغ تومان‌اند و هر جزء به عدد صحیح گرد می‌شود.
 */

export const GOLD_VAT_PERCENT = 9;
export const BASE_KARAT = 18;

export interface GoldPriceInput {
    weightGram: number;
    karat: number;
    /** قیمت هر گرم طلای ۱۸ عیار (تومان) */
    pricePerGram18: number;
    wagePercent: number;
    profitPercent: number;
    vatPercent?: number;
}

export interface GoldPriceBreakdown {
    pricePerGram: number;
    goldValue: number;
    wage: number;
    profit: number;
    vat: number;
    total: number;
}

export function pricePerGramForKarat(pricePerGram18: number, karat: number): number {
    return Math.round((pricePerGram18 * karat) / BASE_KARAT);
}

export function calcGoldPrice(input: GoldPriceInput): GoldPriceBreakdown {
    const { weightGram, karat, pricePerGram18, wagePercent, profitPercent } = input;
    const vatPercent = input.vatPercent ?? GOLD_VAT_PERCENT;

    if (!(weightGram > 0)) throw new Error('وزن باید بزرگ‌تر از صفر باشد');

    const pricePerGram = pricePerGramForKarat(pricePerGram18, karat);
    const goldValue = Math.round(weightGram * pricePerGram);
    const wage = Math.round((goldValue * wagePercent) / 100);
    const profit = Math.round(((goldValue + wage) * profitPercent) / 100);
    const vat = Math.round(((wage + profit) * vatPercent) / 100);

    return { pricePerGram, goldValue, wage, profit, vat, total: goldValue + wage + profit + vat };
}
