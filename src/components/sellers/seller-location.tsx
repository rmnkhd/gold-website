// Components
import { Icon } from '@/components/icon';
import LocationMap from '@/components/map/location-map-lazy';
import { Button } from '@/components/ui/button';

interface SellerLocationProps {
    name: string;
    city: string;
    address: string;
    lat: number;
    lng: number;
}

/** نقشه‌ی فقط‌خواندنیِ فروشگاه با نشانگر و دکمه‌های مسیریابی (فقط وقتی مختصات ثبت شده) */
export default function SellerLocation({ name, city, address, lat, lng }: SellerLocationProps) {
    const routes = [
        { label: 'مسیریابی', href: `https://www.openstreetmap.org/directions?to=${lat}%2C${lng}` },
        {
            label: 'Google Maps',
            href: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
        },
        {
            label: 'بلد',
            href: `https://balad.ir/location?latitude=${lat}&longitude=${lng}&zoom=16`,
        },
    ];

    return (
        <section id="location" aria-labelledby="location-title" className="mt-6 scroll-mt-20">
            <h2 id="location-title" className="text-lg font-bold">
                موقعیت روی نقشه
            </h2>
            <p className="mt-1 mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Icon name="map-pin" className="size-4 text-gold-600" />
                {city}، {address}
            </p>
            <LocationMap
                lat={lat}
                lng={lng}
                center={{ lat, lng, zoom: 16 }}
                label={`موقعیت ${name} روی نقشه`}
                className="h-64 sm:h-80"
            />
            <div className="mt-3 flex flex-wrap gap-2">
                {routes.map((r, i) => (
                    <Button key={r.href} asChild variant={i === 0 ? 'gold' : 'outline'} size="sm">
                        <a href={r.href} target="_blank" rel="noopener noreferrer">
                            <Icon name="navigation" />
                            {r.label}
                        </a>
                    </Button>
                ))}
            </div>
        </section>
    );
}
