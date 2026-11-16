<script setup lang="ts">
definePageMeta({ ssr: false })

import { shopCatalog } from '~~/shared/shop'
const { student, settings, loadStudent, restoreStudent } = useCurrentStudent()
const ownedIds = ref<number[]>([])
const busy = ref(false)
const ready = ref(false)
const shopError = ref('')
const stats = computed(() => ({ xp: student.value?.exp ?? 0 }))
onMounted(async () => {
  await restoreStudent()
  if (!student.value) { await navigateTo('/reader/profile'); return }
  try {
    await loadStudent(student.value.id)
    if (!student.value) { await navigateTo('/reader/profile'); return }
    ownedIds.value = await $fetch<number[]>(`/api/student/${student.value.id}/shop`)
    ready.value = true
  } catch { shopError.value = 'Could not load your purchases. Please reload to try again.' }
})


const themeClass = computed(() => {
  const t = settings.value.theme !== 'light' ? `theme-${settings.value.theme}` : ''
  const d = settings.value.dyslexiaFont ? 'dyslexia-font' : ''
  return `reader-app ${t} ${d}`.trim()
})

// ── Click badge animations ──
const xpClicked     = ref(false)
const burstCoins    = ref<{id:number;tx:number;ty:number}[]>([])

function triggerXpClick() {
  xpClicked.value = true
  burstCoins.value = [
    { id: Date.now(), tx:-32, ty:-40 }, { id: Date.now()+1, tx:0, ty:-48 }, { id: Date.now()+2, tx:32, ty:-40 }
  ]
  setTimeout(() => { xpClicked.value = false; burstCoins.value = [] }, 800)
}

// ── Shop items — themes ──
const shopItems = computed(() => shopCatalog.map(item => ({ ...item, owned: item.cost === 0 || ownedIds.value.includes(item.id) })))
const activeAnimations = computed(() => settings.value.activeAnimations)
const decorationSections = [
  { type: 'banner', title: 'BANNERS' },
  { type: 'sticker', title: 'STICKERS' },
] as const
function isDecorationEquipped(item: (typeof shopItems.value)[number]) {
  return item.type === 'banner' ? settings.value.activeBanner === item.name : settings.value.activeStickers.includes(item.name)
}
const showShopCelebration = ref('')
async function changeItem(item: (typeof shopItems.value)[number], action: 'buy' | 'equip') {
  if (busy.value || !ready.value || !student.value) return
  const studentId = student.value.id
  busy.value = true
  shopError.value = ''
  try {
    const result = await $fetch<{ student: NonNullable<typeof student.value>; ownedIds: number[]; purchased: boolean }>(`/api/student/${studentId}/shop`, {
      method: 'POST', body: { itemId: item.id, action },
    })
    if (student.value?.id !== studentId) return
    student.value = result.student
    ownedIds.value = result.ownedIds
    if (result.purchased) {
      showShopCelebration.value = item.name
      setTimeout(() => { showShopCelebration.value = '' }, 2500)
    }
  } catch (error: any) {
    shopError.value = error.data?.statusMessage || 'Could not save your selection. Please try again.'
  } finally { busy.value = false }
}
const buyItem = (item: (typeof shopItems.value)[number]) => changeItem(item, 'buy')
const applyItem = (item: (typeof shopItems.value)[number]) => changeItem(item, 'equip')

</script>

