// React
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Statics And Types
import { SITE_URL } from '@/constants/brand';

// Components
import { TrackedAnchor } from '@/components/analytics/tracked-link';
import { Icon } from '@/components/icon';
import JsonLd from '@/components/seo/json-ld';
import BookingForm from '@/components/sellers/booking-form';
import FavoriteButton from '@/components/sellers/favorite-button';
import OrderPanel from '@/components/sellers/order-panel';
import ReviewsSection from '@/components/sellers/reviews-section';
import SellerLocation from '@/components/sellers/seller-location';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Services
import { getSellerBySlug, getSellers } from '@/service/api/market';

// Utils And Hooks
import { breadcrumbLd, OG_IMAGE, pageMetadata } from '@/lib/seo';
import { toPersianDigits } from '@/utils/number';

interface SellerPageProps {
    params: Promise<{ slug: string }>;
}

/** ISR: صفحه‌ی هر فروشنده در اولین بازدید ساخته و هر ۶۰ ثانیه تازه می‌شود */
export const revalidate = 60;

export async function generateStaticParams() {
    const sellers = (await getSellers()).data ?? [];
    return sellers.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: SellerPageProps): Promise<Metadata> {
    const { slug } = await params;
    const seller = await getSellerBySlug(slug);
    if (!seller) return {};
    return pageMetadata({
        title: `${seller.name} — طلافروشی در ${seller.city}`,
        description: `${seller.about} نشانی: ${seller.address}. ساعت کاری: ${seller.hours}.`,
        path: `/sellers/${seller.slug}`,
    });
}

export default async function SellerPage({ params }: SellerPageProps) {
    const { slug } = await params;
    const seller = await getSellerBySlug(slug);
    if (!seller) notFound();

    return (
        <main className="container-page py-8">
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'JewelryStore',
                    '@id': `${SITE_URL}/sellers/${seller.slug}#store`,
                    name: seller.name,
                    description: seller.about,
                    url: `${SITE_URL}/sellers/${seller.slug}`,
                    image: `${SITE_URL}${OG_IMAGE.url}`,
                    telephone: seller.phone,
                    ...(seller.lat !== null && seller.lng !== null
                        ? { geo: { '@type': 'GeoCoordinates', latitude: seller.lat, longitude: seller.lng } }
                        : {}),
                    address: {
                        '@type': 'PostalAddress',
                        addressLocality: seller.city,
                        streetAddress: seller.address,
                        addressCountry: 'IR',
                    },
                    openingHours: seller.hours,
                    ...(seller.reviewCount > 0
                        ? {
                              aggregateRating: {
                                  '@type': 'AggregateRating',
                                  ratingValue: seller.rating,
                                  reviewCount: seller.reviewCount,
                              },
                          }
                        : {}),
                }}
            />

            <JsonLd
                data={breadcrumbLd([
                    { name: 'طلافروشان معتبر', path: '/sellers' },
                    { name: seller.name, path: `/sellers/${seller.slug}` },
                ])}
            />

            <section className="bg-navy-glow rounded-2xl p-6 text-white">
                <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-extrabold">{seller.name}</h1>
                    {seller.verified ? (
                        <Badge variant="gold">
                            <Icon name="shield-check" />
                            تأییدشده
                        </Badge>
                    ) : null}
                    <span className="ms-auto">
                        <FavoriteButton target={{ kind: 'shop', slug: seller.slug }} onDark />
                    </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-brand-200">{seller.about}</p>
                <ul className="mt-4 space-y-2 text-sm text-brand-100">
                    <li className="flex items-center gap-2">
                        <Icon name="map-pin" className="size-4 text-gold-300" />
                        {seller.address}
                    </li>
                    <li className="flex items-center gap-2">
                        <Icon name="clock" className="size-4 text-gold-300" />
                        {seller.hours}
                    </li>
                    <li className="flex items-center gap-2">
                        <Icon name="star" className="size-4 fill-gold-400 text-gold-400" />
                        {toPersianDigits(seller.rating)} ({toPersianDigits(seller.reviewCount)} نظر)
                    </li>
                </ul>
                <div className="mt-5 flex flex-wrap gap-3">
                    <Button asChild variant="gold" size="lg">
                        <TrackedAnchor event="phone_click" href={`tel:${seller.phone}`}>
                            <Icon name="phone" />
                            تماس با فروشگاه
                        </TrackedAnchor>
                    </Button>
                    {seller.lat !== null && seller.lng !== null ? (
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="bg-white/10 text-white hover:bg-white/20"
                        >
                            <a href="#location">
                                <Icon name="navigation" />
                                موقعیت روی نقشه
                            </a>
                        </Button>
                    ) : null}
                </div>
            </section>

            {seller.lat !== null && seller.lng !== null ? (
                <SellerLocation
                    name={seller.name}
                    city={seller.city}
                    address={seller.address}
                    lat={seller.lat}
                    lng={seller.lng}
                />
            ) : null}

            <BookingForm slug={seller.slug} />

            <OrderPanel seller={seller} />

            <ReviewsSection slug={seller.slug} />
        </main>
    );
}
