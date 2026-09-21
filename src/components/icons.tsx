// Lightweight stroke-icon set (no external icon dependency) matching the
// reference app's thin-line style. Each icon accepts standard SVG props.
import type { SVGProps, ReactElement } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" /></svg>
);
export const ServicesIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" /></svg>
);
export const FamilyIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="9" cy="7" r="2.3" /><circle cx="16" cy="6" r="1.8" /><path d="M4 20v-2.5A3.5 3.5 0 0 1 7.5 14h3A3.5 3.5 0 0 1 14 17.5V20" /><path d="M15.3 14.3c2 .2 3.7 1.7 3.7 3.8V20" /></svg>
);
export const WorkersIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="7" r="2.3" /><circle cx="6" cy="8.5" r="1.8" /><circle cx="18" cy="8.5" r="1.8" /><path d="M8 20v-2a4 4 0 0 1 8 0v2" /><path d="M3 19.5v-1.2A3 3 0 0 1 6 15.3" /><path d="M21 19.5v-1.2a3 3 0 0 0-3-3" /></svg>
);
export const OtherIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3.5" y="3.5" width="7" height="7" rx="1.2" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.2" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.2" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.2" /></svg>
);
export const SettingsIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="3" /><path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.6V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.6 1h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z" /></svg>
);
export const BellIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" /><path d="M10 18.5a2 2 0 0 0 4 0" /></svg>
);
export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);
export const ChevronDown = (p: IconProps) => (
  <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
);
export const ChevronRight = (p: IconProps) => (
  <svg {...base(p)}><path d="m9 6 6 6-6 6" /></svg>
);
export const ChevronLeft = (p: IconProps) => (
  <svg {...base(p)}><path d="m15 6-6 6 6 6" /></svg>
);
export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const CopyIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="9" y="9" width="11" height="11" rx="1.5" /><path d="M5 15V5a1 1 0 0 1 1-1h10" /></svg>
);
export const GlobeIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.3 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.3-3.6-8.5S9.6 5.8 12 3.5Z" /></svg>
);

export const MessageIcon = (p: IconProps) => (
  <svg {...base(p)} viewBox="0 0 24 24">
    {/* Filled white message bubble */}
    <path
      d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5c-1.2 0-2.3-.3-3.3-.8L4 20l1.8-4.2A7.4 7.4 0 0 1 4.5 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"
      fill="white"
      stroke="none"
    />

    {/* Transparent-looking dots */}
    <circle cx="9" cy="11.5" r=".8" fill="currentColor" stroke="none" />
    <circle cx="12" cy="11.5" r=".8" fill="currentColor" stroke="none" />
    <circle cx="15" cy="11.5" r=".8" fill="currentColor" stroke="none" />
  </svg>
);

export const IdCardIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M6.5 15c.3-1.4 1.4-2.3 2.8-2.3s2.5.9 2.8 2.3M9.3 10.8a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z" /><path d="M15 9h4M15 12.5h4" /></svg>
);
export const DocumentIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M7 3.5h7l3.5 3.5V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" /><path d="M14 3.5V7h3.5M9 13h6M9 16.5h6" /></svg>
);
export const CarIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 16V11l2-4.5h12L20 11v5" /><path d="M4 16h16M6.5 16v2M17.5 16v2" /><circle cx="7.5" cy="16" r="1.2" /><circle cx="16.5" cy="16" r="1.2" /></svg>
);
export const MapIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" /><path d="M9 4v14M15 6v14" /></svg>
);
export const FingerprintIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5v3" /><path d="M12 3.5A8.5 8.5 0 0 0 3.5 12v3" /><path d="M7.5 20.5c-.7-1.8-1-3.5-1-5.5a5.5 5.5 0 0 1 11 0c0 1 0 2-.4 3" /><path d="M9.5 21c-.5-1.5-.8-3-.8-4.5a3.3 3.3 0 0 1 6.6 0c0 .8-.1 1.6-.3 2.3" /></svg>
);
export const PhotoIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="4.5" width="14" height="12" rx="1.5" /><circle cx="8" cy="9.5" r="1.5" /><path d="m4 15 4-3.5 3 2.5 3-3.5 3 3" /><path d="M17.5 8.5H21v9a1.5 1.5 0 0 1-1.5 1.5H8" /></svg>
);
export const HistoryIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 12a8 8 0 1 0 2.3-5.6" /><path d="M3.5 4v4h4" /><path d="M12 8v4l3 2" /></svg>
);
export const BoxIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M3.5 8 12 3.5 20.5 8 12 12.5 3.5 8Z" /><path d="M3.5 8v9L12 21l8.5-4V8" /><path d="M12 12.5V21" /></svg>
);
export const ShieldCheckIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6l7-2.5Z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const DonateIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 20s-7-4.4-7-9.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.5C19 15.6 12 20 12 20Z" /></svg>
);
export const LeafIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M5 19c8 1 13-4 14-13-9-1-14 4-14 13Z" /><path d="M5 19c2-4 5-7 9-9" /></svg>
);
export const BabyIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M6 20c0-3.5 2.7-6 6-6s6 2.5 6 6" /><path d="M10 8c.3.6.9 1 2 1s1.7-.4 2-1" /></svg>
);

