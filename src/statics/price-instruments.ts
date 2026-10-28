import type { MarketPrices } from '@/dto/market';

/** ابزارهای قیمتی که صفحه‌ی تاریخچه‌ی اختصاصی دارند (`/prices/<slug>`). */
export interface PriceInstrument {
    slug: string;
    /** کلید در پاسخ `/v1/public/prices` و `/v1/public/prices/history` */
    key: keyof Pick<MarketPrices, 'gold18' | 'gold24' | 'coinEmami' | 'coinHalf' | 'coinQuarter' | 'ounceUsd'>;
    /** «طلای ۱۸ عیار» */
    title: string;
    /** «هر گرم» */
    unit: string;
    currency: 'تومان' | 'دلار';
    /** توضیح کوتاه زیر عنوان و متا */
    intro: string;
    /** بخش «درباره‌ی این قیمت» — مفهومی و بی‌ادعای عددی */
    about: string[];
    /** راهنماهای مرتبط برای پیوند داخلی */
    guides: string[];
}

export const PRICE_INSTRUMENTS: PriceInstrument[] = [
    {
        slug: 'gold-18k',
        key: 'gold18',
        title: 'طلای ۱۸ عیار',
        unit: 'هر گرم',
        currency: 'تومان',
        intro: 'قیمت هر گرم طلای ۱۸ عیار؛ مبنای قیمت‌گذاری بیشتر جواهر ساخته‌شده و ست‌های روزمره.',
        about: [
            'طلای ۱۸ عیار یعنی در هر هزار قسمت آلیاژ، ۷۵۰ قسمت طلای خالص دارد. به‌خاطر استحکام بیشتر نسبت به ۲۴ عیار، بیشتر جواهر ساخته‌شده از این عیار است.',
            'قیمت هر گرم ۱۸ عیار مبنای محاسبه‌ی ارزش طلای یک جواهر است: وزن × قیمت روز. اجرت ساخت، سود فروشنده و مالیات روی آن اضافه می‌شود و در فاکتور باید جدا دیده شوند.',
        ],
        guides: ['ayar-tala-chist', 'ojrat-chist', 'ghimat-javaher-chegune-sakhte-mishavad'],
    },
    {
        slug: 'gold-24k',
        key: 'gold24',
        title: 'طلای ۲۴ عیار',
        unit: 'هر گرم',
        currency: 'تومان',
        intro: 'قیمت هر گرم طلای ۲۴ عیار؛ طلای تقریباً خالص برای شمش و پس‌انداز.',
        about: [
            'طلای ۲۴ عیار تقریباً خالص است (۹۹۹ هزارم). نرمی آن باعث می‌شود برای ساخت جواهر روزمره کمتر استفاده شود و بیشتر به‌شکل شمش یا قطعه‌ی سرمایه‌ای دیده شود.',
            'هنگام خرید شمش یا طلای ۲۴ عیار، عیار و وزن روی قطعه یا گواهی، و فاکتور فروشنده را حتماً بررسی کنید و شرایط بازخرید را از قبل بپرسید.',
        ],
        guides: ['sekke-va-shemsh', 'ayar-tala-chist', 'bazkharid-va-negahdari-tala'],
    },
    {
        slug: 'sekke-emami',
        key: 'coinEmami',
        title: 'سکه‌ی امامی',
        unit: 'هر سکه',
        currency: 'تومان',
        intro: 'قیمت سکه‌ی تمام بهار آزادی طرح امامی؛ پرمعامله‌ترین سکه‌ی بازار.',
        about: [
            'سکه‌ی امامی حدود ۸٫۱۳۳ گرم وزن و عیار ۹۰۰ دارد؛ یعنی حدود ۷٫۳۲ گرم طلای خالص. قیمت بازار آن معمولاً از ارزش ذاتی طلای داخل سکه بیشتر است و این اختلاف «حباب» نام دارد.',
            'قیمت سکه افزون بر قیمت طلا، از نرخ ارز و تقاضای بازار هم اثر می‌پذیرد؛ پس نسبت قیمت سکه به طلا همیشه ثابت نیست.',
        ],
        guides: ['sekke-va-shemsh', 'habab-sekke-chist', 'bazkharid-va-negahdari-tala'],
    },
    {
        slug: 'nim-sekke',
        key: 'coinHalf',
        title: 'نیم‌سکه',
        unit: 'هر سکه',
        currency: 'تومان',
        intro: 'قیمت نیم‌سکه (طرح بهار آزادی)؛ برای هدیه و پس‌انداز با سرمایه‌ی کمتر.',
        about: [
            'نیم‌سکه تقریباً نصف وزن سکه‌ی تمام را دارد. معامله‌ی آن کمتر از سکه‌ی تمام است و گاهی قیمت‌ش دیرتر به‌روز می‌شود؛ زمان آخرین به‌روزرسانی را ببینید.',
        ],
        guides: ['sekke-va-shemsh', 'habab-sekke-chist'],
    },
    {
        slug: 'rob-sekke',
        key: 'coinQuarter',
        title: 'ربع‌سکه',
        unit: 'هر سکه',
        currency: 'تومان',
        intro: 'قیمت ربع‌سکه (طرح بهار آزادی)؛ ورودی ارزان‌تر برای هدیه‌ی طلا.',
        about: [
            'ربع‌سکه تقریباً یک‌چهارم وزن سکه‌ی تمام را دارد و به‌دلیل قیمت کمتر، هدیه‌ی رایج است. حباب سکه‌های کوچک‌تر معمولاً نسبت به وزنشان بیشتر دیده می‌شود.',
        ],
        guides: ['sekke-va-shemsh', 'habab-sekke-chist', 'tala-hediye-va-kodak'],
    },
    {
        slug: 'ounce',
        key: 'ounceUsd',
        title: 'اونس جهانی طلا',
        unit: 'هر اونس',
        currency: 'دلار',
        intro: 'قیمت جهانی هر اونس طلا به دلار؛ مرجع اصلی روند قیمت طلا در همه‌ی بازارها.',
        about: [
            'اونس طلا (حدود ۳۱٫۱ گرم) مرجع جهانی قیمت‌گذاری طلاست. قیمت داخلی طلا تابع قیمت اونس و نرخ دلار است؛ پس بخش مهمی از نوسان بازار داخل کشور از همین‌جا می‌آید.',
        ],
        guides: ['chera-ghimat-tala-taghir-mikonad', 'ayar-tala-chist'],
    },
];

export const getInstrument = (slug: string): PriceInstrument | undefined => PRICE_INSTRUMENTS.find((i) => i.slug === slug);
