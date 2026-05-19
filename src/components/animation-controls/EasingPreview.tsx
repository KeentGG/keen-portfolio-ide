import type { CubicBezier } from './easing'

interface EasingPreviewProps {
  ease: CubicBezier
  color: string
}

export function EasingPreview({ ease, color }: EasingPreviewProps) {
  const [x1, y1, x2, y2] = ease
  const w = 48
  const h = 28
  const pad = 2

  const x0 = pad
  const y0 = h - pad
  const xe = w - pad
  const ye = pad

  const cx1 = pad + x1 * (w - 2 * pad)
  const cy1 = (h - pad) - y1 * (h - 2 * pad)
  const cx2 = pad + x2 * (w - 2 * pad)
  const cy2 = (h - pad) - y2 * (h - 2 * pad)

  const strokeClass = color.replace('text-', 'stroke-')

  return (
    <svg width={w} height={h} className="shrink-0" aria-hidden="true">
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="currentColor" className="text-text-secondary/10" strokeWidth="0.5" />
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="currentColor" className="text-text-secondary/10" strokeWidth="0.5" />
      <line x1={x0} y1={y0} x2={cx1} y2={cy1} className={strokeClass} strokeWidth="0.5" opacity="0.3" />
      <line x1={xe} y1={ye} x2={cx2} y2={cy2} className={strokeClass} strokeWidth="0.5" opacity="0.3" />
      <path d={`M ${x0} ${y0} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${xe} ${ye}`} fill="none" className={strokeClass} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
