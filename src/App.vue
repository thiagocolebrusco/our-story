<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AlbumCover from './components/AlbumCover.vue'
import YearPage from './components/YearPage.vue'
import AlbumSummary from './components/AlbumSummary.vue'
import PhotoLightbox from './components/PhotoLightbox.vue'
import PackRevealOverlay from './components/PackRevealOverlay.vue'
import type { RevealItem } from './components/PackRevealOverlay.vue'
import LandingPage from './components/LandingPage.vue'
import EpiloguePage from './components/EpiloguePage.vue'
import { pages, packTokens, packs } from './data/album'
import type { Photo } from './data/album'

// 0 = cover, 1–N = year pages, N+1 = epilogue (when complete)
const currentPage = ref(0)
const direction = ref<'left' | 'right'>('left')

// ── Pack mode state ──────────────────────────────────────────────────────────
const storedPhotos = JSON.parse(localStorage.getItem('unlockedPhotos') || '[]') as string[]
const unlockedPhotos = ref<Set<string>>(new Set(storedPhotos))

// Ordered list of tokens already used — its length tells us which pack to open next
const usedTokens = ref<string[]>(
  JSON.parse(localStorage.getItem('usedTokens') || '[]') as string[]
)

// Pack mode: data for the full-screen reveal overlay
const packRevealData = ref<{ items: RevealItem[]; firstYear: number } | null>(null)

// ── Derived helpers ──────────────────────────────────────────────────────────
function isYearComplete(year: number): boolean {
  const p = pages.find(pg => pg.year === year)!
  return p.photos.every(ph => unlockedPhotos.value.has(ph.id))
}

// Photo IDs already revealed for a given year page (drives YearPage initial state)
const currentPreRevealed = computed<string[]>(() => {
  if (currentPage.value === 0 || currentPage.value > pages.length) return []
  const page = pages[currentPage.value - 1]!
  return page.photos.filter(p => unlockedPhotos.value.has(p.id)).map(p => p.id)
})

// Completed years — for AlbumSummary
const completedYears = computed<Set<number>>(
  () => new Set(pages.filter(p => isYearComplete(p.year)).map(p => p.year))
)

// Album complete — unlocks epilogue page
const isAlbumComplete = computed(() => usedTokens.value.length >= packs.length)

// Total navigable pages (year pages + epilogue when complete)
const totalPages = computed(() => pages.length + (isAlbumComplete.value ? 1 : 0))

// Landing page (shown once on first visit)
const showLanding = ref(localStorage.getItem('hasSeenLanding') !== 'true')

function dismissLanding() {
  showLanding.value = false
  localStorage.setItem('hasSeenLanding', 'true')
}

// Summary overlay
const showSummary = ref(false)

// Admin panel
const showAdmin = ref(false)
const adminConfirm = ref(false)

function openAdmin() {
  adminConfirm.value = false
  showAdmin.value = true
}
function closeAdmin() {
  showAdmin.value = false
  adminConfirm.value = false
}
function openAllPacks() {
  // Silently unlock every photo from every pack
  const allPhotoIds = packs.flatMap(p => p.photos.map(ph => ph.photoId))
  unlockedPhotos.value = new Set([...unlockedPhotos.value, ...allPhotoIds])
  localStorage.setItem('unlockedPhotos', JSON.stringify([...unlockedPhotos.value]))
  // Mark all tokens as used so the queue shows complete
  usedTokens.value = [...packTokens]
  localStorage.setItem('usedTokens', JSON.stringify(usedTokens.value))
  closeAdmin()
}

function resetAll() {
  if (!adminConfirm.value) {
    adminConfirm.value = true
    return
  }
  unlockedPhotos.value = new Set()
  localStorage.removeItem('unlockedPhotos')
  usedTokens.value = []
  localStorage.removeItem('usedTokens')
  currentPage.value = 0
  packRevealData.value = null
  closeAdmin()
}

function onPackGo(year: number) {
  packRevealData.value = null
  const pageIdx = pages.findIndex(p => p.year === year)
  if (pageIdx !== -1) {
    direction.value = 'left'
    currentPage.value = pageIdx + 1
  }
}

