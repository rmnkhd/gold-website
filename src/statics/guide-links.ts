/**
 * پیوند داخلی هر راهنما: راهنماهای هم‌موضوع (`related`) و صفحه‌های مرتبط (`links`).
 * قاعده‌ی سئو: هر راهنما به ابزار/قیمت/واژه‌نامه‌ی مرتبط لینک می‌دهد و ۲ تا ۳ راهنمای هم‌موضوع پیشنهاد می‌کند؛
 * یکپارچگی (مقصد موجود باشد) در `guides.test.ts` بررسی می‌شود.
 */
export interface GuideLinks {
    related: string[];
    links: { href: string; label: string }[];
}

const calc = { href: '/calculator', label: 'محاسبه‌گر قیمت جواهر' };
const compare = { href: '/compare', label: 'مقایسه‌ی قیمت میان فروشندگان' };
const sellers = { href: '/sellers', label: 'طلافروشان معتبر' };
const gloss = (id: string, label: string) => ({ href: `/glossary#${id}`, label });

export const GUIDE_LINKS: Record<string, GuideLinks> = {
    'ojrat-chist': {
        related: ['tafavot-ojrat-va-sud-forooshande', 'ghimat-javaher-chegune-sakhte-mishavad', 'faktor-tala-chist-va-che-bayad-dashte-bashad'],
        links: [calc, gloss('ojrat', 'معنی اجرت در واژه‌نامه'), { href: '/prices/gold-18k', label: 'قیمت و نمودار طلای ۱۸ عیار' }],
    },
    'checklist-kharid-tala': {
        related: ['faktor-tala-chist-va-che-bayad-dashte-bashad', 'tashkhis-tala-asl-az-bedeli', 'kharid-tala-online-va-nokat-amniyati'],
        links: [compare, sellers, gloss('faktor', 'فاکتور تفکیک‌شده یعنی چه؟')],
    },
    'zarineh-chegune-kar-mikonad': {
        related: ['kharid-tala-online-va-nokat-amniyati', 'checklist-kharid-tala', 'ojrat-chist'],
        links: [sellers, calc],
    },
    'ayar-tala-chist': {
        related: ['vahedha-tala-mesghal-gram-sut', 'tashkhis-tala-asl-az-bedeli', 'ghimat-javaher-chegune-sakhte-mishavad'],
        links: [gloss('ayar', 'معنی عیار'), gloss('hezarom', 'عیار و هزارم'), { href: '/prices/gold-24k', label: 'قیمت و نمودار طلای ۲۴ عیار' }],
    },
    'sekke-va-shemsh': {
        related: ['habab-sekke-chist', 'bazkharid-va-negahdari-tala', 'chera-ghimat-tala-taghir-mikonad'],
        links: [{ href: '/prices/sekke-emami', label: 'قیمت و نمودار سکه‌ی امامی' }, { href: '/prices/gold-24k', label: 'قیمت طلای ۲۴ عیار' }, gloss('shemsh', 'معنی شمش')],
    },
    'bazkharid-va-negahdari-tala': {
        related: ['foroosh-tala-dast-dovom', 'faktor-tala-chist-va-che-bayad-dashte-bashad', 'nigahdari-va-tamiz-kardan-jawaher-tala'],
        links: [gloss('bazkharid', 'معنی بازخرید'), sellers],
    },
    'ghimat-javaher-chegune-sakhte-mishavad': {
        related: ['ojrat-chist', 'tafavot-ojrat-va-sud-forooshande', 'checklist-kharid-tala'],
        links: [calc, { href: '/prices/gold-18k', label: 'قیمت امروز طلای ۱۸ عیار' }, compare],
    },
    'habab-sekke-chist': {
        related: ['sekke-va-shemsh', 'chera-ghimat-tala-taghir-mikonad', 'tala-hediye-va-kodak'],
        links: [{ href: '/prices/sekke-emami', label: 'تاریخچه‌ی قیمت سکه‌ی امامی' }, { href: '/prices/rob-sekke', label: 'قیمت ربع‌سکه' }, gloss('habab', 'معنی حباب')],
    },
    'tala-hediye-va-kodak': {
        related: ['habab-sekke-chist', 'sekke-va-shemsh', 'checklist-kharid-tala'],
        links: [{ href: '/prices/rob-sekke', label: 'قیمت ربع‌سکه' }, { href: '/prices/nim-sekke', label: 'قیمت نیم‌سکه' }, sellers],
    },
    'chera-ghimat-tala-taghir-mikonad': {
        related: ['habab-sekke-chist', 'sekke-va-shemsh', 'ayar-tala-chist'],
        links: [{ href: '/prices', label: 'همه‌ی قیمت‌ها و نمودارها' }, { href: '/prices/ounce', label: 'قیمت جهانی اونس' }, gloss('ounce', 'معنی اونس')],
    },
    'vahedha-tala-mesghal-gram-sut': {
        related: ['ayar-tala-chist', 'faktor-tala-chist-va-che-bayad-dashte-bashad', 'ghimat-javaher-chegune-sakhte-mishavad'],
        links: [gloss('mesghal', 'معنی مثقال'), gloss('sut', 'معنی سوت'), calc],
    },
    'tafavot-ojrat-va-sud-forooshande': {
        related: ['ojrat-chist', 'ghimat-javaher-chegune-sakhte-mishavad', 'foroosh-tala-dast-dovom'],
        links: [calc, compare, gloss('sud-forooshande', 'معنی سود فروشنده')],
    },
    'faktor-tala-chist-va-che-bayad-dashte-bashad': {
        related: ['checklist-kharid-tala', 'bazkharid-va-negahdari-tala', 'tafavot-ojrat-va-sud-forooshande'],
        links: [gloss('faktor', 'فاکتور تفکیک‌شده'), gloss('maliat', 'مالیات بر ارزش افزوده'), sellers],
    },
    'tashkhis-tala-asl-az-bedeli': {
        related: ['checklist-kharid-tala', 'ayar-tala-chist', 'kharid-tala-online-va-nokat-amniyati'],
        links: [gloss('arzyabi', 'ارزیابی عیار'), gloss('polak', 'مهر عیار'), sellers],
    },
    'kharid-tala-ezdevaj-va-set-aroosi': {
        related: ['tafavot-ojrat-va-sud-forooshande', 'checklist-kharid-tala', 'tala-hediye-va-kodak'],
        links: [compare, calc, sellers],
    },
    'foroosh-tala-dast-dovom': {
        related: ['bazkharid-va-negahdari-tala', 'tafavot-ojrat-va-sud-forooshande', 'faktor-tala-chist-va-che-bayad-dashte-bashad'],
        links: [gloss('tala-dast-dovom', 'طلای دست‌دوم'), gloss('spread', 'اختلاف قیمت خرید و فروش'), { href: '/prices/gold-18k', label: 'قیمت امروز طلای ۱۸ عیار' }],
    },
    'kharid-tala-online-va-nokat-amniyati': {
        related: ['zarineh-chegune-kar-mikonad', 'checklist-kharid-tala', 'tashkhis-tala-asl-az-bedeli'],
        links: [sellers, compare],
    },
    'nigahdari-va-tamiz-kardan-jawaher-tala': {
        related: ['bazkharid-va-negahdari-tala', 'checklist-kharid-tala', 'faktor-tala-chist-va-che-bayad-dashte-bashad'],
        links: [sellers, gloss('nega', 'معنی نگین')],
    },
};
