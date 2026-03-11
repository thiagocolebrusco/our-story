<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AlbumCover from './components/AlbumCover.vue'
import YearPage from './components/YearPage.vue'
import { pages } from './data/album'

// 0 = cover, 1–17 = year pages
const currentPage = ref(0)
const direction = ref<'left' | 'right'>('left')

// Unlocked years — persisted in localStorage
const stored = JSON.parse(localStorage.getItem('unlockedYears') || '[]') as number[]
const unlockedYears = ref<Set<number>>(new Set(stored))

// Year to auto-open pack for (set via ?unlock=YEAR URL param)
const autoOpenYear = ref<number | null>(null)

function unlockYear(year: number) {
  unlockedYears.value.add(year)
  localStorage.setItem('unlockedYears', JSON.stringify([...unlockedYears.value]))
}

// Handle ?unlock=YEAR URL param — navigate to that year and auto-trigger pack opening
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const unlockParam = params.get('unlock')
  if (unlockParam) {
    const year = parseInt(unlockParam)
    const pageIdx = pages.findIndex(p => p.year === year)
    if (pageIdx !== -1 && !unlockedYears.value.has(year)) {
      direction.value = 'left'
      currentPage.value = pageIdx + 1
      autoOpenYear.value = year
    }
    // Clean the URL so reloading doesn't re-trigger
    const cleanUrl = new URL(window.location.href)
    cleanUrl.searchParams.delete('unlock')
    window.history.replaceState({}, '', cleanUrl)
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
      />

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
</style>
