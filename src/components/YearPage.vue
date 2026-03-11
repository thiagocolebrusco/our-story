<script setup lang="ts">
import { ref, watch } from 'vue'
import type { YearPage } from '../data/album'
import PhotoSlot from './PhotoSlot.vue'

const props = defineProps<{
  page: YearPage
  pageIndex: number
  total: number
  unlocked: boolean
}>()

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
  (e: 'unlock'): void
}>()

// How many photos are currently visible (0 = none, up to page.photos.length)
const revealedCount = ref(props.unlocked ? props.page.photos.length : 0)

// If the page is already unlocked when mounted, show all immediately
watch(() => props.unlocked, (val) => {
  if (val) revealedCount.value = props.page.photos.length
})

// Pack overlay state
const showOverlay = ref(false)
const packPhase = ref<'in' | 'jiggle' | 'out'>('in')
const isOpening = ref(false)

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

async function openPack() {
  if (isOpening.value || props.unlocked) return
  isOpening.value = true

  // Save unlock to parent (persists in localStorage)
  emit('unlock')

  // Phase 1: pack card appears
  packPhase.value = 'in'
  showOverlay.value = true
  await sleep(850)

  // Phase 2: pack jiggles
  packPhase.value = 'jiggle'
  await sleep(650)

  // Phase 3: pack implodes
  packPhase.value = 'out'
  await sleep(380)

  showOverlay.value = false

  // Phase 4: photos pop in one by one
  for (let i = 0; i < props.page.photos.length; i++) {
    revealedCount.value = i + 1
    await sleep(370)
  }

  isOpening.value = false
}
</script>

<template>
  <div class="year-page" :class="[`bg-${page.bgTone}`, `deco-${page.decoration ?? 'none'}`]">

    <!-- Decorations -->
    <div v-if="page.decoration === 'hearts'" class="deco-items" aria-hidden="true">
      <span class="deco-item" style="top:8%; left:6%; font-size:12px; opacity:0.25; transform:rotate(-15deg)">♡</span>
      <span class="deco-item" style="top:12%; right:8%; font-size:9px; opacity:0.2; transform:rotate(10deg)">♡</span>
      <span class="deco-item" style="bottom:18%; left:4%; font-size:10px; opacity:0.18; transform:rotate(-8deg)">♡</span>
      <span class="deco-item" style="bottom:22%; right:5%; font-size:14px; opacity:0.22; transform:rotate(20deg)">♡</span>
    </div>
    <div v-if="page.decoration === 'stars'" class="deco-items" aria-hidden="true">
      <span class="deco-item" style="top:9%; left:7%; font-size:11px; opacity:0.22; transform:rotate(-10deg)">✦</span>
      <span class="deco-item" style="top:14%; right:6%; font-size:8px; opacity:0.18; transform:rotate(15deg)">★</span>
      <span class="deco-item" style="bottom:20%; left:5%; font-size:13px; opacity:0.2; transform:rotate(-5deg)">✦</span>
      <span class="deco-item" style="bottom:16%; right:7%; font-size:9px; opacity:0.22; transform:rotate(12deg)">★</span>
    </div>
    <div v-if="page.decoration === 'flowers'" class="deco-items" aria-hidden="true">
      <span class="deco-item" style="top:8%; left:5%; font-size:14px; opacity:0.2; transform:rotate(-12deg)">✿</span>
      <span class="deco-item" style="top:11%; right:7%; font-size:10px; opacity:0.18; transform:rotate(8deg)">❀</span>
      <span class="deco-item" style="bottom:19%; left:6%; font-size:12px; opacity:0.2; transform:rotate(-6deg)">✿</span>
      <span class="deco-item" style="bottom:15%; right:5%; font-size:11px; opacity:0.22; transform:rotate(18deg)">❀</span>
    </div>

    <!-- Header -->
    <header class="page-header">
      <div class="year-number">{{ page.year }}</div>
      <div class="year-title">{{ page.title }}</div>
      <div v-if="page.subtitle" class="year-subtitle">{{ page.subtitle }}</div>
      <div class="header-rule"></div>
    </header>

    <!-- Photos -->
    <main class="photos-area" :class="`layout-${page.photos.length}`">
      <!-- Layout: 2 photos -->
      <template v-if="page.photos.length === 2">
        <div class="row center">
          <PhotoSlot
            v-for="(photo, i) in page.photos"
            :key="photo.id"
            :photo="photo"
            :index="i"
            :revealed="revealedCount > i"
          />
        </div>
      </template>

      <!-- Layout: 3 photos -->
      <template v-else-if="page.photos.length === 3">
        <div class="row center">
          <PhotoSlot :photo="page.photos[0]!" :index="0" :revealed="revealedCount > 0" />
          <PhotoSlot :photo="page.photos[1]!" :index="1" :revealed="revealedCount > 1" />
        </div>
        <div class="row center solo">
          <PhotoSlot :photo="page.photos[2]!" :index="2" :revealed="revealedCount > 2" />
        </div>
      </template>

      <!-- Layout: 4 photos -->
      <template v-else-if="page.photos.length === 4">
        <div class="row center">
          <PhotoSlot :photo="page.photos[0]!" :index="0" :revealed="revealedCount > 0" />
          <PhotoSlot :photo="page.photos[1]!" :index="1" :revealed="revealedCount > 1" />
        </div>
        <div class="row center">
          <PhotoSlot :photo="page.photos[2]!" :index="2" :revealed="revealedCount > 2" />
          <PhotoSlot :photo="page.photos[3]!" :index="3" :revealed="revealedCount > 3" />
        </div>
      </template>
    </main>

    <!-- Open Pack button (visible only when locked) -->
    <Transition name="btn-fade">
      <div v-if="!unlocked && !isOpening" class="open-pack-wrap">
        <button class="open-pack-btn" @click="openPack">
          <span class="btn-icon">✦</span>
          <span class="btn-label">Abrir envelope</span>
          <span class="btn-icon">✦</span>
        </button>
      </div>
    </Transition>

    <!-- Navigation -->
    <footer class="page-footer">
      <button class="nav-btn prev" @click="$emit('prev')" :aria-label="'Página anterior'">‹</button>
      <div class="page-counter">
        <span class="counter-text">{{ pageIndex }} / {{ total }}</span>
        <div class="dots">
          <span
            v-for="i in Math.min(total, 7)"
            :key="i"
            class="dot"
            :class="{ active: i === Math.min(pageIndex, 7) || (i === 7 && pageIndex >= 7) }"
          ></span>
        </div>
      </div>
      <button class="nav-btn next" @click="$emit('next')" :aria-label="'Próxima página'">›</button>
    </footer>

    <!-- Pack opening overlay -->
    <Transition name="overlay-fade">
      <div v-if="showOverlay" class="pack-overlay">
        <div class="pack-card" :class="`pack-${packPhase}`">
          <div class="pack-shine"></div>
          <div class="pack-content">
            <div class="pack-top-label">Our Story</div>
            <div class="pack-year-text">{{ page.year }}</div>
            <div class="pack-deco">✦ ♡ ✦</div>
            <div class="pack-bottom-label">{{ page.title }}</div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.year-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
  position: relative;
  overflow: hidden;
}

