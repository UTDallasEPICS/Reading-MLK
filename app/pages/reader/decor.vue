<script setup lang="ts">
definePageMeta({ ssr: false })

const settings = reactive({ theme: 'light', dyslexiaFont: false, language: 'en', fontSize: 1 })
const stats = reactive({ xp: 1250, booksRead: 14, streak: 5, tickets: 3 })

const themeClass = computed(() => {
  const t = settings.theme !== 'light' ? `theme-${settings.theme}` : ''
  const d = settings.dyslexiaFont ? 'dyslexia-font' : ''
  return `reader-app ${t} ${d}`.trim()
})

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

// ── Shop tabs ──
const decorTab = ref<'shop'|'badges'>('shop')

// ── Shop items — themes ──
const shopItems = ref([
  { id: 1,  type:'theme', name:'Light Bloom',   cost:0,   class:'light',  owned:true,  previewBg:'#f5ede3',  previewGrad:'radial-gradient(at 0% 0%, hsla(25,95%,75%,0.3) 0px, transparent 50%)' },
  { id: 2,  type:'theme', name:'Galaxy Night',  cost:500, class:'blue',   owned:false, previewBg:'#1f3b7c',  previewGrad:'radial-gradient(at 0% 0%, hsla(250,20%,20%,0.5) 0px, transparent 50%)' },
  { id: 3,  type:'theme', name:'Old Parchment', cost:300, class:'sepia',  owned:false, previewBg:'#f4ecd8',  previewGrad:'none' },
  { id: 10, type:'theme', name:'Sunset',        cost:100, class:'sunset', owned:false, previewBg:'#fff5f5',  previewGrad:'radial-gradient(at 0% 0%, hsla(10,90%,75%,0.25) 0px, transparent 50%)' },
  { id: 11, type:'theme', name:'Ocean',         cost:100, class:'ocean',  owned:false, previewBg:'#f0f9ff',  previewGrad:'radial-gradient(at 0% 0%, hsla(200,90%,75%,0.25) 0px, transparent 50%)' },
  { id: 12, type:'theme', name:'Forest',        cost:150, class:'forest', owned:false, previewBg:'#f0fdf4',  previewGrad:'radial-gradient(at 0% 0%, hsla(140,80%,70%,0.25) 0px, transparent 50%)' },
  { id: 13, type:'theme', name:'Candy',         cost:150, class:'candy',  owned:false, previewBg:'#fdf2f8',  previewGrad:'radial-gradient(at 0% 0%, hsla(330,90%,85%,0.35) 0px, transparent 50%)' },
  { id: 14, type:'theme', name:'Fire',          cost:150, class:'fire',   owned:false, previewBg:'#fff7ed',  previewGrad:'radial-gradient(at 30% 40%, hsla(20,95%,65%,0.3) 0px, transparent 50%)' },
  { id: 15, type:'theme', name:'Ice',           cost:150, class:'ice',    owned:false, previewBg:'#f0f9ff',  previewGrad:'radial-gradient(at 0% 0%, hsla(200,100%,95%,0.4) 0px, transparent 50%)' },
  { id: 4,  type:'animation', name:'Twinkling Stars',      cost:200,  owned:false },
  { id: 5,  type:'animation', name:'Confetti Rain',        cost:1000, owned:false },
  { id: 6,  type:'animation', name:'Magic Sparkles',       cost:400,  owned:false },
  { id: 7,  type:'animation', name:'Fireflies',            cost:400,  owned:false },
  { id: 8,  type:'animation', name:'Fluttering Butterflies', cost:500, owned:false },
  { id: 9,  type:'animation', name:'Falling Leaves',       cost:800,  owned:false },
])

const activeAnimations = ref<string[]>([])
const showShopCelebration = ref('')

function buyItem(item: any) {
  if (stats.xp >= item.cost) {
    stats.xp -= item.cost
    item.owned = true
    showShopCelebration.value = item.name
    setTimeout(() => { showShopCelebration.value = '' }, 2500)
    applyItem(item)
  } else {
    alert('Not enough XP!')
  }
}

function applyItem(item: any) {
  if (item.type === 'theme') {
    settings.theme = item.class
  } else if (item.type === 'animation') {
    if (activeAnimations.value.includes(item.name)) {
      activeAnimations.value = activeAnimations.value.filter(a => a !== item.name)
    } else {
      activeAnimations.value.push(item.name)
    }
  }
}

