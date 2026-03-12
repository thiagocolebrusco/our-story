<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { YearPage } from '../data/album'
import PhotoSlot from './PhotoSlot.vue'

const props = defineProps<{
  page: YearPage
  pageIndex: number
  total: number
  unlocked: boolean
  autoOpen?: boolean
}>()

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
  (e: 'unlock'): void
  (e: 'summary'): void
  (e: 'expand', photos: typeof props.page.photos, idx: number): void
}>()

// How many photos are currently visible (0 = none, up to page.photos.length)
const revealedCount = ref(props.unlocked ? props.page.photos.length : 0)

// If the page is already unlocked when mounted, show all immediately
watch(() => props.unlocked, (val) => {
  if (val) revealedCount.value = props.page.photos.length
})

// Auto-open pack if navigated via QR code URL
onMounted(() => {
  if (props.autoOpen && !props.unlocked) {
    // Wait for the page slide-in transition to finish before opening
    setTimeout(openPack, 750)
  }
})

// Gift popup state
const showGift = ref(false)

// Pack overlay state
const showOverlay = ref(false)
const packPhase = ref<'trivia' | 'in' | 'jiggle' | 'out'>('in')
const isOpening = ref(false)

// Trivia state
const triviaAnswer = ref('')
const triviaState = ref<'idle' | 'wrong' | 'correct'>('idle')
const triviaHintVisible = ref(false)
let triviaResolve: (() => void) | null = null

function waitForCorrectAnswer() {
  return new Promise<void>(resolve => { triviaResolve = resolve })
}

function checkAnswer() {
  if (!props.page.trivia) return
  const input = triviaAnswer.value.trim().toLowerCase()
  const expected = props.page.trivia.answer.trim().toLowerCase()
  if (input === expected) {
    triviaState.value = 'correct'
    triviaResolve?.()
    triviaResolve = null
  } else {
    triviaState.value = 'wrong'
    triviaHintVisible.value = !!props.page.trivia.hint
    setTimeout(() => { triviaState.value = 'idle' }, 900)
  }
}

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

async function openPack() {
  if (isOpening.value || props.unlocked) return
  isOpening.value = true

  // If this year has a trivia gate, show it first
  if (props.page.trivia) {
    triviaAnswer.value = ''
    triviaState.value = 'idle'
    triviaHintVisible.value = false
    packPhase.value = 'trivia'
    showOverlay.value = true
    await waitForCorrectAnswer()
    // Brief success pause before pack bursts in
    await sleep(600)
  }

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
            @expand="$emit('expand', page.photos.slice(0, revealedCount), i)"
          />
        </div>
      </template>

      <!-- Layout: 3 photos -->
      <template v-else-if="page.photos.length === 3">
        <div class="row center">
          <PhotoSlot :photo="page.photos[0]!" :index="0" :revealed="revealedCount > 0" @expand="$emit('expand', page.photos.slice(0, revealedCount), 0)" />
          <PhotoSlot :photo="page.photos[1]!" :index="1" :revealed="revealedCount > 1" @expand="$emit('expand', page.photos.slice(0, revealedCount), 1)" />
        </div>
        <div class="row center solo">
          <PhotoSlot :photo="page.photos[2]!" :index="2" :revealed="revealedCount > 2" @expand="$emit('expand', page.photos.slice(0, revealedCount), 2)" />
        </div>
      </template>

      <!-- Layout: 4 photos -->
      <template v-else-if="page.photos.length === 4">
        <div class="row center">
          <PhotoSlot :photo="page.photos[0]!" :index="0" :revealed="revealedCount > 0" @expand="$emit('expand', page.photos.slice(0, revealedCount), 0)" />
          <PhotoSlot :photo="page.photos[1]!" :index="1" :revealed="revealedCount > 1" @expand="$emit('expand', page.photos.slice(0, revealedCount), 1)" />
        </div>
        <div class="row center">
          <PhotoSlot :photo="page.photos[2]!" :index="2" :revealed="revealedCount > 2" @expand="$emit('expand', page.photos.slice(0, revealedCount), 2)" />
          <PhotoSlot :photo="page.photos[3]!" :index="3" :revealed="revealedCount > 3" @expand="$emit('expand', page.photos.slice(0, revealedCount), 3)" />
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
      <button class="nav-btn next" @click="$emit('next')" :aria-label="'Próxima página'">›</button>
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

    <!-- Pack opening overlay -->
    <Transition name="overlay-fade">
      <div v-if="showOverlay" class="pack-overlay">

        <!-- Trivia card (shown before pack opens) -->
        <div
          v-if="packPhase === 'trivia'"
          class="pack-card trivia-card"
          :class="{
            'trivia-wrong': triviaState === 'wrong',
            'trivia-correct': triviaState === 'correct',
          }"
        >
          <div class="pack-shine"></div>
          <div class="trivia-content">
            <div class="trivia-tag">✦ Pergunta ✦</div>
            <div class="trivia-year">{{ page.year }}</div>
            <div class="trivia-question">{{ page.trivia?.question }}</div>

            <Transition name="hint-fade">
              <div v-if="triviaHintVisible && page.trivia?.hint" class="trivia-hint">
                {{ page.trivia.hint }}
              </div>
            </Transition>

            <div v-if="triviaState === 'correct'" class="trivia-success">
              ♡ Correto!
            </div>
            <template v-else>
              <input
                v-model="triviaAnswer"
                class="trivia-input"
                type="text"
                placeholder="sua resposta…"
                :class="{ shake: triviaState === 'wrong' }"
                @keyup.enter="checkAnswer"
                autocomplete="off"
                autocorrect="off"
                spellcheck="false"
              />
              <button class="trivia-submit" @click="checkAnswer">
                confirmar ✦
              </button>
            </template>
          </div>
        </div>

        <!-- Pack card (normal open animation) -->
        <div v-else class="pack-card" :class="`pack-${packPhase}`">
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