export const VehicleIcon = (p: IconProps) => (
  <svg {...base(p)} viewBox="0 0 24 24">
    {/* Car silhouette — front view */}
    <path d="M5 9.5h14l1.4 7.2H3.6L5 9.5Z" />

    {/* Windshield */}
    <path d="M7 9.5 8.7 6h6.6L17 9.5" />

    {/* Side mirrors */}
    <path d="M5 10.5H3.5M19 10.5h1.5" />

    {/* Headlights */}
    <rect x="5" y="11.5" width="3" height="2.2" rx=".7" />
    <rect x="16" y="11.5" width="3" height="2.2" rx=".7" />

    {/* Front grille */}
    <path d="M9 15h6" />
    <path d="M10 16.7h4" />

    {/* Wheels */}
    <circle cx="6.2" cy="17.8" r="1.7" />
    <circle cx="17.8" cy="17.8" r="1.7" />

    {/* Wheel hubs */}
    <circle cx="6.2" cy="17.8" r=".5" fill="currentColor" stroke="none" />
    <circle cx="17.8" cy="17.8" r=".5" fill="currentColor" stroke="none" />
  </svg>
);


export const PoliceCarIcon = (p: IconProps) => (
  <svg {...base(p)} viewBox="0 0 24 24">
    {/* Emergency siren */}
    <path d="M9.5 6.2V4.5h5v1.7" />
    <path d="M10.2 4.5h3.6" />

    {/* Siren warning rays */}
    <path d="M7.5 5.2 6.4 4.1" />
    <path d="M16.5 5.2 17.6 4.1" />

    {/* Police car body — front view */}
    <path d="M5 9.5h14l1.4 7.2H3.6L5 9.5Z" />

    {/* Windshield */}
    <path d="M7 9.5 8.7 6.8h6.6L17 9.5" />

    {/* Side mirrors */}
    <path d="M5 10.5H3.5M19 10.5h1.5" />

    {/* Police headlights */}
    <rect x="5" y="11.5" width="3" height="2.2" rx=".7" />
    <rect x="16" y="11.5" width="3" height="2.2" rx=".7" />

    {/* Police grille */}
    <path d="M9 15h6" />
    <path d="M10 16.7h4" />

    {/* Police badge */}
    <path d="M12 13.2l.55 1.05 1.15.15-.85.82.2 1.15L12 15.8l-1.05.57.2-1.15-.85-.82 1.15-.15L12 13.2Z" />

    {/* Wheels */}
    <circle cx="6.2" cy="17.8" r="1.7" />
    <circle cx="17.8" cy="17.8" r="1.7" />

    {/* Wheel hubs */}
    <circle cx="6.2" cy="17.8" r=".5" fill="currentColor" stroke="none" />
    <circle cx="17.8" cy="17.8" r=".5" fill="currentColor" stroke="none" />
  </svg>
);


