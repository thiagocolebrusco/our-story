<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { YearPage, Photo } from '../data/album'
import PhotoSlot from './PhotoSlot.vue'

const props = defineProps<{
  page: YearPage
  pageIndex: number
  total: number
  /** Year is fully complete (all photos revealed). Used for gift button. */
  unlocked: boolean
  /** Photo IDs already revealed before this mount (drives initial state). */
  preRevealed: string[]
  /** Whether navigating forward is allowed (false on last page when epilogue locked). */
  hasNext?: boolean
}>()

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
  (e: 'summary'): void
  (e: 'expand', photos: Photo[], idx: number): void
}>()

// ── Per-photo revealed state ─────────────────────────────────────────────────
const revealed = reactive(
  props.page.photos.map(p => props.preRevealed.includes(p.id))
)

// Sync if new photos are revealed externally (e.g. user already on this page
// when another pack unlocks a photo here — rare but handled correctly)
watch(() => props.preRevealed, (ids) => {
  props.page.photos.forEach((p, i) => {
    if (ids.includes(p.id)) revealed[i] = true
  })
})

// ── Expand / lightbox helpers ────────────────────────────────────────────────
function expandPhoto(photoIdx: number) {
  const revealedPhotos = props.page.photos.filter((_, i) => revealed[i])
  // Map the clicked photo's position to its index within revealedPhotos
  let revealedIdx = 0
  for (let i = 0; i < photoIdx; i++) {
    if (revealed[i]) revealedIdx++
  }
  emit('expand', revealedPhotos, revealedIdx)
}

// Gift popup state
const showGift = ref(false)
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

    <!-- Map button (top-right) -->
    <button class="map-btn" @click="$emit('summary')" aria-label="Ver todos os anos">
      <span class="map-icon">⊞</span>
    </button>

    <!-- Header -->
    <header class="page-header">
      <div class="year-number">{{ page.year }}</div>
      <div class="year-title">{{ page.title }}</div>
      <div v-if="page.subtitle" class="year-subtitle">{{ page.subtitle }}</div>
      <div class="header-rule"></div>
    </header>

    <!-- Photos -->
    <main class="photos-area" :class="[`layout-${page.photos.length}`, page.photos.length > 4 ? 'layout-many' : '']">
      <!-- Layout: 2 photos -->
      <template v-if="page.photos.length === 2">
        <div class="row center">
          <PhotoSlot
            v-for="(photo, i) in page.photos"
            :key="photo.id"
            :photo="photo"
            :index="i"
            :revealed="!!revealed[i]"
            @expand="expandPhoto(i)"
          />
        </div>
      </template>

      <!-- Layout: 3 photos -->
      <template v-else-if="page.photos.length === 3">
        <div class="row center">
          <PhotoSlot :photo="page.photos[0]!" :index="0" :revealed="!!revealed[0]" @expand="expandPhoto(0)" />
          <PhotoSlot :photo="page.photos[1]!" :index="1" :revealed="!!revealed[1]" @expand="expandPhoto(1)" />
        </div>
        <div class="row center solo">
          <PhotoSlot :photo="page.photos[2]!" :index="2" :revealed="!!revealed[2]" @expand="expandPhoto(2)" />
        </div>
      </template>

      <!-- Layout: 4 photos -->
      <template v-else-if="page.photos.length === 4">
        <div class="row center">
          <PhotoSlot :photo="page.photos[0]!" :index="0" :revealed="!!revealed[0]" @expand="expandPhoto(0)" />
          <PhotoSlot :photo="page.photos[1]!" :index="1" :revealed="!!revealed[1]" @expand="expandPhoto(1)" />
        </div>
        <div class="row center">
          <PhotoSlot :photo="page.photos[2]!" :index="2" :revealed="!!revealed[2]" @expand="expandPhoto(2)" />
          <PhotoSlot :photo="page.photos[3]!" :index="3" :revealed="!!revealed[3]" @expand="expandPhoto(3)" />
        </div>
      </template>

      <!-- Layout: 5+ photos (scrollable 2-column grid) -->
      <template v-else>
        <div class="photo-grid">
          <PhotoSlot
            v-for="(photo, i) in page.photos"
            :key="photo.id"
            :photo="photo"
            :index="i"
            :revealed="!!revealed[i]"
            @expand="expandPhoto(i)"
          />
        </div>
      </template>
    </main>

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
      <button
        v-if="hasNext !== false"
        class="nav-btn next"
        @click="$emit('next')"
        :aria-label="'Próxima página'"
      >›</button>
      <div v-else class="nav-placeholder"></div>
    </footer>

    <!-- Gift button — appears after unlock if page has a gift -->
    <Transition name="gift-pop">
      <button
        v-if="unlocked && page.gift"
        class="gift-btn"
        @click.stop="showGift = true"
        aria-label="Ver presente"
      >
        <span class="gift-icon">🎁</span>
      </button>
    </Transition>

    <!-- Gift popup -->
    <Transition name="gift-overlay-fade">
      <div v-if="showGift && page.gift" class="gift-overlay" @click.self="showGift = false">
        <div class="gift-card">
          <button class="gift-close" @click="showGift = false">✕</button>
          <div class="gift-image-wrap">
            <img :src="page.gift.image" :alt="page.gift.title || 'Presente'" class="gift-image" />
          </div>
          <div class="gift-body">
            <div class="gift-title">{{ page.gift.title || 'Um presente especial ♡' }}</div>
            <p class="gift-description">{{ page.gift.description }}</p>
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