/* ── Trivia card ── */
.trivia-card {
  animation: pack-enter 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.trivia-card.trivia-wrong {
  animation: trivia-shake 0.5s ease both;
}

.trivia-card.trivia-correct {
  animation: trivia-success 0.4s ease both;
}

@keyframes trivia-shake {
  0%, 100% { transform: translateX(0); }
  18%  { transform: translateX(-10px); }
  36%  { transform: translateX(10px); }
  54%  { transform: translateX(-7px); }
  72%  { transform: translateX(7px); }
  88%  { transform: translateX(-3px); }
}

@keyframes trivia-success {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.06); filter: brightness(1.3); }
  100% { transform: scale(1); filter: brightness(1); }
}

.trivia-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 16px;
  width: 100%;
  position: relative;
  z-index: 1;
  text-align: center;
}

.trivia-tag {
  font-family: 'Dancing Script', cursive;
  font-size: 14px;
  color: #c4973b;
  letter-spacing: 0.5px;
}

.trivia-year {
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  font-weight: 700;
  color: #f5e6c8;
  line-height: 1;
  letter-spacing: -1px;
}

.trivia-question {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  font-size: 13px;
  color: rgba(245, 230, 200, 0.9);
  line-height: 1.5;
  letter-spacing: 0.2px;
}

.trivia-hint {
  font-family: 'Lato', sans-serif;
  font-size: 10px;
  font-style: italic;
  color: rgba(196, 151, 59, 0.75);
  letter-spacing: 0.3px;
}

.hint-fade-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.hint-fade-enter-from   { opacity: 0; transform: translateY(-4px); }

.trivia-input {
  width: 100%;
  background: rgba(255, 253, 248, 0.1);
  border: 1px solid rgba(196, 151, 59, 0.5);
  border-radius: 8px;
  padding: 9px 12px;
  font-family: 'Lato', sans-serif;
  font-size: 14px;
  color: #f5e6c8;
  text-align: center;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  -webkit-appearance: none;
}

.trivia-input::placeholder {
  color: rgba(245, 230, 200, 0.35);
  font-style: italic;
}

.trivia-input:focus {
  border-color: rgba(196, 151, 59, 0.9);
  background: rgba(255, 253, 248, 0.15);
}

.trivia-input.shake {
  border-color: rgba(220, 80, 80, 0.7);
}

.trivia-submit {
  width: 100%;
  padding: 9px 12px;
  background: linear-gradient(135deg, rgba(196, 151, 59, 0.25), rgba(196, 151, 59, 0.15));
  border: 1px solid rgba(196, 151, 59, 0.6);
  border-radius: 8px;
  font-family: 'Playfair Display', serif;
  font-size: 12px;
  font-style: italic;
  color: #c4973b;
  letter-spacing: 0.5px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}

.trivia-submit:active {
  background: rgba(196, 151, 59, 0.3);
}

.trivia-success {
  font-family: 'Dancing Script', cursive;
  font-size: 28px;
  color: #c4973b;
  letter-spacing: 1px;
  animation: success-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes success-pop {
  0%   { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
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