/* Background tones */
.bg-cream { background: #fef9f0; }
.bg-blush { background: #fdf3f2; }

/* Subtle grain/texture feel */
.year-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.4;
}

/* Decorations */
.deco-items {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.deco-item {
  position: absolute;
  color: #8b5e52;
  font-style: normal;
}
.bg-blush .deco-item { color: #9e5e6a; }

/* Header */
.page-header {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  position: relative;
  z-index: 1;
}

.year-number {
  font-family: 'Playfair Display', serif;
  font-size: 44px;
  font-weight: 700;
  color: #6b3a2a;
  line-height: 1;
  letter-spacing: -1px;
}
.bg-blush .year-number { color: #7a2d3d; }

.year-title {
  font-family: 'Dancing Script', cursive;
  font-size: 18px;
  color: #8b5e52;
  text-align: center;
}
.bg-blush .year-title { color: #9e5e6a; }

.year-subtitle {
  font-family: 'Lato', sans-serif;
  font-size: 11px;
  font-weight: 300;
  color: #a88070;
  letter-spacing: 1px;
  text-align: center;
}

.header-rule {
  width: 60px;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, #c4973b55, transparent);
  margin-top: 6px;
}

/* Photos area */
.photos-area {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  position: relative;
  z-index: 1;
  padding-bottom: 4px;
}

.row {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
}

/* Polaroid sizing by layout */
.layout-2 .polaroid { width: 146px; }
.layout-3 .row:first-child .polaroid { width: 138px; }
.layout-3 .solo .polaroid { width: 155px; }
.layout-4 .polaroid { width: 138px; }

/* ── Open Pack button ── */
.open-pack-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 6px 0 2px;
  position: relative;
  z-index: 2;
}

.open-pack-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 26px;
  background: linear-gradient(135deg, #5c2235 0%, #7a2d3d 50%, #5c2235 100%);
  border: 1.5px solid #c4973b;
  border-radius: 30px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 3px 14px rgba(92, 34, 53, 0.45), inset 0 1px 0 rgba(255,255,255,0.1);
  position: relative;
  overflow: hidden;
  transition: transform 0.15s, box-shadow 0.15s;
}

.open-pack-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 35%,
    rgba(255, 255, 255, 0.12) 50%,
    transparent 65%
  );
  background-size: 200% 100%;
  animation: btn-shimmer 2s infinite;
}

@keyframes btn-shimmer {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}

.open-pack-btn:active {
  transform: scale(0.96);
  box-shadow: 0 1px 8px rgba(92, 34, 53, 0.4);
}

.btn-icon {
  font-size: 10px;
  color: #c4973b;
  opacity: 0.9;
}

.btn-label {
  font-family: 'Playfair Display', serif;
  font-size: 13px;
  font-style: italic;
  color: #f5e6c8;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.btn-fade-enter-active { transition: opacity 0.3s, transform 0.3s; }
.btn-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.btn-fade-enter-from  { opacity: 0; transform: translateY(8px); }
.btn-fade-leave-to    { opacity: 0; transform: translateY(8px); }

/* Footer */
.page-footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0 14px;
  position: relative;
  z-index: 1;
}

.nav-btn {
  width: 40px;
  height: 40px;
  background: none;
  border: 1.5px solid rgba(107, 58, 42, 0.25);
  border-radius: 50%;
  font-size: 22px;
  color: #8b5e52;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background 0.15s, border-color 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.nav-btn:active {
  background: rgba(107, 58, 42, 0.08);
  border-color: rgba(107, 58, 42, 0.5);
}
.bg-blush .nav-btn {
  border-color: rgba(122, 45, 61, 0.25);
  color: #9e5e6a;
}

.page-counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.counter-text {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  font-size: 10px;
  color: #a88070;
  letter-spacing: 1.5px;
}

.dots {
  display: flex;
  gap: 4px;
  align-items: center;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(107, 58, 42, 0.2);
  transition: background 0.2s, transform 0.2s;
}
.dot.active {
  background: #c4973b;
  transform: scale(1.3);
}

/* ── Pack Overlay ── */
.pack-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 5, 10, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(3px);
}

.overlay-fade-enter-active { transition: opacity 0.25s ease; }
.overlay-fade-leave-active { transition: opacity 0.3s ease; }
.overlay-fade-enter-from, .overlay-fade-leave-to { opacity: 0; }

/* Pack card */
.pack-card {
  width: 180px;
  height: 270px;
  background: linear-gradient(160deg, #5c1a2a 0%, #3d0f1c 40%, #2a0a14 100%);
  border: 1.5px solid #c4973b;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 0 40px rgba(196, 151, 59, 0.3),
    0 20px 60px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

/* Shine sweep */
.pack-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    125deg,
    transparent 30%,
    rgba(196, 151, 59, 0.15) 48%,
    rgba(255, 240, 180, 0.2) 50%,
    rgba(196, 151, 59, 0.15) 52%,
    transparent 70%
  );
  background-size: 250% 100%;
  animation: pack-shine-sweep 1.2s ease infinite;
}
@keyframes pack-shine-sweep {
  0%   { background-position: 200% center; }
  100% { background-position: -100% center; }
}

/* Gold border corners */
.pack-card::before {
  content: '';
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(196, 151, 59, 0.35);
  border-radius: 8px;
  pointer-events: none;
}

.pack-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
  padding: 16px;
  text-align: center;
}

