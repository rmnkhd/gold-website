// React
import Link from 'next/link';

// Statics And Types
import type { Seller } from '@/dto/market';

// Components
import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';

// Utils And Hooks
import { toPersianDigits } from '@/utils/number';

export default function SellerCard({ seller }: { seller: Seller }) {
    return (
        <Link
            href={`/sellers/${seller.slug}`}
            className="hover-lift block rounded-2xl border bg-card p-4"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate font-semibold">{seller.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Icon name="map-pin" className="size-3.5" />
                        {seller.city} · {seller.district}
                    </p>
                </div>
                {seller.verified ? (
                    <Badge variant="gold">
                        <Icon name="shield-check" />
                        تأییدشده
                    </Badge>
                ) : null}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-gold-700">
                    <Icon name="star" className="size-4 fill-gold-400 text-gold-400" />
                    {toPersianDigits(seller.rating)}
                    <span className="text-xs font-normal text-muted-foreground">
                        ({toPersianDigits(seller.reviewCount)} نظر)
                    </span>
                </span>
                {seller.specialties.map((s) => (
                    <Badge key={s} variant="secondary">
                        {s}
                    </Badge>
                ))}
            </div>
        </Link>
    );
}
