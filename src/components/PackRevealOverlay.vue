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
  isLastPack?: boolean
  completedYears?: { year: number; title: string }[]
}>()

const emit = defineEmits<{
  (e: 'go', year: number): void
  (e: 'epilogue'): void
}>()

// ── Animation state ──────────────────────────────────────────────────────────
const packVisible  = ref(false)
const packJiggling = ref(false)
const packOpening  = ref(false)
const packGone     = ref(false)
const burstActive  = ref(false)
const revealedCount = ref(0)
const showButton   = ref(false)

// Fixed rotations for up to 7 photo cards
const ROTATIONS = [-7, 3, -4, 6, -2, 5, -3]

const completionBurst = ref(false)

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
  if (props.isLastPack) {
    completionBurst.value = true
    await sleep(200)
  }
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
        <div v-if="packGone" class="photos-row" :class="{ 'photos-compact': items.length >= 5 }">
          <TransitionGroup name="photo-fly">
            <div
              v-for="(item, i) in items.slice(0, revealedCount)"
              :key="item.photoId"
              class="photo-card"
              :style="`--rot: ${ROTATIONS[i] ?? 0}deg`"
            >
              <div class="photo-img-area">
                <img :src="`/photos/${item.photoId}.jpg`" :alt="item.caption" class="photo-img" />
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

    <!-- ── Completion rain (last pack only) ── -->
    <Transition name="rain-fade">
      <div v-if="showButton && isLastPack" class="complete-rain" aria-hidden="true">
        <span v-for="i in 18" :key="i" class="rain-piece" :style="`--i:${i}`">{{ i % 3 === 0 ? '♡' : '✦' }}</span>
      </div>
    </Transition>

    <!-- ── Completion burst (second wave) ── -->
    <div v-if="completionBurst && isLastPack" class="burst-wrap completion-burst-wrap" aria-hidden="true">
      <div v-for="i in 18" :key="i" class="burst-particle comp-particle" :style="`--i:${i}`"></div>
      <div class="burst-ring r1 comp-ring"></div>
      <div class="burst-ring r2 comp-ring"></div>
      <div class="burst-glow comp-glow"></div>
    </div>

    <!-- ── Footer (years + CTA button) ── -->
    <Transition name="footer-rise">
      <div v-if="showButton" class="footer">

        <!-- Year completion badges (shown whenever a year is newly complete) -->
        <Transition name="year-complete-rise">
          <div v-if="completedYears?.length" class="year-complete-block">
            <div class="year-complete-label">
              {{ completedYears.length === 1 ? 'Ano revelado completo' : 'Anos revelados completos' }} ✦
            </div>
            <div class="year-complete-btns">
              <button
                v-for="cy in completedYears"
                :key="cy.year"
                class="year-complete-btn"
                @click="emit('go', cy.year)"
              >
                {{ cy.year }} · {{ cy.title }} ›
              </button>
            </div>
          </div>
        </Transition>

        <!-- Regular footer -->
        <template v-if="!isLastPack">
          <div class="footer-years">{{ items.map(it => it.year).join(' · ') }}</div>
          <button class="go-btn" @click="emit('go', firstYear)">
            Ver no álbum ✦
          </button>
        </template>

        <!-- Completion footer (last pack) -->
        <template v-else>
          <div class="complete-ornament">✦ ♡ ✦</div>
          <div class="complete-title">Nossa história<br>está completa</div>
          <div class="complete-sub">17 anos de amor revelados ♡</div>
          <button class="epilogue-btn" @click="emit('epilogue')">
            Ver o nosso futuro ✦
          </button>
        </template>

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
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: center;
  gap: 10px;
  padding: 0 8px;
  max-width: 370px;
}

/* Compact mode for 5+ photos */
.photos-compact {
  gap: 7px;
  max-width: 340px;
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
  width: 108px;
  flex-shrink: 0;
}

/* Compact card dimensions */
.photos-compact .photo-card {
  width: 84px;
  padding: 5px 5px 8px;
}

