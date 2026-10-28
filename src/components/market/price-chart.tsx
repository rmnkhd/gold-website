// Statics And Types
import type { HistoryPoint } from '@/lib/price-history';

// Utils And Hooks
import { buildChart, compactPrice } from '@/lib/price-history';
import { jalaliLabel } from '@/lib/jalali-label';
import { formatPrice } from '@/utils/number';

const WIDTH = 640;
const HEIGHT = 260;

/**
 * نمودار خطی قیمت پایانی روزها به‌صورت SVG سمت سرور (بدون پکیج و بدون JS):
 * در HTML هست، سریع بارگذاری می‌شود و برای صفحه‌خوان با `title`/`desc` و جدول زیرش توصیف می‌شود.
 */
export default function PriceChart({
    points,
    title,
    currency,
}: {
    points: HistoryPoint[];
    title: string;
    currency: string;
}) {
    const chart = buildChart(points, { width: WIDTH, height: HEIGHT, padding: 20 });
    if (!chart) {
        return (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed bg-card p-6 text-center text-sm text-muted-foreground">
                برای رسم نمودار حداقل دو روز داده لازم است؛ تاریخچه هر روز کامل‌تر می‌شود.
            </div>
        );
    }
    const first = chart.points[0];
    const last = chart.points[chart.points.length - 1];
    const rising = last.close >= first.close;
    const stroke = rising ? 'stroke-success-500' : 'stroke-danger-500';
    const fill = rising ? 'fill-success-500/10' : 'fill-danger-500/10';
    const desc = `از ${jalaliLabel(first.day)} تا ${jalaliLabel(last.day)}؛ از ${formatPrice(first.close)} به ${formatPrice(last.close)} ${currency}؛ کمترین ${formatPrice(chart.min)} و بیشترین ${formatPrice(chart.max)}.`;
    return (
        <figure className="rounded-2xl border bg-card p-3">
            <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                role="img"
                aria-labelledby="price-chart-title price-chart-desc"
                className="h-auto w-full [direction:ltr]"
            >
                <title id="price-chart-title">{`نمودار ${title}`}</title>
                <desc id="price-chart-desc">{desc}</desc>
                {chart.yTicks.map((t) => (
                    <g key={t.y}>
                        <line x1={chart.padding} x2={WIDTH - chart.padding} y1={t.y} y2={t.y} className="stroke-border" strokeDasharray="4 4" />
                        <text x={WIDTH - chart.padding} y={t.y - 4} textAnchor="end" className="fill-muted-foreground text-[15px]">
                            {compactPrice(t.value)}
                        </text>
                    </g>
                ))}
                <path d={chart.area} className={fill} />
                <path d={chart.line} fill="none" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" className={stroke} />
                <circle cx={last.x} cy={last.y} r={4.5} className={rising ? 'fill-success-500' : 'fill-danger-500'} />
            </svg>
            <figcaption dir="ltr" className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{jalaliLabel(first.day)}</span>
                <span>{`قیمت پایانی روزانه (${currency})`}</span>
                <span>{jalaliLabel(last.day)}</span>
            </figcaption>
        </figure>
    );
}