// Photo lightbox
const lightbox = ref<{ photos: Photo[], idx: number } | null>(null)

function openLightbox(photos: Photo[], idx: number) {
  lightbox.value = { photos, idx }
}
function closeLightbox() {
  lightbox.value = null
}

function openSummary() { showSummary.value = true }
function closeSummary() { showSummary.value = false }

function goToYear(year: number) {
  if (year === 0) {
    // Navigate to cover
    direction.value = currentPage.value > 0 ? 'right' : 'left'
    currentPage.value = 0
  } else {
    const pageIdx = pages.findIndex(p => p.year === year)
    if (pageIdx !== -1) {
      direction.value = currentPage.value <= pageIdx + 1 ? 'left' : 'right'
      currentPage.value = pageIdx + 1
    }
  }
  closeSummary()
}

function goToEpilogue() {
  if (isAlbumComplete.value) {
    direction.value = 'left'
    currentPage.value = pages.length + 1
  }
  closeSummary()
}

// ── Hash handler ─────────────────────────────────────────────────────────────
onMounted(() => {
  const match = window.location.hash.match(/^#unlock-([a-z0-9]+)$/)
  if (match) {
    const token = match[1]!

    if (packTokens.has(token)) {
      // Only proceed if this token hasn't been used yet
      if (!usedTokens.value.includes(token)) {
        const packIndex = usedTokens.value.length   // 0-based: next pack in queue
        const pack = packs[packIndex]

        if (pack) {
          // Record this token as used
          usedTokens.value = [...usedTokens.value, token]
          localStorage.setItem('usedTokens', JSON.stringify(usedTokens.value))

          // Persist newly unlocked photos
          const newPhotoIds = pack.photos.map(ph => ph.photoId)
          unlockedPhotos.value = new Set([...unlockedPhotos.value, ...newPhotoIds])
          localStorage.setItem('unlockedPhotos', JSON.stringify([...unlockedPhotos.value]))

          // Build reveal items for the overlay
          const items: RevealItem[] = pack.photos.map(ph => {
            const yearPage = pages.find(p => p.year === ph.year)!
            const photo = yearPage.photos.find(p => p.id === ph.photoId)!
            return {
              year: ph.year,
              yearTitle: yearPage.title,
              photoId: ph.photoId,
              caption: photo.caption,
            }
          })

          packRevealData.value = { items, firstYear: pack.photos[0]!.year }
        }
      }
    }

    // On the first-ever scan let her experience the intro landing page;
    // subsequent scans skip straight past it to the pack reveal.
    if (usedTokens.value.length > 1) {
      dismissLanding()
    }

    // Clean hash so reload doesn't re-trigger
    window.history.replaceState({}, '', window.location.pathname + window.location.search)
  }
})

function goNext() {
  if (currentPage.value < totalPages.value) {
    direction.value = 'left'
    currentPage.value++
  }
}

function goPrev() {
  if (currentPage.value > 0) {
    direction.value = 'right'
    currentPage.value--
  }
}

// Touch swipe detection
let touchStartX = 0

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0]!.clientX
}

function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0]!.clientX - touchStartX
  if (Math.abs(dx) < 40) return
  if (dx < 0) goNext()
  else goPrev()
}
</script>

