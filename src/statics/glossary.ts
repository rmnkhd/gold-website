/** واژه‌نامه‌ی طلا و جواهر (اطلاعات عمومی؛ عددهای قانونی را از منبع رسمی بگیرید). */
export interface GlossaryTerm {
    /** شناسه‌ی لنگر (`/glossary#<id>`) */
    id: string;
    term: string;
    /** نام‌های دیگر یا نوشتار جایگزین برای جست‌وجو */
    aliases?: string[];
    definition: string;
    /** راهنمای مرتبط (slug) */
    guide?: string;
}

export const GLOSSARY: GlossaryTerm[] = [
    { id: 'ojrat', term: 'اجرت', definition: 'دستمزد ساخت جواهر (طراحی، ریخته‌گری، پرداخت و نگین‌نشانی)؛ معمولاً درصدی از ارزش طلاست و باید روی فاکتور جدا بیاید.', guide: 'tafavot-ojrat-va-sud-forooshande' },
    { id: 'sud-forooshande', term: 'سود فروشنده', definition: 'بازده فروشنده بابت سرمایه‌ی در گردش و هزینه‌های فروش؛ معمولاً درصدی از مجموع طلا و اجرت و جدا از اجرت ساخت.', guide: 'tafavot-ojrat-va-sud-forooshande' },
    { id: 'ayar', term: 'عیار', definition: 'میزان خلوص طلا. ۲۴ عیار تقریباً خالص است و هر عیار کمتر یعنی سهم آلیاژ بیشتر؛ ۱۸ عیار یعنی ۷۵۰ قسمت طلای خالص در هزار قسمت.', guide: 'ayar-tala-chist' },
    { id: 'hezarom', term: 'هزارم', definition: 'شکل دیگر بیان عیار: تعداد قسمت‌های طلای خالص در هزار قسمت. ۱۸ عیار = ۷۵۰، ۲۱ عیار = ۸۷۵، ۲۲ عیار = ۹۱۶ و ۲۴ عیار = ۹۹۹ هزارم.', guide: 'ayar-tala-chist' },
    { id: 'aliyaj', term: 'آلیاژ', definition: 'ترکیب طلا با فلزهای دیگر (مثل مس و نقره) برای استحکام و رنگ؛ طلای ۲۴ عیار برای ساخت جواهر روزمره زیادی نرم است.' },
    { id: 'mesghal', term: 'مثقال', definition: 'واحد وزن سنتی طلا؛ حدود ۴٫۶۰۸ گرم و برابر ۲۴ نخود.', guide: 'vahedha-tala-mesghal-gram-sut' },
    { id: 'nokhod', term: 'نخود', definition: 'یک‌بیست‌وچهارم مثقال؛ حدود ۰٫۱۹۲ گرم.', guide: 'vahedha-tala-mesghal-gram-sut' },
    { id: 'sut', term: 'سوت', definition: 'یک‌صدم گرم در اصطلاح جواهرفروشی؛ «۵ گرم و ۲۰ سوت» یعنی ۵٫۲۰ گرم.', guide: 'vahedha-tala-mesghal-gram-sut' },
    { id: 'ounce', term: 'اونس', aliases: ['اونس طلا'], definition: 'واحد وزن در بازار جهانی طلا؛ حدود ۳۱٫۱ گرم. قیمت جهانی طلا به دلار و برای هر اونس اعلام می‌شود.', guide: 'chera-ghimat-tala-taghir-mikonad' },
    { id: 'sekke-emami', term: 'سکه‌ی تمام (امامی)', aliases: ['سکه امامی', 'سکه تمام'], definition: 'پرمعامله‌ترین سکه‌ی بازار؛ حدود ۸٫۱۳۳ گرم وزن با عیار ۹۰۰ (حدود ۷٫۳۲ گرم طلای خالص).', guide: 'sekke-va-shemsh' },
    { id: 'nim-sekke', term: 'نیم‌سکه', definition: 'سکه‌ای با حدود نصف وزن سکه‌ی تمام؛ برای هدیه و پس‌انداز با سرمایه‌ی کمتر.', guide: 'sekke-va-shemsh' },
    { id: 'rob-sekke', term: 'ربع‌سکه', definition: 'سکه‌ای با حدود یک‌چهارم وزن سکه‌ی تمام؛ رایج برای هدیه.', guide: 'sekke-va-shemsh' },
    { id: 'habab', term: 'حباب سکه', definition: 'اختلاف قیمت بازار سکه با ارزش ذاتی طلای داخل آن (وزن طلای خالص × قیمت ۲۴ عیار).', guide: 'habab-sekke-chist' },
    { id: 'shemsh', term: 'شمش', definition: 'قطعه‌ی طلا با وزن و عیار مشخص (معمولاً ۹۹۹ هزارم) که برای نگه‌داری ارزش خریداری می‌شود و اجرت ساخت ندارد.', guide: 'sekke-va-shemsh' },
    { id: 'tala-abshode', term: 'طلای آب‌شده', aliases: ['آبشده'], definition: 'طلای ذوب‌شده یا قابل ذوب بدون ارزش ساخت؛ مبنای قیمت‌گذاری بازار عمده و معاملات خرید و فروش طلای کهنه.', guide: 'foroosh-tala-dast-dovom' },
    { id: 'mazaneh', term: 'مظنه', definition: 'قیمت مرجعی که بازار برای طلای آب‌شده اعلام می‌کند؛ عیار و واحد مبنا (مثقال یا گرم) را همیشه از فروشنده بپرسید.' },
    { id: 'tala-dast-dovom', term: 'طلای دست‌دوم', aliases: ['طلای کهنه'], definition: 'جواهر یا طلای قبلاً فروخته‌شده؛ در فروش دوباره معمولاً فقط ارزش طلا محاسبه می‌شود و اجرت و سود اولیه بازنمی‌گردد.', guide: 'foroosh-tala-dast-dovom' },
    { id: 'vazn-nakhales', term: 'وزن کل و وزن طلا', definition: 'وزن کل شامل نگین و قطعات غیرطلایی است؛ مبنای قیمت طلا فقط وزن طلاست. در فاکتور هر دو باید جدا درج شوند.' },
    { id: 'avkhat', term: 'کار دست و کار ماشینی', definition: 'جواهر کار دست را زرگر می‌سازد و معمولاً اجرت بیشتری دارد؛ کار ماشینی تولید انبوه است و اجرت کمتری دارد.', guide: 'tafavot-ojrat-va-sud-forooshande' },
    { id: 'faktor', term: 'فاکتور تفکیک‌شده', definition: 'فاکتوری که ارزش طلا، اجرت، سود و مالیات را جدا می‌نویسد و وزن و عیار هر قلم را دارد؛ مدرک شما در بازخرید.', guide: 'faktor-tala-chist-va-che-bayad-dashte-bashad' },
    { id: 'maliat', term: 'مالیات بر ارزش افزوده', definition: 'در رویه‌ی رایج بازار روی اجرت و سود فروشنده حساب می‌شود و نه روی ارزش خودِ طلا. نرخ جاری را از منبع رسمی یا حسابدار بپرسید.', guide: 'ojrat-chist' },
    { id: 'bazkharid', term: 'بازخرید', definition: 'خرید دوباره‌ی جواهر توسط فروشنده؛ شرایط (کسر اجرت، ضریب قیمت) را پیش از خرید و مکتوب بپرسید.', guide: 'bazkharid-va-negahdari-tala' },
    { id: 'gavahi', term: 'گواهی جواهر', definition: 'برگه‌ی فروشگاه با وزن و عیار قطعه. گواهی زرینه فقط گفته‌ی فروشگاه را ثبت می‌کند و جایگزین ارزیابی رسمی نیست.', guide: 'tashkhis-tala-asl-az-bedeli' },
    { id: 'arzyabi', term: 'ارزیابی عیار', aliases: ['عیارسنجی'], definition: 'سنجش خلوص طلا با روش‌های آزمایشگاهی یا دستگاه‌های معتبر؛ آزمون خانگی نشان قطعی نیست.', guide: 'tashkhis-tala-asl-az-bedeli' },
    { id: 'rikhtegari', term: 'ریخته‌گری', definition: 'مرحله‌ی ساخت جواهر که طلای مذاب را در قالب می‌ریزند؛ بخشی از هزینه‌ی اجرت.' },
    { id: 'spread', term: 'اختلاف قیمت خرید و فروش', definition: 'فاصله‌ی قیمتی که فروشنده هنگام خرید از شما و فروش به شما می‌گذارد؛ هرچه بیشتر باشد، بازفروش کم‌بازده‌تر است.', guide: 'foroosh-tala-dast-dovom' },
    { id: 'nega', term: 'نگین', definition: 'سنگ یا قطعه‌ی تزئینی روی جواهر؛ وزن آن جدا از طلا ثبت می‌شود و در بازخرید معمولاً قیمت جداگانه دارد.' },
    { id: 'polak', term: 'مهر عیار', definition: 'نشان حک‌شده روی قطعه که عیار را اعلام می‌کند؛ تنها یک نشانه است و با فاکتور و ارزیابی معتبر کامل می‌شود.', guide: 'tashkhis-tala-asl-az-bedeli' },
];

export const getTerm = (id: string): GlossaryTerm | undefined => GLOSSARY.find((t) => t.id === id);
