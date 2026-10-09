import type { ReactNode } from 'react'

export interface IconProps {
  size?: number
  className?: string
}

function Svg({
  size = 18,
  className,
  fill = false,
  children,
}: IconProps & { fill?: boolean; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export const Sun = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
)

export const Moon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </Svg>
)

export const Github = ({ size = 18, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
  </svg>
)

export const Move = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
  </Svg>
)

export const Plus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const Link = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 12h6M8 7H6a5 5 0 0 0 0 10h2M16 7h2a5 5 0 0 1 0 10h-2" />
  </Svg>
)

export const Tag = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20.59 13.41 12 22 2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <path d="M7 7h.01" />
  </Svg>
)

export const Gauge = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 14 8 10M3.34 19a10 10 0 1 1 17.32 0" />
  </Svg>
)

export const Trash = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </Svg>
)

export const Refresh = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />
  </Svg>
)

export const First = ({ size = 18, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <path d="M20 19 10 12 20 5z" fill="currentColor" />
    <path d="M5 19V5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </svg>
)

export const Prev = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15 18l-6-6 6-6" />
  </Svg>
)

export const Next = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 6l6 6-6 6" />
  </Svg>
)

export const Last = ({ size = 18, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <path d="M4 5 14 12 4 19z" fill="currentColor" />
    <path d="M19 5v14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </svg>
)

export const Play = ({ size = 18, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <path d="M7 5.5v13l11-6.5z" fill="currentColor" />
  </svg>
)

export const Pause = ({ size = 18, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <rect x="6" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
    <rect x="14" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
  </svg>
)

export const Info = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </Svg>
)

export const Alert = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
  </Svg>
)

export const Sparkles = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
    <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" />
  </Svg>
)

export const Book = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </Svg>
)

export const MapIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 20 3 17V4l6 3 6-3 6 3v13l-6-3-6 3zM9 7v13M15 4v13" />
  </Svg>
)

export const Target = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.4" />
  </Svg>
)

export const External = (p: IconProps) => (
  <Svg {...p}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
  </Svg>
)

export const Logo = ({ size = 32, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
    <g stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity="0.92">
      <line x1="18" y1="46" x2="30" y2="20" />
      <line x1="30" y1="20" x2="48" y2="30" />
      <line x1="18" y1="46" x2="48" y2="30" />
      <line x1="30" y1="20" x2="46" y2="48" />
      <line x1="48" y1="30" x2="46" y2="48" />
    </g>
    <g fill="#fff">
      <circle cx="18" cy="46" r="6" />
      <circle cx="30" cy="20" r="6" />
      <circle cx="48" cy="30" r="6" />
      <circle cx="46" cy="48" r="6" />
    </g>
  </svg>
)