<template>
  <div class="album-wrapper" @touchstart="onTouchStart" @touchend="onTouchEnd">
    <Transition :name="`slide-${direction}`" mode="out-in">

      <!-- Cover -->
      <AlbumCover
        v-if="currentPage === 0"
        key="cover"
        @next="goNext"
        @summary="openSummary"
        @admin="openAdmin"
      />

      <!-- Epilogue (only when album is complete) -->
      <EpiloguePage
        v-else-if="isAlbumComplete && currentPage === pages.length + 1"
        key="epilogue"
        @prev="goPrev"
        @summary="openSummary"
      />

      <!-- Year pages -->
      <YearPage
        v-else
        :key="currentPage"
        :page="pages[currentPage - 1]!"
        :pageIndex="currentPage"
        :total="totalPages"
        :unlocked="isYearComplete(pages[currentPage - 1]!.year)"
        :pre-revealed="currentPreRevealed"
        :has-next="currentPage < totalPages"
        @prev="goPrev"
        @next="goNext"
        @summary="openSummary"
        @expand="openLightbox"
      />

    </Transition>

    <!-- Summary overlay — outside Transition so it doesn't slide with pages -->
    <Transition name="summary-slide">
      <AlbumSummary
        v-if="showSummary"
        :unlocked-years="completedYears"
        :current-year="currentPage > 0 && currentPage <= pages.length ? pages[currentPage - 1]!.year : null"
        :unlocked-photos="unlockedPhotos"
        :is-album-complete="isAlbumComplete"
        :is-on-epilogue="currentPage === pages.length + 1"
        @go="goToYear"
        @epilogue="goToEpilogue"
        @close="closeSummary"
      />
    </Transition>

    <!-- Photo lightbox -->
    <Transition name="lb-fade">
      <PhotoLightbox
        v-if="lightbox"
        :photos="lightbox.photos"
        :start-index="lightbox.idx"
        @close="closeLightbox"
      />
    </Transition>

    <!-- Landing page (first visit only) -->
    <Transition name="landing-fade">
      <LandingPage v-if="showLanding" @enter="dismissLanding" />
    </Transition>

    <!-- Pack reveal overlay (pack mode, shown after scanning a QR) -->
    <Transition name="pack-reveal-fade">
      <PackRevealOverlay
        v-if="packRevealData"
        :items="packRevealData.items"
        :first-year="packRevealData.firstYear"
        @go="onPackGo"
      />
    </Transition>

    <!-- Admin panel -->
    <Transition name="admin-slide">
      <div v-if="showAdmin" class="admin-overlay" @click.self="closeAdmin">
        <div class="admin-panel">
          <div class="admin-header">
            <span class="admin-title">Admin</span>
            <button class="admin-close" @click="closeAdmin">✕</button>
          </div>

          <div class="admin-body">
            <!-- Open all packs shortcut -->
            <div class="admin-section">
              <p class="admin-desc">Abre todos os pacotes de uma vez (para testes).</p>
              <button class="admin-open-all-btn" @click="openAllPacks">
                Abrir todos os pacotes ✦
              </button>
            </div>

            <div class="admin-divider"></div>

            <Transition name="admin-confirm-fade" mode="out-in">
              <div v-if="!adminConfirm" key="btn" class="admin-action">
                <p class="admin-desc">Reinicia todo o progresso do álbum.</p>
                <button class="admin-reset-btn" @click="resetAll">
                  Resetar tudo
                </button>
              </div>
              <div v-else key="confirm" class="admin-action">
                <p class="admin-warn">Tem certeza? Todo o progresso será apagado.</p>
                <div class="admin-confirm-row">
                  <button class="admin-cancel-btn" @click="adminConfirm = false">Cancelar</button>
                  <button class="admin-confirm-btn" @click="resetAll">Sim, resetar ✦</button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #1a1020;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style scoped>
.album-wrapper {
  width: 100%;
  max-width: 430px;
  height: 100dvh;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(0,0,0,0.6);
}

/* ── Page transitions ── */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.32s ease;
  position: absolute;
  inset: 0;
}

.slide-left-enter-from  { transform: translateX(100%); opacity: 0; }
.slide-left-leave-to    { transform: translateX(-100%); opacity: 0; }
.slide-right-enter-from { transform: translateX(-100%); opacity: 0; }
.slide-right-leave-to   { transform: translateX(100%); opacity: 0; }

.slide-left-enter-to,
.slide-left-leave-from,
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* ── Summary panel slide-up ── */
.summary-slide-enter-active { transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.32, 0.72, 0, 1); }
.summary-slide-leave-active { transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.32, 0.72, 0, 1); }
.summary-slide-enter-from  { opacity: 0; transform: translateY(100%); }
.summary-slide-leave-to    { opacity: 0; transform: translateY(100%); }

/* ── Lightbox fade ── */
.lb-fade-enter-active { transition: opacity 0.2s ease; }
.lb-fade-leave-active { transition: opacity 0.18s ease; }
.lb-fade-enter-from, .lb-fade-leave-to { opacity: 0; }

/* ── Admin panel ── */
.admin-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 4, 8, 0.6);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 400;
  backdrop-filter: blur(2px);
}

