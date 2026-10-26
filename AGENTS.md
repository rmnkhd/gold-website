# زرینه — سایت مردم (gold-front)

سایت عمومی PWA برای مشتریان: قیمت شفاف طلا، محاسبه‌گر اجرت/مالیات، فهرست فروشندگان معتبر، راهنما.

> ⚠️ قواعد کلانِ پروژه و **بودجه‌ی توکن** در `../gold-vault/AGENTS.md` است
> (Claude آن را از ریشه خودکار دارد؛ Codex اگر اینجا اجرا شده، یک بار بخواندش).
> پنل طلافروش در ریپوی جدا (`gold-panel`) است. پورت dev ‏3033. ساختار و الگوها مثل `dar-khaneh/amlaki-front`.

- **محتوا در `statics/`، نه داخل کامپوننت** (`statics/guides.ts` → `/guides/<slug>`).
- **داده**: `service/api/<feature>` → `api()` (API واقعی :8090). صفحات سئو همان توابع را سمت سرور با ISR ۶۰ ثانیه می‌خوانند و در خطا فهرست خالی می‌گیرند.
- **سئو از روز اول**: هر صفحه `generateMetadata` اختصاصی + JSON-LD (`components/seo/json-ld.tsx`) + ورودی در `sitemap.ts`.
- **PWA**: `app/manifest.ts`، `public/sw.js` (ثبت در `components/pwa/sw-register.tsx`)، صفحه‌ی `/offline`. ناوبری موبایل = نوار پایین (حس اپ)، دسکتاپ = هدر.
- هیچ فرمول قیمت/مالیاتی در فرانت نیست: محاسبه‌گر → `/v1/public/calculate` (پیش‌فرض‌ها از `/v1/public/calculator-config`)، برآورد قلم‌ها → فیلد `estimatedTotal` که سرور با نرخ همان فروشگاه می‌دهد.
- لاجوردی = سطوح/متن اصلی، طلایی = تأکید (CTA، نشان، عدد کلیدی).

```bash
yarn test 2>&1 | grep -E "^\s*not ok|^# (pass|fail)"
yarn typecheck 2>&1 | head -40
yarn lint 2>&1 | tail -30
yarn build 2>&1 | tail -30
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
