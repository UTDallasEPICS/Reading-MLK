import { computed } from 'vue'

export type ReaderThemeOption = {
  id: number
  name: string
  className: string
  cost: number
  previewBg: string
  previewGrad: string
  brandDark?: string
}

export const READER_THEME_OPTIONS: ReaderThemeOption[] = [
  {
    id: 1,
    name: 'Light Bloom',
    className: 'light',
    cost: 0,
    previewBg: '#f5ede3',
    previewGrad: 'radial-gradient(at 0% 0%, hsla(25,95%,75%,0.3) 0px, transparent 50%)',
  },
  {
    id: 2,
    name: 'Galaxy Night',
    className: 'blue',
    cost: 500,
    previewBg: '#1f3b7c',
    previewGrad: 'radial-gradient(at 0% 0%, hsla(250,20%,20%,0.5) 0px, transparent 50%)',
    brandDark: '#f8fafc',
  },
  {
    id: 3,
    name: 'Old Parchment',
    className: 'sepia',
    cost: 300,
    previewBg: '#f4ecd8',
    previewGrad: 'none',
    brandDark: '#433422',
  },
  {
    id: 10,
    name: 'Sunset',
    className: 'sunset',
    cost: 100,
    previewBg: '#fff5f5',
    previewGrad: 'radial-gradient(at 0% 0%, hsla(10,90%,75%,0.25) 0px, transparent 50%)',
  },
  {
    id: 11,
    name: 'Ocean',
    className: 'ocean',
    cost: 100,
    previewBg: '#f0f9ff',
    previewGrad: 'radial-gradient(at 0% 0%, hsla(200,90%,75%,0.25) 0px, transparent 50%)',
  },
  {
    id: 12,
    name: 'Forest',
    className: 'forest',
    cost: 150,
    previewBg: '#f0fdf4',
    previewGrad: 'radial-gradient(at 0% 0%, hsla(140,80%,70%,0.25) 0px, transparent 50%)',
  },
  {
    id: 13,
    name: 'Candy',
    className: 'candy',
    cost: 150,
    previewBg: '#fdf2f8',
    previewGrad: 'radial-gradient(at 0% 0%, hsla(330,90%,85%,0.35) 0px, transparent 50%)',
  },
  {
    id: 14,
    name: 'Fire',
    className: 'fire',
    cost: 150,
    previewBg: '#fff7ed',
    previewGrad: 'radial-gradient(at 30% 40%, hsla(20,95%,65%,0.3) 0px, transparent 50%)',
  },
  {
    id: 15,
    name: 'Ice',
    className: 'ice',
    cost: 150,
    previewBg: '#f0f9ff',
    previewGrad: 'radial-gradient(at 0% 0%, hsla(200,100%,95%,0.4) 0px, transparent 50%)',
  },
]

const DEFAULT_THEME_CLASS = 'light'

export const resolveReaderTheme = (themeClass?: string | null) => {
  const normalized = String(themeClass || '').trim().toLowerCase()

  return READER_THEME_OPTIONS.find((theme) => theme.className === normalized)
    ?? READER_THEME_OPTIONS.find((theme) => theme.className === DEFAULT_THEME_CLASS)
    ?? READER_THEME_OPTIONS[0]
}

export const buildReaderAppStyle = (themeClass: string | null | undefined, fontSize: number) => {
  const resolvedTheme = resolveReaderTheme(themeClass)
  const safeFontSize = Number.isFinite(fontSize) && fontSize > 0 ? fontSize : 1

  const style: Record<string, string> = {
    fontSize: `${safeFontSize * 16}px`,
    backgroundColor: resolvedTheme.previewBg,
    backgroundImage: resolvedTheme.previewGrad !== 'none' ? resolvedTheme.previewGrad : 'none',
  }

  if (resolvedTheme.brandDark) {
    style['--brand-dark'] = resolvedTheme.brandDark
  }

  return style
}

export const useReaderStoreThemes = () => {
  const themeOptions = computed(() => READER_THEME_OPTIONS)

  return {
    themeOptions,
  }
}
