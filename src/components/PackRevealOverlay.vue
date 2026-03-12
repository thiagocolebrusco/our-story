<script setup lang="ts">
import { ref, onMounted } from 'vue'

export interface RevealItem {
  year: number
  yearTitle: string
  photoId: string
  caption: string
}

const props = defineProps<{
  items: RevealItem[]
  firstYear: number
}>()

const emit = defineEmits<{ (e: 'go', year: number): void }>()

// ── Animation state ──────────────────────────────────────────────────────────
const packVisible  = ref(false)
const packJiggling = ref(false)
const packOpening  = ref(false)
const packGone     = ref(false)
const burstActive  = ref(false)
const revealedCount = ref(0)
const showButton   = ref(false)

// Fixed rotations for up to 5 photo cards
const ROTATIONS = [-7, 3, -4, 6, -2]

function sleep(ms: number) { return new Promise<void>(r => setTimeout(r, ms)) }

async function runAnimation() {
  await sleep(300)
  packVisible.value = true          // pack card pops in

  await sleep(500)
  packJiggling.value = true         // excited jiggle

  await sleep(700)
  packJiggling.value = false

  await sleep(120)
  packOpening.value = true          // card starts glowing/scaling

  await sleep(280)
  burstActive.value = true          // particle burst
  packGone.value = true             // card disappears

  await sleep(150)
  packOpening.value = false

  // Reveal photos one by one
  for (let i = 0; i < props.items.length; i++) {
    await sleep(i === 0 ? 280 : 420)
    revealedCount.value = i + 1
  }

  await sleep(500)
  showButton.value = true
}

onMounted(runAnimation)
</script>

<template>
  <div class="overlay">

    <!-- ── Header ── -->
    <div class="overlay-header">
      <div class="header-ornament">✦ ♡ ✦</div>
      <div class="header-title">Pacote desbloqueado!</div>
    </div>

    <!-- ── Stage (pack card → photos) ── -->
    <div class="stage">

      <!-- Burst particles (CSS only) -->
      <div v-if="burstActive" class="burst-wrap" aria-hidden="true">
        <div v-for="i in 14" :key="i" class="burst-particle" :style="`--i:${i}`"></div>
        <div class="burst-ring r1"></div>
        <div class="burst-ring r2"></div>
        <div class="burst-glow"></div>
      </div>

      <!-- Pack card -->
      <Transition name="pack-pop">
        <div
          v-if="packVisible && !packGone"
          class="pack-card"
          :class="{ jiggling: packJiggling, opening: packOpening }"
        >
          <div class="pack-border-outer">
            <div class="pack-border-inner">
              <div class="pack-top-ornament">✦ ♡ ✦</div>
              <div class="pack-center-content">
                <div class="pack-star">✦</div>
                <div class="pack-count-label">{{ items.length }} foto{{ items.length !== 1 ? 's' : '' }}</div>
              </div>
              <div class="pack-bottom-ornament">✦ ♡ ✦</div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Photos row (replaces pack card after burst) -->
      <Transition name="photos-appear">
        <div v-if="packGone" class="photos-row">
          <TransitionGroup name="photo-fly">
            <div
              v-for="(item, i) in items.slice(0, revealedCount)"
              :key="item.photoId"
              class="photo-card"
              :style="`--rot: ${ROTATIONS[i] ?? 0}deg`"
            >
              <div class="photo-img-area">
                <img :src="`https://picsum.photos/seed/${item.photoId}/300/255`" :alt="item.caption" class="photo-img" />
              </div>
              <div class="photo-label">
                <div class="photo-year-num">{{ item.year }}</div>
                <div class="photo-caption-text">{{ item.caption }}</div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </Transition>

    </div>

    <!-- ── Footer (years + CTA button) ── -->
    <Transition name="footer-rise">
      <div v-if="showButton" class="footer">
        <div class="footer-years">{{ items.map(it => it.year).join(' · ') }}</div>
        <button class="go-btn" @click="emit('go', firstYear)">
          Ver no álbum ✦
        </button>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
