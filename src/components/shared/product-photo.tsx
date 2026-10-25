import Image from 'next/image';

export default function ProductPhoto({ src, title }: { src?: string; title: string }) {
    return src ? <Image src={src} alt={title} width={160} height={160} unoptimized className="size-24 shrink-0 rounded-xl border bg-muted object-cover" /> : <div aria-hidden="true" className="flex size-24 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br from-gold-50 to-brand-50 text-xs text-muted-foreground">بدون عکس</div>;
}
