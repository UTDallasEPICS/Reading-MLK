<script setup lang="ts">
definePageMeta({ ssr: false })

const { student, settings: globalSettings, saveSettings, loadStudent, restoreStudent } = useCurrentStudent()

if (!student.value) {
  await restoreStudent()
}

if (!student.value) {
  await loadStudent(1)
}

const settings = reactive({
  theme: globalSettings.value.theme,
  activeAnimations: globalSettings.value.activeAnimations,
  dyslexiaFont: globalSettings.value.dyslexiaFont,
  language: globalSettings.value.language,
  fontSize: globalSettings.value.fontSize,
})

const stats = computed(() => ({ xp: student.value?.exp ?? 0, booksRead: 14, streak: 5, tickets: 3 }))
const readerAppStyle = computed(() => buildReaderAppStyle(settings.theme, settings.fontSize))

const themeClass = computed(() => {
  const d = settings.dyslexiaFont ? 'dyslexia-font' : ''
  return `reader-app ${d}`.trim()
})

watch(settings, (newSettings) => {
  void saveSettings(newSettings)
}, { deep: true })

type ShopCatalogItem = {
  id: number
  type: 'theme' | 'animation'
  name: string
  cost: number
  owned: boolean
  class?: string
  previewBg?: string
  previewGrad?: string
}

const shopItems = ref<ShopCatalogItem[]>([])

const themeDefaults = computed(() => {
  const defaults = new Map(READER_THEME_OPTIONS.map((option) => [option.name, option]))
  return defaults
})

const normalizeShopItem = (item: any): ShopCatalogItem => {
  const themeDefaultsByName = themeDefaults.value.get(item.name)
  const themeEffect = item.themeEffect && typeof item.themeEffect === 'object' ? item.themeEffect : {}
  const animationEffect = item.animationEffect && typeof item.animationEffect === 'object' ? item.animationEffect : {}

  const isTheme = item.type === 'theme'
  const previewBg = String(
    themeEffect.previewBg
      ?? themeEffect.backgroundColor
      ?? themeDefaultsByName?.previewBg
      ?? '#ffffff'
  )
  const previewGrad = String(
    themeEffect.previewGrad
      ?? themeEffect.backgroundImage
      ?? themeDefaultsByName?.previewGrad
      ?? 'none'
  )
  const className = String(
    themeEffect.className
      ?? themeEffect.class
      ?? animationEffect.className
      ?? item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  )

  return {
    id: Number(item.id),
    type: isTheme ? 'theme' : 'animation',
    name: String(item.name),
    cost: Number(item.cost ?? 0),
    owned: Boolean(item.owned),
    class: isTheme ? className : undefined,
    previewBg: isTheme ? previewBg : undefined,
    previewGrad: isTheme ? previewGrad : undefined,
  }
}

const loadShopItems = async () => {
  if (!student.value?.id) {
    shopItems.value = []
    return
  }

  try {
    const items = await $fetch<any[]>(`/api/student/${student.value.id}/shop-items`)
    shopItems.value = (items ?? []).map(normalizeShopItem)
  } catch (error) {
    console.error('Failed to load shop items', error)
    shopItems.value = []
  }
}

watch(
  () => student.value?.id,
  async () => {
    await loadShopItems()
  },
  { immediate: true }
)

// ── Click badge animations ──
const xpClicked     = ref(false)
const ticketClicked = ref(false)
const burstCoins    = ref<{id:number;tx:number;ty:number}[]>([])
const flyTickets    = ref<number[]>([])

function triggerXpClick() {
  xpClicked.value = true
  burstCoins.value = [
    { id: Date.now(), tx:-32, ty:-40 }, { id: Date.now()+1, tx:0, ty:-48 }, { id: Date.now()+2, tx:32, ty:-40 }
  ]
  setTimeout(() => { xpClicked.value = false; burstCoins.value = [] }, 800)
}
function triggerTicketClick() {
  ticketClicked.value = true
  flyTickets.value = [Date.now()]
  setTimeout(() => { ticketClicked.value = false; flyTickets.value = [] }, 1000)
}

const showShopCelebration = ref('')