export const FingerprintAuthIcon = (p: IconProps) => (
  <svg {...base(p)} viewBox="0 0 24 24">
    {/* Outer fingerprint ridge */}
    <path d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5" />
    <path d="M2.5 12A9.5 9.5 0 0 1 12 2.5" />

    {/* Outer lower curves */}
    <path d="M2.7 14.5A9.4 9.4 0 0 0 9 22" />
    <path d="M21.3 14.5A9.4 9.4 0 0 1 15 22" />

    {/* Second ridge */}
    <path d="M5 13a7 7 0 1 1 14 0v1.5" />
    <path d="M5.2 15.5a7 7 0 0 0 2.2 4.2" />
    <path d="M18.8 15.5a7 7 0 0 1-2.2 4.2" />

    {/* Middle ridge */}
    <path d="M7.5 14a4.5 4.5 0 1 1 9 0v2" />
    <path d="M8.2 16.5a4.5 4.5 0 0 0 1.8 3" />
    <path d="M15.8 16.5a4.5 4.5 0 0 1-1.8 3" />

    {/* Central fingerprint loop */}
    <path d="M12 7.5a4.5 4.5 0 0 0-4.5 4.5" />
    <path d="M12 7.5a4.5 4.5 0 0 1 4.5 4.5" />

    {/* Fingerprint center */}
    <path d="M12 10a2 2 0 0 0-2 2v2.5" />
    <path d="M12 10a2 2 0 0 1 2 2v4.5" />

    {/* Center ridge */}
    <path d="M12 12v7.5" />

    {/* Bottom ridges */}
    <path d="M5.5 17a7 7 0 0 0 3.2 4" />
    <path d="M18.5 17a7 7 0 0 1-3.2 4" />
  </svg>
);


export const GunIcon = (p: IconProps) => (
  <svg {...base(p)} viewBox="0 0 24 24">
    {/* Barrel */}
    <path d="M3.5 8h11.8l3.2 2.5H13" />

    {/* Slide */}
    <path d="M5 8V5.8h9.8l2.2 2.2" />

    {/* Slide detail */}
    <path d="M7 5.8v2.2" />
    <path d="M14 6.2v1.8" />

    {/* Rear sight */}
    <path d="M4.2 5.8h2" />

    {/* Grip */}
    <path d="M13 10.5v3l-1.8 6.2H8l1.4-6.2v-3" />

    {/* Grip texture */}
    <path d="M9 15.2h3.3" />
    <path d="M8.7 16.5h3.2" />
    <path d="M8.4 17.8h2.9" />

    {/* Trigger guard */}
    <path d="M11.3 13.5h1.4a2.3 2.3 0 0 1 2.3 2.3" />

    {/* Trigger */}
    <path d="M12.8 14.1v1.5" />

    {/* Muzzle */}
    <path d="M18.5 8v2.5h2V8" />
  </svg>
);

export const PhotoAvatarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    {/* Circular avatar frame */}
    <circle cx="12" cy="12" r="9" />

    {/* Head */}
    <circle cx="12" cy="9.5" r="2.5" />

    {/* Shoulders */}
    <path d="M7.5 18c.6-2.5 2.2-4 4.5-4s3.9 1.5 4.5 4" />
  </svg>
);



export const iconMap: Record<string, (p: IconProps) => ReactElement> = {
  map: MapIcon,
  baby: BabyIcon,
  'id-card': IdCardIcon,
  'id-badge': IdCardIcon,
  fingerprint: FingerprintIcon,
  'fingerprint-auth': FingerprintAuthIcon,
  photo: PhotoIcon,
  'photo-avatar': PhotoAvatarIcon,
  car: CarIcon,
  vehicle: VehicleIcon,
  'police-car': PoliceCarIcon,
  gun: GunIcon,
  passport: GlobeIcon,
  history: HistoryIcon,
  box: BoxIcon,
  'shield-check': ShieldCheckIcon,
  donate: DonateIcon,
  leaf: LeafIcon,
};