// ── Badges ──
const badges = ref([
  { id:1, name:'First Steps',   icon:'🐣', desc:'Read your first book',      unlocked:true  },
  { id:2, name:'Book Worm',     icon:'🐛', desc:'Read 10 books',             unlocked:true  },
  { id:3, name:'Form Master',   icon:'📝', desc:'Complete 5 weekly forms',   unlocked:false },
  { id:4, name:'Early Bird',    icon:'☀️', desc:'Read before 8am',           unlocked:true  },
  { id:5, name:'Night Owl',     icon:'🦉', desc:'Read after 8pm',            unlocked:false },
  { id:6, name:'Streak Star',   icon:'⭐', desc:'Get a 7 day streak',        unlocked:false },
  { id:7, name:'Raffle Champ',  icon:'🎫', desc:'Enter 3 raffles',           unlocked:true  },
  { id:8, name:'Super Sage',    icon:'🧙', desc:'Reach level 20',            unlocked:false },
])
</script>

<template>
  <div :class="themeClass" :style="`font-size:${settings.fontSize*16}px`" class="pb-32 px-4 pt-4 min-h-screen">

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
             :class="xpClicked ? 'scale-90' : ''"
             @click="triggerXpClick">
          <span class="text-lg" :class="xpClicked ? 'animate-star-spin' : ''">⭐</span>
          <span class="font-heading font-bold text-amber-600">{{ stats.xp }}</span>
          <span class="text-gray-300">|</span>
          <span class="text-lg" :class="ticketClicked ? 'animate-ticket-wobble' : ''" @click.stop="triggerTicketClick">🎟️</span>
          <span class="font-heading font-bold" style="color:var(--brand-mint)">{{ stats.tickets }}</span>
          <span v-for="c in burstCoins" :key="c.id" class="absolute text-sm animate-coin-burst"
                :style="`--tx:${c.tx}px;--ty:${c.ty}px;left:50%;top:50%;`">🪙</span>
          <Transition name="box-pop">
            <span v-if="ticketClicked" class="absolute -top-10 left-1/2 text-2xl animate-box-shake pointer-events-none">📦</span>
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

      <!-- Tab switcher -->
      <div class="flex gap-4 p-1 rounded-2xl border-2 border-white max-w-sm mx-auto mb-8" style="background:rgba(255,255,255,0.5); backdrop-filter:blur(10px)">
        <button @click="decorTab = 'shop'"
          class="flex-1 py-2 rounded-xl font-bold transition-all"
          :style="decorTab === 'shop' ? 'background:var(--brand-indigo); color:white' : 'color:#9ca3af'">Shop</button>
        <button @click="decorTab = 'badges'"
          class="flex-1 py-2 rounded-xl font-bold transition-all"
          :style="decorTab === 'badges' ? 'background:var(--brand-indigo); color:white' : 'color:#9ca3af'">Badges</button>
      </div>

      <!-- ── SHOP ── -->
      <div v-if="decorTab === 'shop'" class="space-y-8">

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
              :style="activeAnimations.includes(item.name)
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
                :style="activeAnimations.includes(item.name)
                  ? 'background:var(--brand-dark); color:white'
                  : 'background:white; color:var(--brand-dark)'">
                {{ activeAnimations.includes(item.name) ? 'REMOVE' : 'EQUIP' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── BADGES ── -->
      <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="badge in badges" :key="badge.id"
          class="premium-card p-6 flex flex-col items-center text-center gap-2 group"
          :class="badge.unlocked ? '' : 'opacity-40 grayscale'"
          :style="badge.unlocked ? 'border-color:var(--brand-gold)' : ''"
        >
          <div class="text-5xl group-hover:scale-110 transition duration-500">{{ badge.icon }}</div>
          <h4 class="font-heading font-bold text-lg leading-tight" style="color:var(--brand-dark)">{{ badge.name }}</h4>
          <p class="text-[10px] font-bold text-gray-400">{{ badge.desc }}</p>
          <div v-if="badge.unlocked" class="mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider" style="background:rgba(245,158,11,0.2); color:var(--brand-dark)">Unlocked</div>
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
