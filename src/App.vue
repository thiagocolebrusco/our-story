<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AlbumCover from './components/AlbumCover.vue'
import YearPage from './components/YearPage.vue'
import AlbumSummary from './components/AlbumSummary.vue'
import PhotoLightbox from './components/PhotoLightbox.vue'
import { pages, tokenToYear } from './data/album'
import type { Photo } from './data/album'

// 0 = cover, 1–17 = year pages
const currentPage = ref(0)
const direction = ref<'left' | 'right'>('left')

// Unlocked years — persisted in localStorage
const stored = JSON.parse(localStorage.getItem('unlockedYears') || '[]') as number[]
const unlockedYears = ref<Set<number>>(new Set(stored))

// Year to auto-open pack for (set via #unlock-YEAR hash)
const autoOpenYear = ref<number | null>(null)

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
function resetAll() {
  if (!adminConfirm.value) {
    adminConfirm.value = true
    return
  }
  unlockedYears.value = new Set()
  localStorage.removeItem('unlockedYears')
  currentPage.value = 0
  autoOpenYear.value = null
  closeAdmin()
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
  const pageIdx = pages.findIndex(p => p.year === year)
  if (pageIdx !== -1) {
    direction.value = currentPage.value <= pageIdx + 1 ? 'left' : 'right'
    currentPage.value = pageIdx + 1
  }
  closeSummary()
}

function unlockYear(year: number) {
  unlockedYears.value.add(year)
  localStorage.setItem('unlockedYears', JSON.stringify([...unlockedYears.value]))
}

// Handle #unlock-TOKEN hash — resolve opaque token to a year, then navigate.
// Token-based so the URL reveals nothing about which year it unlocks.
onMounted(() => {
  const match = window.location.hash.match(/^#unlock-([a-z0-9]+)$/)
  if (match) {
    const token = match[1]!
    const year = tokenToYear[token]
    if (year !== undefined) {
      const pageIdx = pages.findIndex(p => p.year === year)
      if (pageIdx !== -1 && !unlockedYears.value.has(year)) {
        direction.value = 'left'
        currentPage.value = pageIdx + 1
        autoOpenYear.value = year
      }
    }
    // Clean the hash so reloading doesn't re-trigger
    window.history.replaceState({}, '', window.location.pathname + window.location.search)
  }
})

function goNext() {
  if (currentPage.value < pages.length) {
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

      <!-- Year pages -->
      <YearPage
        v-else
        :key="currentPage"
        :page="pages[currentPage - 1]!"
        :pageIndex="currentPage"
        :total="pages.length"
        :unlocked="unlockedYears.has(pages[currentPage - 1]!.year)"
        :auto-open="autoOpenYear === pages[currentPage - 1]!.year"
        @prev="goPrev"
        @next="goNext"
        @unlock="unlockYear(pages[currentPage - 1]!.year)"
        @summary="openSummary"
        @expand="openLightbox"
      />

    </Transition>

    <!-- Summary overlay — outside Transition so it doesn't slide with pages -->
    <Transition name="summary-slide">
      <AlbumSummary
        v-if="showSummary"
        :unlocked-years="unlockedYears"
        :current-year="currentPage > 0 ? pages[currentPage - 1]!.year : null"
        @go="goToYear"
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

    <!-- Admin panel -->
    <Transition name="admin-slide">
      <div v-if="showAdmin" class="admin-overlay" @click.self="closeAdmin">
        <div class="admin-panel">
          <div class="admin-header">
            <span class="admin-title">Admin</span>
            <button class="admin-close" @click="closeAdmin">✕</button>
          </div>

          <div class="admin-body">
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
  padding: 20px 20px 0;
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
</style>