<template>
  <div :class="themeClass" class="pb-32 px-4 pt-4 min-h-screen">
    <ReaderEquippedBanner />
    <ReaderDecorations />
    <ReaderEffects />

    <!-- ── TOP BAR ── -->
    <header class="max-w-4xl mx-auto flex justify-between items-center mb-8 px-2 relative z-[200]">
      <div class="flex items-center gap-3">
        <NuxtLink to="/reader" aria-label="Go to Reading Buddy home">
          <img
            src="/reader-logo.png"
            alt="Reading Huddle"
            class="h-20 w-20 object-contain"
          />
        </NuxtLink>
      </div>
      <div class="flex items-center gap-3">
        <!-- XP -->
        <div class="relative bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border-2 flex items-center gap-3 cursor-pointer select-none"
             style="border-color:rgba(245,158,11,0.3)"
             :class="(xpClicked) ? 'scale-90 transition-transform duration-100' : 'transition-transform duration-100'"
             @click="triggerXpClick">
          <span class="text-lg" :class="xpClicked ? 'animate-star-spin' : ''">⭐️</span>
          <span class="font-heading font-bold text-amber-600">{{ stats.xp }}</span>
          <span v-for="c in burstCoins" :key="c.id" class="absolute text-sm animate-coin-burst"
                :style="`--tx:${c.tx}px;--ty:${c.ty}px;left:50%;top:50%;`">⭐️</span>
        </div>
        <NuxtLink
          to="/reader"
          aria-label="Home"
          class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4933d6] to-[#625cf3] shadow-xl transition-all hover:scale-110 active:scale-95"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" class="h-7 w-7" fill="white">
            <path d="M12 3.2a1.5 1.5 0 0 1 1.06.44l8.3 8.3a1.5 1.5 0 0 1-2.12 2.12L18 12.82V19a2 2 0 0 1-2 2h-3v-6h-2v6H8a2 2 0 0 1-2-2v-6.18l-1.24 1.24a1.5 1.5 0 1 1-2.12-2.12l8.3-8.3A1.5 1.5 0 0 1 12 3.2Z" />
          </svg>
        </NuxtLink>
      </div>
    </header>

    <!-- ── MAIN ── -->
    <main class="max-w-4xl mx-auto min-h-[60vh]">
      <p v-if="shopError" role="alert" class="mb-4 rounded-xl bg-red-50 p-4 text-red-700">{{ shopError }}</p>

      <!-- ── SHOP ── -->
      <div class="space-y-8">

        <!-- Themes -->
        <div>
          <h3 class="text-xl font-black mb-4 pb-2" style="color:var(--brand-dark); border-bottom:4px solid rgba(224,96,77,0.2)">
            THEMES
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <button
              type="button" :disabled="busy || !ready || (!item.owned && stats.xp < item.cost)"
              v-for="item in shopItems.filter(i => i.type === 'theme')" :key="item.id"
              @click="item.owned ? applyItem(item) : buyItem(item)"
              class="premium-card p-4 bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden transition-all hover:scale-105 active:scale-95"
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
            </button>
          </div>
        </div>

        <!-- Animations -->
        <div>
          <h3 class="text-xl font-black mb-4 pb-2 flex items-center gap-2" style="color:var(--brand-dark); border-bottom:4px solid rgba(224,96,77,0.2)">
            MOUSE TRAILS
          </h3>
          <div class="space-y-3">
            <div
              v-for="item in shopItems.filter(i => i.type === 'animation')" :key="item.id"
              class="flex items-center justify-between p-4 rounded-2xl border-2 transition-all"
              :style="activeAnimations.includes(item.name)
                ? 'border-color:var(--brand-mint); background:rgba(45,212,191,0.05)'
                : 'border-color:white; background:rgba(255,255,255,0.6)'"
            >
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 shrink-0 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <ReaderTrailIcon :name="item.name" />
                </div>
                <div>
                  <h4 class="font-black uppercase tracking-tight" style="color:var(--brand-dark)">{{ item.name }}</h4>
                  <p v-if="!item.owned" class="text-[10px] text-gray-500 font-bold">Requires {{ item.cost }} XP</p>
                  <p v-else class="text-[10px] font-bold" style="color:var(--brand-mint)">{{ activeAnimations.includes(item.name) ? 'Active' : 'Owned' }}</p>
                </div>
              </div>
              <button v-if="!item.owned" @click="buyItem(item)"
                :disabled="busy || !ready || stats.xp < item.cost"
                class="btn-fun px-6 py-2 rounded-xl font-black text-xs text-gray-900 active:scale-95 disabled:opacity-50"
                style="background:var(--brand-gold)">BUY</button>
              <button v-else :disabled="busy || !ready" @click="applyItem(item)"
                class="px-6 py-2 rounded-xl font-black text-xs transition-colors"
                :style="activeAnimations.includes(item.name)
                  ? 'background:var(--brand-dark); color:white'
                  : 'background:white; color:var(--brand-dark)'">
                {{ activeAnimations.includes(item.name) ? 'REMOVE' : 'EQUIP' }}
              </button>
            </div>
          </div>
        </div>
        <section v-for="section in decorationSections" :key="section.type">
          <h3 class="text-xl font-black mb-4 pb-2 flex items-center gap-2" style="color:var(--brand-dark); border-bottom:4px solid rgba(224,96,77,0.2)">
            {{ section.title }}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div v-for="item in shopItems.filter(i => i.type === section.type)" :key="item.id"
              class="premium-card p-4 bg-white/80 flex flex-col gap-3"
              :style="isDecorationEquipped(item) ? 'border-color:var(--brand-mint)' : ''">
              <div class="h-24 rounded-xl flex items-center justify-center overflow-hidden" :style="{ background: item.previewBg || '#fff8ef' }">
                <ReaderBanner v-if="item.type === 'banner'" :colors="item.colors || []" :variant="item.bannerStyle" />
                <NuxtImg v-else :src="item.image" :alt="item.name" class="h-full w-full object-contain p-1" width="128" height="128" format="webp" densities="1x 2x" loading="lazy" draggable="false" />
              </div>
              <h4 class="font-black text-sm" style="color:var(--brand-dark)">{{ item.name }}</h4>
              <span class="text-xs font-bold" :style="item.owned ? 'color:var(--brand-mint)' : 'color:var(--brand-amber)'">
                {{ item.owned ? (isDecorationEquipped(item) ? 'Equipped' : 'Owned') : `${item.cost} XP` }}
              </span>
              <button type="button" :disabled="busy || !ready || (!item.owned && stats.xp < item.cost)"
                @click="item.owned ? applyItem(item) : buyItem(item)"
                :aria-label="`${item.owned ? (isDecorationEquipped(item) ? 'Remove' : 'Equip') : 'Buy'} ${item.name}`"
                class="mt-auto px-4 py-2 rounded-xl font-black text-xs disabled:opacity-50 transition-transform active:scale-95"
                :style="isDecorationEquipped(item) ? 'background:var(--brand-dark); color:white' : 'background:var(--brand-gold); color:#111827'">
                {{ item.owned ? (isDecorationEquipped(item) ? 'REMOVE' : 'EQUIP') : 'BUY' }}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- ── LEFT / RIGHT ARROWS ── -->
    <NuxtLink to="/reader"
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
          <svg aria-hidden="true" viewBox="0 0 48 48" class="w-20 h-20 mx-auto mb-4" fill="none">
            <circle cx="24" cy="24" r="21" fill="#ecfdf5" stroke="#2dd4bf" stroke-width="3" />
            <path d="m14 24 7 7 14-15" stroke="#0f766e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <h2 class="font-heading text-4xl font-black text-white drop-shadow-lg">{{ showShopCelebration }}</h2>
          <p class="text-2xl text-white/80 font-bold drop-shadow-md mt-2">Unlocked!</p>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style>
@import './reader.css';
</style>