.admin-panel {
  width: 100%;
  background: #1e0f18;
  border-top: 1.5px solid rgba(196, 151, 59, 0.4);
  border-radius: 18px 18px 0 0;
  padding: 0 0 32px;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.5);
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid rgba(196, 151, 59, 0.15);
}

.admin-title {
  font-family: 'Playfair Display', serif;
  font-size: 13px;
  font-style: italic;
  color: rgba(196, 151, 59, 0.6);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.admin-close {
  width: 28px;
  height: 28px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  color: rgba(245, 230, 200, 0.5);
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
}
.admin-close:active { background: rgba(255,255,255,0.1); }

.admin-body {
  padding: 16px 20px 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.admin-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 16px;
}

.admin-divider {
  height: 1px;
  background: rgba(196, 151, 59, 0.12);
  margin-bottom: 16px;
}

.admin-action {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.admin-desc {
  font-family: 'Lato', sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: rgba(245, 230, 200, 0.45);
  letter-spacing: 0.3px;
}

.admin-warn {
  font-family: 'Lato', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: rgba(220, 140, 120, 0.85);
  letter-spacing: 0.3px;
  line-height: 1.5;
}

.admin-open-all-btn {
  width: 100%;
  padding: 13px;
  background: rgba(196, 151, 59, 0.12);
  border: 1.5px solid rgba(196, 151, 59, 0.4);
  border-radius: 12px;
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-style: italic;
  color: rgba(196, 151, 59, 0.9);
  cursor: pointer;
  letter-spacing: 0.3px;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}
.admin-open-all-btn:active { background: rgba(196, 151, 59, 0.25); }

.admin-reset-btn {
  width: 100%;
  padding: 13px;
  background: rgba(180, 50, 60, 0.2);
  border: 1.5px solid rgba(180, 50, 60, 0.5);
  border-radius: 12px;
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-style: italic;
  color: rgba(240, 160, 150, 0.9);
  cursor: pointer;
  letter-spacing: 0.3px;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}
.admin-reset-btn:active { background: rgba(180, 50, 60, 0.35); }

.admin-confirm-row {
  display: flex;
  gap: 10px;
}

.admin-cancel-btn {
  flex: 1;
  padding: 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  font-family: 'Lato', sans-serif;
  font-size: 13px;
  color: rgba(245, 230, 200, 0.55);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.admin-cancel-btn:active { background: rgba(255,255,255,0.1); }

.admin-confirm-btn {
  flex: 1.4;
  padding: 12px;
  background: rgba(180, 50, 60, 0.3);
  border: 1.5px solid rgba(180, 50, 60, 0.6);
  border-radius: 12px;
  font-family: 'Playfair Display', serif;
  font-size: 13px;
  font-style: italic;
  color: rgba(240, 160, 150, 0.95);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}
.admin-confirm-btn:active { background: rgba(180, 50, 60, 0.5); }

.admin-slide-enter-active { transition: opacity 0.2s ease, transform 0.28s cubic-bezier(0.32, 0.72, 0, 1); }
.admin-slide-leave-active { transition: opacity 0.18s ease, transform 0.22s cubic-bezier(0.32, 0.72, 0, 1); }
.admin-slide-enter-from  { opacity: 0; transform: translateY(100%); }
.admin-slide-leave-to    { opacity: 0; transform: translateY(100%); }

.admin-confirm-fade-enter-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.admin-confirm-fade-leave-active { transition: opacity 0.1s ease; }
.admin-confirm-fade-enter-from   { opacity: 0; transform: translateX(10px); }
.admin-confirm-fade-leave-to     { opacity: 0; }

/* ── Landing page transition ── */
.landing-fade-enter-active { transition: opacity 0.4s ease; }
.landing-fade-leave-active { transition: opacity 0.5s ease; }
.landing-fade-enter-from, .landing-fade-leave-to { opacity: 0; }

/* ── Pack reveal overlay transition ── */
.pack-reveal-fade-enter-active { transition: opacity 0.35s ease; }
.pack-reveal-fade-leave-active { transition: opacity 0.25s ease; }
.pack-reveal-fade-enter-from, .pack-reveal-fade-leave-to { opacity: 0; }
</style>