async function buyItem(item: ShopCatalogItem) {
  if (!student.value?.id) {
    alert('No active student selected.')
    return
  }

  try {
    const result = await $fetch<{ created: boolean; student?: { exp: number } }>(`/api/student/${student.value.id}/shop-items`, {
      method: 'POST',
      body: {
        shopItemId: item.id,
      },
    })

    if (typeof result?.student?.exp === 'number') {
      student.value.exp = result.student.exp
    }

    showShopCelebration.value = item.name
    setTimeout(() => { showShopCelebration.value = '' }, 2500)

    await loadShopItems()
    applyItem(item)
  } catch (error) {
    console.error('Failed to buy item', error)
    alert('Not enough XP or item unavailable yet.')
  }
}

function applyItem(item: ShopCatalogItem) {
  if (item.type === 'theme') {
    settings.theme = item.class
  } else if (item.type === 'animation') {
    if (settings.activeAnimations.includes(item.name)) {
      settings.activeAnimations = settings.activeAnimations.filter((name) => name !== item.name)
    } else {
      settings.activeAnimations = [...settings.activeAnimations, item.name]
    }
  }
}

</script>

<template>
  <div :class="themeClass" :style="readerAppStyle" class="pb-32 px-4 pt-4 min-h-screen">
    <ReaderAnimationLayer :active-animations="settings.activeAnimations" />

    <!-- ── TOP BAR ── -->
    <header class="max-w-4xl mx-auto flex justify-between items-center mb-8 px-2 relative z-[200]">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-heading font-bold text-2xl shadow-lg" style="background:var(--brand-indigo)">L</div>
        <div class="flex flex-col">
          <span class="font-heading font-bold text-2xl tracking-tight leading-none" style="color:var(--brand-dark)">Reading<span style="color:var(--brand-indigo)">Huddle</span></span>
          <span class="text-[10px] font-bold uppercase tracking-widest" style="color:var(--brand-mint)">Reading Buddy</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <!-- XP + Tickets -->
        <div class="relative bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border-2 flex items-center gap-3 cursor-pointer select-none"
             style="border-color:rgba(245,158,11,0.3)"
             :class="(xpClicked || ticketClicked) ? 'scale-90 transition-transform duration-100' : 'transition-transform duration-100'"
             @click="triggerXpClick">
          <span class="text-lg" :class="xpClicked ? 'animate-star-spin' : ''">🪙</span>
          <span class="font-heading font-bold text-amber-600">{{ stats.xp }}</span>
          <span class="text-gray-300">|</span>
          <span class="text-lg" :class="ticketClicked ? 'animate-ticket-wobble' : ''" @click.stop="triggerTicketClick">🎟️</span>
          <span class="font-heading font-bold" style="color:var(--brand-mint)">{{ stats.tickets }}</span>
          <span v-for="c in burstCoins" :key="c.id" class="absolute text-sm animate-coin-burst"
                :style="`--tx:${c.tx}px;--ty:${c.ty}px;left:50%;top:50%;`">🪙</span>
          <Transition name="box-pop">
            <span 
              v-if="ticketClicked"
              class="absolute -bottom-15 left-1/2 -translate-x-1/2 text-2xl animate-box-shake pointer-events-none">
              📦
            </span>
          </Transition>
          <span v-for="id in flyTickets" :key="id" class="absolute text-lg animate-ticket-fly pointer-events-none"
                style="left:50%;top:50%;transform:translateX(-50%) translateY(-50%)">🎟️</span>
        </div>
        <NuxtLink to="/reader"
          class="w-14 h-14 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-2xl border-2 border-white shadow-xl hover:scale-110 active:scale-95 transition-all"
          style="text-decoration:none">🏠</NuxtLink>
      </div>
    </header>

    <!-- ── MAIN ── -->
    <main class="max-w-4xl mx-auto min-h-[60vh]">

      <!-- ── SHOP ── -->
      <div class="space-y-8">

        <!-- Themes -->
        <div>
          <h3 class="text-xl font-black mb-4 pb-2 flex items-center gap-2" style="color:var(--brand-dark); border-bottom:4px solid rgba(224,96,77,0.2)">
            <span>🎨</span> THEMES
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div
              v-for="item in shopItems.filter(i => i.type === 'theme')" :key="item.id"
              @click="item.owned ? applyItem(item) : buyItem(item)"
              class="premium-card p-4 bg-white/80 cursor-pointer overflow-hidden transition-all hover:scale-105 active:scale-95"
              :style="settings.theme === item.class ? 'border:4px solid var(--brand-indigo)' : ''"
            >
              <div class="w-full aspect-square rounded-xl mb-3 shadow-inner border border-gray-100"
                   :style="`background-color:${item.previewBg}; background-image:${item.previewGrad !== 'none' ? item.previewGrad : ''}`" />
              <div class="flex items-center justify-between px-1">
                <span class="text-xs font-black truncate" style="color:var(--brand-dark)">{{ item.name }}</span>
                <span v-if="!item.owned" class="text-[9px] font-black p-1 rounded-lg" style="background:rgba(245,158,11,0.2); color:var(--brand-amber)">{{ item.cost }} XP</span>
                <span v-else-if="settings.theme === item.class" class="text-[9px] font-black" style="color:var(--brand-indigo)">EQUIPPED</span>
                <span v-else class="text-[9px] font-black" style="color:var(--brand-mint)">OWNED</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Animations -->
        <div>
          <h3 class="text-xl font-black mb-4 pb-2 flex items-center gap-2" style="color:var(--brand-dark); border-bottom:4px solid rgba(224,96,77,0.2)">
            <span>✨</span> ANIMATIONS
          </h3>
          <div class="space-y-3">
            <div
              v-for="item in shopItems.filter(i => i.type === 'animation')" :key="item.id"
              class="flex items-center justify-between p-4 rounded-2xl border-2 transition-all"
              :style="settings.activeAnimations.includes(item.name)
                ? 'border-color:var(--brand-mint); background:rgba(45,212,191,0.05)'
                : 'border-color:white; background:rgba(255,255,255,0.6)'"
            >
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">✨</div>
                <div>
                  <h4 class="font-black uppercase tracking-tight" style="color:var(--brand-dark)">{{ item.name }}</h4>
                  <p v-if="!item.owned" class="text-[10px] text-gray-500 font-bold">Requires {{ item.cost }} XP</p>
                  <p v-else class="text-[10px] font-bold" style="color:var(--brand-mint)">Active</p>
                </div>
              </div>
              <button v-if="!item.owned" @click="buyItem(item)"
                :disabled="stats.xp < item.cost"
                class="btn-fun px-6 py-2 rounded-xl font-black text-xs text-gray-900 active:scale-95 disabled:opacity-50"
                style="background:var(--brand-gold)">BUY</button>
              <button v-else @click="applyItem(item)"
                class="px-6 py-2 rounded-xl font-black text-xs transition-colors"
                :style="settings.activeAnimations.includes(item.name)
                  ? 'background:var(--brand-dark); color:white'
                  : 'background:white; color:var(--brand-dark)'">
                {{ settings.activeAnimations.includes(item.name) ? 'REMOVE' : 'EQUIP' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      
    </main>

    <!-- ── LEFT / RIGHT ARROWS ── -->
    <NuxtLink to="/reader/home"
      class="fixed right-2 top-1/2 -translate-y-1/2 z-[100] p-2 flex items-center gap-1 transition-all cursor-pointer group"
      style="color:rgba(224,96,77,0.6); text-decoration:none">
      <span class="text-sm font-bold uppercase tracking-wide">Home</span>
      <svg class="w-12 h-16 group-hover:translate-x-1 transition-transform drop-shadow-md" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </NuxtLink>

    <!-- ── SHOP PURCHASE CELEBRATION ── -->
    <Transition name="fade">
      <div v-if="showShopCelebration" class="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
        <div class="text-center animate-shop-pop">
          <div class="text-8xl mb-4">✨</div>
          <h2 class="font-heading text-4xl font-black text-white drop-shadow-lg">{{ showShopCelebration }}</h2>
          <p class="text-2xl text-white/80 font-bold drop-shadow-md mt-2">Unlocked! 🎉</p>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style>
@import './reader.css';
</style>
