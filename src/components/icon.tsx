// Statics And Types
import {
    Bell,
    Heart,
    QrCode,
    CalendarClock,
    ArrowLeftRight,
    PiggyBank,
    Navigation,
    Crown,
    X,
    Send,
    LogOut,
    Minus,
    ShoppingBag,
    User,
    BookOpen,
    Clock,
    MapPin,
    ShieldCheck,
    Star,
    Download,
    Calculator,
    Check,
    ChevronLeft,
    Coins,
    Gem,
    Home,
    MessageCircle,
    Package,
    Phone,
    Plus,
    Receipt,
    Scale,
    Search,
    Sparkles,
    Store,
    TrendingDown,
    TrendingUp,
    Users,
    Wallet,
    LocateFixed,
    Info,
    WifiOff,
    TriangleAlert,
    Radio,
    ChevronDown,
    type LucideIcon,
} from 'lucide-react';

/**
 * رجیستری تایپ‌شده‌ی آیکون‌ها. `statics/` آیکون را با **نام** نگه می‌دارد، نه کامپوننت؛
 * نام نامعتبر خطای کامپایل می‌دهد. آیکون تازه؟ اول به `ICONS` اضافه‌اش کنید.
 */
export const ICONS = {
    bell: Bell,
    heart: Heart,
    qr: QrCode,
    calendar: CalendarClock,
    compare: ArrowLeftRight,
    'piggy-bank': PiggyBank,
    navigation: Navigation,
    crown: Crown,
    x: X,
    send: Send,
    'log-out': LogOut,
    minus: Minus,
    'shopping-bag': ShoppingBag,
    user: User,
    book: BookOpen,
    clock: Clock,
    download: Download,
    'map-pin': MapPin,
    'shield-check': ShieldCheck,
    star: Star,
    calculator: Calculator,
    check: Check,
    'chevron-left': ChevronLeft,
    coins: Coins,
    gem: Gem,
    home: Home,
    message: MessageCircle,
    package: Package,
    phone: Phone,
    plus: Plus,
    receipt: Receipt,
    scale: Scale,
    search: Search,
    sparkles: Sparkles,
    store: Store,
    'trending-down': TrendingDown,
    'trending-up': TrendingUp,
    users: Users,
    wallet: Wallet,
    'locate': LocateFixed,
    'info': Info,
    'wifi-off': WifiOff,
    'alert': TriangleAlert,
    'radio': Radio,
    'chevron-down': ChevronDown,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

interface IconProps {
    name: IconName;
    className?: string;
}

export function Icon({ name, className }: IconProps) {
    const Component = ICONS[name];
    return <Component className={className} aria-hidden="true" />;
}