/* ── Map button ── */
.map-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  background: rgba(107, 58, 42, 0.07);
  border: 1px solid rgba(107, 58, 42, 0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}
.map-btn:active { background: rgba(107, 58, 42, 0.14); }
.bg-blush .map-btn { border-color: rgba(122, 45, 61, 0.15); }

.map-icon {
  font-size: 15px;
  color: #8b5e52;
  line-height: 1;
}
.bg-blush .map-icon { color: #9e5e6a; }

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
  padding-top: 10px;
  padding-bottom: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  position: relative;
  z-index: 1;
}

.year-number {
  font-family: 'Playfair Display', serif;
  font-size: 34px;
  font-weight: 700;
  color: #6b3a2a;
  line-height: 1;
  letter-spacing: -1px;
}
.bg-blush .year-number { color: #7a2d3d; }

.year-title {
  font-family: 'Dancing Script', cursive;
  font-size: 16px;
  color: #8b5e52;
  text-align: center;
}
.bg-blush .year-title { color: #9e5e6a; }

.year-subtitle {
  font-family: 'Lato', sans-serif;
  font-size: 10px;
  font-weight: 300;
  color: #a88070;
  letter-spacing: 1px;
  text-align: center;
}

.header-rule {
  width: 50px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #c4973b55, transparent);
  margin-top: 4px;
}

/* Photos area */
.photos-area {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  z-index: 1;
  padding-bottom: 2px;
}

.row {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

/* Polaroid sizing by layout — larger than before to use the freed space */
.layout-2 .polaroid { width: 168px; }
.layout-3 .row:first-child .polaroid { width: 157px; }
.layout-3 .solo .polaroid { width: 172px; }
.layout-4 .polaroid { width: 155px; }

/* Layout: 5+ photos — scrollable 2-column grid */
.photos-area.layout-many {
  overflow: hidden;
}

.photo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 10px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 4px 4px 8px;
  justify-items: center;
  align-content: start;
  scrollbar-width: none;
}
.photo-grid::-webkit-scrollbar { display: none; }

.photo-grid .polaroid { width: 148px; }

/* Footer */
.page-footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0 10px;
  position: relative;
  z-index: 1;
}

.nav-btn {
  width: 36px;
  height: 36px;
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

.nav-placeholder { width: 36px; }

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

/* ── Gift button ── */
.gift-btn {
  position: absolute;
  bottom: 58px;
  right: 16px;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #5c1a2a, #3d0f1c);
  border: 1.5px solid #c4973b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 3px 12px rgba(92, 34, 53, 0.5), 0 0 0 3px rgba(196, 151, 59, 0.15);
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.15s, box-shadow 0.15s;
}
.gift-btn:active {
  transform: scale(0.93);
  box-shadow: 0 1px 6px rgba(92, 34, 53, 0.4);
}
.gift-icon { font-size: 20px; line-height: 1; }

@keyframes gift-entrance {
  0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
  60%  { transform: scale(1.15) rotate(5deg); opacity: 1; }
  80%  { transform: scale(0.92) rotate(-2deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
.gift-pop-enter-active { animation: gift-entrance 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.gift-pop-leave-active { transition: opacity 0.2s, transform 0.2s; }
.gift-pop-leave-to     { opacity: 0; transform: scale(0.8); }

/* ── Gift popup ── */
.gift-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 4, 8, 0.78);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 150;
  backdrop-filter: blur(3px);
  padding: 20px 16px;
}

.gift-card {
  width: 100%;
  max-width: 340px;
  background: linear-gradient(160deg, #2c1018 0%, #1e0a14 100%);
  border: 1.5px solid #c4973b;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(196,151,59,0.1);
  position: relative;
  animation: gift-card-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes gift-card-in {
  0%   { transform: scale(0.8) translateY(20px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

.gift-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  background: rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 50%;
  color: rgba(245, 230, 200, 0.6);
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  -webkit-tap-highlight-color: transparent;
}
.gift-close:active { background: rgba(0,0,0,0.6); }

.gift-image-wrap {
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
}

.gift-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gift-body {
  padding: 16px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gift-title {
  font-family: 'Dancing Script', cursive;
  font-size: 22px;
  color: #c4973b;
  letter-spacing: 0.3px;
  line-height: 1.2;
}

.gift-description {
  font-family: 'Lato', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: rgba(245, 230, 200, 0.82);
  line-height: 1.6;
  letter-spacing: 0.2px;
}

.gift-overlay-fade-enter-active { transition: opacity 0.2s ease; }
.gift-overlay-fade-leave-active { transition: opacity 0.18s ease; }
.gift-overlay-fade-enter-from, .gift-overlay-fade-leave-to { opacity: 0; }

</style>
