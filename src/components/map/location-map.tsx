'use client';

// React
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Statics And Types
import { MAP_ATTRIBUTION, MAP_TILE_URL, MAP_ZOOM } from '@/constants/map';

// Utils And Hooks
import { cn } from '@/lib/utils';

export interface LocationMapProps {
    /** موقعیت نشانگر؛ `null` یعنی ثبت‌نشده */
    lat: number | null;
    lng: number | null;
    /** مرکز و بزرگ‌نمایی وقتی نشانگر نیست (مثلاً مرکز شهر انتخاب‌شده) */
    center: { lat: number; lng: number; zoom: number };
    /** فقط وقتی داده شود نقشه قابل ویرایش است: کلیک یا کشیدن نشانگر */
    onPick?: (lat: number, lng: number) => void;
    label: string;
    className?: string;
}

/** گرد کردن به ۶ رقم اعشار (≈ ۰٫۱ متر) تا مقدار ذخیره‌شده تمیز باشد */
const round6 = (n: number) => Math.round(n * 1e6) / 1e6;

const PIN_HTML = `<svg viewBox="0 0 32 42" class="size-9 drop-shadow-md" aria-hidden="true"><path class="fill-gold-400 stroke-brand-900" stroke-width="2" d="M16 2C8.8 2 3 7.8 3 15c0 9.8 13 25 13 25s13-15.2 13-25C29 7.8 23.2 2 16 2z"/><circle class="fill-brand-900" cx="16" cy="15" r="5"/></svg>`;

/** نقشه‌ی تعاملی (leaflet) — فقط سمت مرورگر؛ از `location-map-lazy` بارگذاری می‌شود */
export default function LocationMap({
    lat,
    lng,
    center,
    onPick,
    label,
    className,
}: LocationMapProps) {
    const hostRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const pickRef = useRef(onPick);
    const [tilesFailed, setTilesFailed] = useState(false);

    useEffect(() => {
        pickRef.current = onPick;
    }, [onPick]);

    // ساخت نقشه فقط یک بار
    useEffect(() => {
        const host = hostRef.current;
        if (!host || mapRef.current) return;

        const map = L.map(host, { zoomControl: true, attributionControl: true }).setView(
            [lat ?? center.lat, lng ?? center.lng],
            lat !== null && lng !== null ? MAP_ZOOM.pin : center.zoom
        );
        map.attributionControl.setPrefix(
            '<a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">Leaflet</a>'
        );
        const tiles = L.tileLayer(MAP_TILE_URL, {
            attribution: MAP_ATTRIBUTION,
            maxZoom: 19,
        }).addTo(map);
        tiles.on('tileerror', () => setTilesFailed(true));
        tiles.on('load', () => setTilesFailed(false));

        map.on('click', (e: L.LeafletMouseEvent) => {
            pickRef.current?.(round6(e.latlng.lat), round6(e.latlng.lng));
        });
        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- فقط یک بار؛ تغییرها در افکت‌های پایین اعمال می‌شود
    }, []);

    // نشانگر و حرکت نقشه
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        if (lat === null || lng === null) {
            markerRef.current?.remove();
            markerRef.current = null;
            map.setView([center.lat, center.lng], center.zoom);
            return;
        }
        const point = L.latLng(lat, lng);
        if (!markerRef.current) {
            const marker = L.marker(point, {
                icon: L.divIcon({
                    className: '',
                    html: PIN_HTML,
                    iconSize: [36, 42],
                    iconAnchor: [18, 40],
                }),
                draggable: Boolean(pickRef.current),
                keyboard: false,
                title: label,
            }).addTo(map);
            marker.on('dragend', () => {
                const p = marker.getLatLng();
                pickRef.current?.(round6(p.lat), round6(p.lng));
            });
            markerRef.current = marker;
            map.setView(point, Math.max(map.getZoom(), MAP_ZOOM.pin));
        } else {
            markerRef.current.setLatLng(point);
            if (!map.getBounds().contains(point)) map.panTo(point);
        }
    }, [lat, lng, center.lat, center.lng, center.zoom, label]);

    return (
        <div
            className={cn(
                'relative isolate z-0 overflow-hidden rounded-xl border bg-muted',
                className
            )}
        >
            <div
                ref={hostRef}
                role="application"
                aria-label={label}
                dir="ltr"
                className={cn('size-full min-h-56', onPick && 'cursor-crosshair')}
            />
            {tilesFailed ? (
                <p className="pointer-events-none absolute inset-x-2 bottom-8 z-1000 rounded-md bg-card/90 px-2 py-1 text-center text-[11px] text-muted-foreground">
                    بارگذاری تصویر نقشه ممکن نشد؛ موقعیت انتخابی همچنان ثبت می‌شود.
                </p>
            ) : null}
        </div>
    );
}