.photo-img-area {
  width: 92px;
  height: 108px;
  background: linear-gradient(135deg, #4a2030 0%, #2a0f1c 50%, #1a081a 100%);
  border-radius: 1px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
}

.photos-compact .photo-img-area {
  width: 74px;
  height: 84px;
  margin-bottom: 6px;
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

/* ── Year completion badges ── */
.year-complete-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(196, 151, 59, 0.18);
  margin-bottom: 2px;
}

.year-complete-label {
  font-family: 'Lato', sans-serif;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgba(196, 151, 59, 0.7);
}

.year-complete-btns {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.year-complete-btn {
  width: 100%;
  padding: 10px 14px;
  background: rgba(196, 151, 59, 0.08);
  border: 1px solid rgba(196, 151, 59, 0.3);
  border-radius: 10px;
  font-family: 'Playfair Display', serif;
  font-size: 13px;
  font-style: italic;
  color: rgba(232, 200, 122, 0.9);
  cursor: pointer;
  letter-spacing: 0.3px;
  text-align: center;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}
.year-complete-btn:active { background: rgba(196, 151, 59, 0.18); }

.year-complete-rise-enter-active {
  transition: opacity 0.4s ease 0.1s, transform 0.4s cubic-bezier(0.32, 0.72, 0, 1) 0.1s;
}
.year-complete-rise-enter-from { opacity: 0; transform: translateY(12px); }

/* ── Completion rain ── */
.complete-rain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}
.rain-piece {
  position: absolute;
  top: -24px;
  left: calc(var(--i) * 5.5% + 1%);
  font-size: calc(10px + (var(--i) % 3) * 5px);
  color: rgba(196, 151, 59, 0.65);
  animation: rain-fall calc(3.5s + var(--i) * 0.18s) linear infinite;
  animation-delay: calc(var(--i) * 0.28s - 0.5s);
  text-shadow: 0 0 8px rgba(196, 151, 59, 0.4);
}
@keyframes rain-fall {
  0%   { transform: translateY(0) rotate(0deg);    opacity: 0; }
  8%   { opacity: 0.9; }
  88%  { opacity: 0.7; }
  100% { transform: translateY(110vh) rotate(340deg); opacity: 0; }
}
.rain-fade-enter-active { transition: opacity 0.6s ease; }
.rain-fade-enter-from   { opacity: 0; }

/* ── Second completion burst ── */
.completion-burst-wrap {
  z-index: 2;
}
.comp-particle {
  animation: particle-fly 0.9s ease-out forwards;
  background: radial-gradient(circle, #e8c87a 30%, #c4973b);
  width: 8px;
  height: 8px;
}
.comp-ring {
  animation: ring-expand 0.8s ease-out forwards;
  border-color: rgba(232, 200, 122, 0.5);
}
.comp-glow {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(232, 200, 122, 0.3) 0%, transparent 70%);
  animation: glow-fade 0.9s ease-out forwards;
}

/* ── Completion footer content ── */
.complete-ornament {
  font-family: 'Dancing Script', cursive;
  font-size: 15px;
  color: rgba(196, 151, 59, 0.7);
  letter-spacing: 6px;
  animation: complete-pulse 2.5s ease-in-out infinite;
}
.complete-title {
  font-family: 'Dancing Script', cursive;
  font-size: 38px;
  font-weight: 600;
  color: #e8c87a;
  text-align: center;
  line-height: 1.15;
  text-shadow:
    0 0 30px rgba(232, 200, 122, 0.6),
    0 0 60px rgba(196, 151, 59, 0.3);
  animation: complete-pulse 2.5s ease-in-out infinite;
}
.complete-sub {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  font-size: 13px;
  color: rgba(245, 230, 200, 0.65);
  letter-spacing: 1.2px;
  text-align: center;
}
@keyframes complete-pulse {
  0%, 100% { filter: brightness(1); }
  50%       { filter: brightness(1.2); }
}

/* ── Epilogue CTA button ── */
.epilogue-btn {
  padding: 16px 44px;
  background: linear-gradient(135deg, #5c2235, #7a2d3d);
  border: 1.5px solid #c4973b;
  border-radius: 28px;
  font-family: 'Dancing Script', cursive;
  font-size: 22px;
  font-weight: 600;
  color: #f5e6c8;
  cursor: pointer;
  letter-spacing: 0.5px;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.15s, box-shadow 0.15s;
  animation: epilogue-glow 2.2s ease-in-out infinite;
}
.epilogue-btn:active {
  transform: scale(0.96);
}
@keyframes epilogue-glow {
  0%, 100% {
    box-shadow: 0 4px 24px rgba(0,0,0,0.5), 0 0 20px rgba(196, 151, 59, 0.2);
  }
  50% {
    box-shadow: 0 4px 24px rgba(0,0,0,0.5), 0 0 40px rgba(196, 151, 59, 0.5), 0 0 70px rgba(196, 151, 59, 0.2);
  }
}
</style>
