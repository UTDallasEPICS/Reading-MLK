export type ShopCatalogItem = {
  id: number
  type: 'theme' | 'animation' | 'banner' | 'sticker'
  name: string
  cost: number
  class?: string
  previewBg?: string
  previewGrad?: string
  image?: string
  colors?: readonly string[]
  bannerStyle?: 'rainbow' | 'sunny' | 'ocean'
}

export const shopCatalog: readonly ShopCatalogItem[] = [
  {
    id: 1,
    type: 'theme',
    name: 'Light Bloom',
    cost: 0,
    class: 'light',
    previewBg: '#f5ede3',
    previewGrad: 'radial-gradient(at 0% 0%, hsla(25,95%,75%,0.3) 0px, transparent 50%)',
  },
  {
    id: 2,
    type: 'theme',
    name: 'Galaxy Night',
    cost: 500,
    class: 'dark',
    previewBg: '#1f3b7c',
    previewGrad: 'radial-gradient(at 0% 0%, hsla(250,20%,20%,0.5) 0px, transparent 50%)',
  },
  {
    id: 3,
    type: 'theme',
    name: 'Old Parchment',
    cost: 300,
    class: 'sepia',
    previewBg: '#f4ecd8',
    previewGrad: 'none',
  },
  {
    id: 10,
    type: 'theme',
    name: 'Sunset',
    cost: 100,
    class: 'sunset',
    previewBg: '#fff5f5',
    previewGrad: 'radial-gradient(at 0% 0%, hsla(10,90%,75%,0.25) 0px, transparent 50%)',
  },
  {
    id: 11,
    type: 'theme',
    name: 'Ocean',
    cost: 100,
    class: 'ocean',
    previewBg: '#f0f9ff',
    previewGrad: 'radial-gradient(at 0% 0%, hsla(200,90%,75%,0.25) 0px, transparent 50%)',
  },
  {
    id: 12,
    type: 'theme',
    name: 'Forest',
    cost: 150,
    class: 'forest',
    previewBg: '#f0fdf4',
    previewGrad: 'radial-gradient(at 0% 0%, hsla(140,80%,70%,0.25) 0px, transparent 50%)',
  },
  {
    id: 13,
    type: 'theme',
    name: 'Candy',
    cost: 150,
    class: 'candy',
    previewBg: '#fdf2f8',
    previewGrad: 'radial-gradient(at 0% 0%, hsla(330,90%,85%,0.35) 0px, transparent 50%)',
  },
  {
    id: 14,
    type: 'theme',
    name: 'Fire',
    cost: 150,
    class: 'fire',
    previewBg: '#fff7ed',
    previewGrad: 'radial-gradient(at 30% 40%, hsla(20,95%,65%,0.3) 0px, transparent 50%)',
  },
  {
    id: 15,
    type: 'theme',
    name: 'Ice',
    cost: 150,
    class: 'ice',
    previewBg: '#f0f9ff',
    previewGrad: 'radial-gradient(at 0% 0%, hsla(200,100%,95%,0.4) 0px, transparent 50%)',
  },
  { id: 4, type: 'animation', name: 'Twinkling Stars', cost: 200 },
  { id: 5, type: 'animation', name: 'Confetti Rain', cost: 1000 },
  { id: 7, type: 'animation', name: 'Fireflies', cost: 400 },
  { id: 9, type: 'animation', name: 'Falling Leaves', cost: 800 },
  {
    id: 20,
    type: 'banner',
    name: 'Rainbow Party',
    cost: 200,
    bannerStyle: 'rainbow',
    previewBg: '#fff0f7',
    colors: ['#ff5e8a', '#ffc83d', '#32cda5', '#4599ff', '#a875ff', '#ff8b54'],
  },
  {
    id: 21,
    type: 'banner',
    name: 'Sunny Days',
    cost: 200,
    bannerStyle: 'sunny',
    previewBg: '#fff7db',
    colors: ['#ffbf24', '#ff774c', '#ffcf45', '#45c7ea'],
  },
  {
    id: 22,
    type: 'banner',
    name: 'Ocean Breeze',
    cost: 200,
    bannerStyle: 'ocean',
    previewBg: '#e8faff',
    colors: ['#18c4d5', '#ff9b90', '#ffbd45', '#5c9cff', '#b48cff', '#ffbd45'],
  },
  { id: 30, type: 'sticker', name: 'Dino Pal', cost: 100, image: '/stickers/dino-pal.png' },
  {
    id: 31,
    type: 'sticker',
    name: 'Space Explorer',
    cost: 150,
    image: '/stickers/space-explorer.png',
  },
  {
    id: 32,
    type: 'sticker',
    name: 'Rainbow Magic',
    cost: 100,
    image: '/stickers/rainbow-magic.png',
  },
  { id: 33, type: 'sticker', name: 'Book Buddy', cost: 100, image: '/stickers/book-buddy.png' },
  { id: 34, type: 'sticker', name: 'Reading Fox', cost: 150, image: '/stickers/reading-fox.png' },
]