.pack-top-label {
  font-family: 'Dancing Script', cursive;
  font-size: 20px;
  color: #c4973b;
  letter-spacing: 0.5px;
}

.pack-year-text {
  font-family: 'Playfair Display', serif;
  font-size: 52px;
  font-weight: 700;
  color: #f5e6c8;
  line-height: 1;
  letter-spacing: -2px;
  text-shadow: 0 0 20px rgba(196, 151, 59, 0.4);
}

.pack-deco {
  font-size: 12px;
  color: #c4973b;
  letter-spacing: 4px;
  opacity: 0.8;
}

.pack-bottom-label {
  font-family: 'Lato', sans-serif;
  font-size: 9px;
  font-weight: 300;
  color: rgba(245, 230, 200, 0.6);
  letter-spacing: 2px;
  text-transform: uppercase;
  max-width: 120px;
  line-height: 1.4;
}

/* ── Pack animation phases ── */

/* Phase: in — card bursts onto screen */
.pack-in {
  animation: pack-enter 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes pack-enter {
  0%   { transform: scale(0.1) rotate(-8deg); opacity: 0; }
  60%  { transform: scale(1.06) rotate(1deg); opacity: 1; }
  80%  { transform: scale(0.97) rotate(-0.5deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

/* Phase: jiggle — pack shakes like it's bursting */
.pack-jiggle {
  animation: pack-shake 0.6s ease both;
}
@keyframes pack-shake {
  0%   { transform: rotate(0deg) scale(1); }
  15%  { transform: rotate(-6deg) scale(1.03); }
  30%  { transform: rotate(7deg) scale(0.97); }
  45%  { transform: rotate(-5deg) scale(1.02); }
  60%  { transform: rotate(4deg) scale(0.98); }
  75%  { transform: rotate(-2deg) scale(1.01); }
  90%  { transform: rotate(2deg); }
  100% { transform: rotate(0deg) scale(1); }
}

/* Phase: out — pack implodes */
.pack-out {
  animation: pack-exit 0.35s cubic-bezier(0.55, 0, 1, 0.45) both;
}
@keyframes pack-exit {
  0%   { transform: scale(1) rotate(0deg); opacity: 1; }
  40%  { transform: scale(1.2) rotate(3deg); opacity: 0.9; filter: brightness(1.8); }
  100% { transform: scale(0) rotate(-5deg); opacity: 0; filter: brightness(3); }
}
</style>
