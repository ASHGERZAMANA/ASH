type RgbColor = {r?: number; g?: number; b?: number; a?: number} | null | undefined

export function rgbToCss(rgb: RgbColor): string | undefined {
  if (!rgb || rgb.r == null || rgb.g == null || rgb.b == null) return undefined
  const alpha = rgb.a == null ? 1 : rgb.a
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}