/* ── Overlay shell ── */
.overlay {
  position: absolute;
  inset: 0;
  z-index: 500;
  background: linear-gradient(160deg, #0c0410 0%, #18071e 55%, #0c0410 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  padding: 32px 16px 40px;
  gap: 0;
}

/* ── Header ── */
.overlay-header {
  text-align: center;
  flex-shrink: 0;
  padding-bottom: 8px;
}

.header-ornament {
  font-family: 'Dancing Script', cursive;
  font-size: 14px;
  color: rgba(196, 151, 59, 0.6);
  letter-spacing: 6px;
  margin-bottom: 8px;
}

.header-title {
  font-family: 'Dancing Script', cursive;
  font-size: 32px;
  font-weight: 600;
  color: #e8c87a;
  text-shadow: 0 0 30px rgba(232, 200, 122, 0.4);
  line-height: 1.1;
}

/* ── Stage ── */
.stage {
  flex: 1;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Burst ── */
.burst-wrap {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.burst-particle {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: radial-gradient(circle, #f5e6c8 30%, #c4973b);
  animation: particle-fly 0.75s ease-out forwards;
  animation-delay: calc(var(--i) * 12ms);
}

@keyframes particle-fly {
  from {
    transform: rotate(calc(var(--i) * 25.7deg)) translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: rotate(calc(var(--i) * 25.7deg)) translateY(-150px) scale(0.2);
    opacity: 0;
  }
}

.burst-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(196, 151, 59, 0.6);
  animation: ring-expand 0.6s ease-out forwards;
}
.r1 { animation-delay: 0ms; }
.r2 { animation-delay: 80ms; border-color: rgba(232, 200, 122, 0.35); }

@keyframes ring-expand {
  from { width: 40px; height: 40px; opacity: 0.9; }
  to   { width: 220px; height: 220px; opacity: 0; }
}

.burst-glow {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(232, 200, 122, 0.35) 0%, transparent 70%);
  animation: glow-fade 0.7s ease-out forwards;
}

@keyframes glow-fade {
  from { transform: scale(0.5); opacity: 1; }
  to   { transform: scale(2); opacity: 0; }
}

/* ── Pack card ── */
.pack-card {
  width: 160px;
  height: 210px;
  transform-origin: center center;
}

.pack-border-outer {
  width: 100%;
  height: 100%;
  background: linear-gradient(160deg, #5c1a2a 0%, #3d0f1c 40%, #2a0a14 100%);
  border: 1.5px solid #c4973b;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 0 rgba(232, 200, 122, 0);
  transition: box-shadow 0.3s ease;
}

.pack-card.opening .pack-border-outer {
  box-shadow:
    0 0 0 6px rgba(232, 200, 122, 0.15),
    0 0 40px rgba(232, 200, 122, 0.4),
    0 0 80px rgba(196, 151, 59, 0.25);
}

.pack-border-inner {
  width: calc(100% - 12px);
  height: calc(100% - 12px);
  border: 1px solid rgba(196, 151, 59, 0.25);
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 18px 12px;
}

.pack-top-ornament,
.pack-bottom-ornament {
  font-family: 'Dancing Script', cursive;
  font-size: 11px;
  color: rgba(196, 151, 59, 0.7);
  letter-spacing: 4px;
}

.pack-center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.pack-star {
  font-size: 36px;
  color: #e8c87a;
  text-shadow: 0 0 20px rgba(232, 200, 122, 0.5);
  line-height: 1;
}

.pack-count-label {
  font-family: 'Playfair Display', serif;
  font-size: 12px;
  font-style: italic;
  color: rgba(245, 230, 200, 0.6);
  letter-spacing: 0.5px;
}

/* Pack card jiggle & opening animations */
.pack-card.jiggling {
  animation: pack-jiggle 0.65s ease-in-out;
}

@keyframes pack-jiggle {
  0%, 100% { transform: rotate(0deg) scale(1); }
  12%  { transform: rotate(-6deg) scale(1.06); }
  28%  { transform: rotate(5deg) scale(1.09); }
  44%  { transform: rotate(-4deg) scale(1.05); }
  60%  { transform: rotate(3deg) scale(1.03); }
  76%  { transform: rotate(-1.5deg) scale(1.01); }
}

.pack-card.opening {
  animation: pack-open 0.35s ease-in forwards;
}

@keyframes pack-open {
  0%   { transform: scale(1); opacity: 1; filter: brightness(1); }
  60%  { transform: scale(1.35); opacity: 0.85; filter: brightness(1.8); }
  100% { transform: scale(0.15); opacity: 0; filter: brightness(3); }
}

/* Pack card enter transition */
.pack-pop-enter-active {
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
}
.pack-pop-enter-from {
  transform: scale(0) rotate(-8deg);
  opacity: 0;
}
.pack-pop-leave-active { transition: none; }

/* ── Photos row ── */
.photos-appear-enter-active { transition: opacity 0.2s ease; }
.photos-appear-enter-from { opacity: 0; }

.photos-row {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  gap: 10px;
  padding: 0 8px;
}

/* Individual photo card (polaroid style) */
.photo-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f5ede0;
  border-radius: 3px;
  padding: 8px 8px 10px;
  box-shadow: 4px 6px 20px rgba(0, 0, 0, 0.55);
  transform: rotate(var(--rot));
  width: 118px;
  flex-shrink: 0;
}

.photo-img-area {
  width: 102px;
  height: 120px;
  background: linear-gradient(135deg, #4a2030 0%, #2a0f1c 50%, #1a081a 100%);
  border-radius: 1px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.photo-label {
  width: 100%;
  text-align: center;
}

.photo-year-num {
  font-family: 'Playfair Display', serif;
  font-size: 15px;
  font-weight: 700;
  color: #3d1f14;
  line-height: 1.1;
  margin-bottom: 3px;
}

.photo-caption-text {
  font-family: 'Lato', sans-serif;
  font-size: 8.5px;
  font-weight: 300;
  color: #7a4a3a;
  line-height: 1.3;
  letter-spacing: 0.2px;
}

/* Photo card fly-in from center */
.photo-fly-enter-active {
  transition: transform 0.42s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
}
.photo-fly-enter-from {
  transform: rotate(calc(var(--rot) * 2)) scale(0) translateY(-20px);
  opacity: 0;
}

/* ── Footer ── */
.footer {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding-top: 4px;
}

.footer-years {
  font-family: 'Playfair Display', serif;
  font-size: 13px;
  font-style: italic;
  color: rgba(196, 151, 59, 0.65);
  letter-spacing: 2px;
}

.go-btn {
  padding: 14px 40px;
  background: linear-gradient(135deg, #5c2235, #7a2d3d);
  border: 1.5px solid #c4973b;
  border-radius: 28px;
  font-family: 'Dancing Script', cursive;
  font-size: 20px;
  font-weight: 600;
  color: #f5e6c8;
  cursor: pointer;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4), 0 0 20px rgba(196, 151, 59, 0.15);
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.15s, box-shadow 0.15s;
}
.go-btn:active {
  transform: scale(0.96);
  box-shadow: 0 2px 10px rgba(0,0,0,0.4);
}

/* ── Footer & button transitions ── */
.footer-rise-enter-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}
.footer-rise-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>
