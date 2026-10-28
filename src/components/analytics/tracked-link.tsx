'use client';

// React
import { usePathname } from 'next/navigation';

// Statics And Types
import type { EventName } from '@/lib/analytics';

// Services
import { track } from '@/service/analytics';

// Utils And Hooks
import { panelLink } from '@/lib/analytics';

type AnchorRest = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>;

/** پیوند «ثبت‌نام طلافروش» در پنل؛ کلیک ثبت می‌شود و مبدأ در UTM همراه پیوند می‌رود. */
export function SellerCtaLink({ panelUrl, children, ...rest }: { panelUrl: string; children: React.ReactNode } & AnchorRest) {
    const pathname = usePathname();
    return (
        <a {...rest} href={panelLink(panelUrl, pathname)} onClick={() => track('seller_cta_click')}>
            {children}
        </a>
    );
}

/** پیوند معمولی که کلیکش با نام رویداد ثبت می‌شود (تماس، مسیریابی، …). */
export function TrackedAnchor({ event, href, children, ...rest }: { event: EventName; href: string; children: React.ReactNode } & AnchorRest) {
    return (
        <a {...rest} href={href} onClick={() => track(event)}>
            {children}
        </a>
    );
}
