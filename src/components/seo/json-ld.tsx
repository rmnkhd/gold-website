interface JsonLdProps {
    data: Record<string, unknown>;
}

/** داده‌ی ساخت‌یافته (schema.org) برای موتورهای جستجو */
export default function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            // محتوا از کد خودمان می‌آید (نه ورودی کاربر)
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
        />
    );
}
