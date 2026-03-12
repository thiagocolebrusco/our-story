<script setup lang="ts">
import { pages } from '../data/album'

const props = defineProps<{
  unlockedYears: Set<number>
  currentYear: number | null
  unlockedPhotos?: Set<string>
}>()

const emit = defineEmits<{
  (e: 'go', year: number): void
  (e: 'close'): void
}>()

function unlockedCount() {
  return pages.filter(p => props.unlockedYears.has(p.year)).length
}

function photoCount(year: number): { revealed: number; total: number } {
  const page = pages.find(p => p.year === year)!
  const total = page.photos.length
  if (!props.unlockedPhotos) {
    const revealed = props.unlockedYears.has(year) ? total : 0
    return { revealed, total }
  }
  const revealed = page.photos.filter(ph => props.unlockedPhotos!.has(ph.id)).length
  return { revealed, total }
}
</script>

<template>
  <div class="summary-overlay" @click.self="$emit('close')">
    <div class="summary-panel">

      <!-- Handle bar -->
      <div class="handle-bar"></div>

      <!-- Header -->
      <header class="summary-header">
        <div class="summary-title">Nossa história</div>
        <div class="summary-progress">
          {{ unlockedCount() }} / {{ pages.length }} anos revelados
        </div>
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: `${(unlockedCount() / pages.length) * 100}%` }"
          ></div>
        </div>
      </header>

      <!-- Year grid -->
      <div class="year-grid">
        <button
          v-for="page in pages"
          :key="page.year"
          class="year-card"
          :class="{
            'is-unlocked': unlockedYears.has(page.year),
            'is-current': page.year === currentYear,
          }"
          @click="$emit('go', page.year)"
        >
          <div class="card-status">
            <span v-if="unlockedYears.has(page.year)" class="status-icon unlocked">✦</span>
            <span v-else class="status-icon locked">·</span>
          </div>
          <div class="card-year">{{ page.year }}</div>
          <div class="card-title">{{ page.title }}</div>
          <div
            v-if="photoCount(page.year).revealed > 0"
            class="card-photo-count"
            :class="{ complete: photoCount(page.year).revealed === photoCount(page.year).total }"
          >
            {{ photoCount(page.year).revealed }}/{{ photoCount(page.year).total }}
          </div>
        </button>
      </div>

      <!-- Close button -->
      <button class="close-btn" @click="$emit('close')">fechar</button>

    </div>
  </div>
</template>

<style scoped>
/* ── Overlay ── */
.summary-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 4, 8, 0.55);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  backdrop-filter: blur(2px);
}

/* ── Panel ── */
.summary-panel {
  width: 100%;
  max-height: 88%;
  background: #fef9f0;
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 24px;
  overflow: hidden;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.35);
}

.handle-bar {
  width: 40px;
  height: 4px;
  background: rgba(107, 58, 42, 0.2);
  border-radius: 2px;
  margin: 12px auto 0;
  flex-shrink: 0;
}

/* ── Header ── */
.summary-header {
  width: 100%;
  padding: 14px 20px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(107, 58, 42, 0.1);
}

.summary-title {
  font-family: 'Dancing Script', cursive;
  font-size: 24px;
  color: #5c2235;
  line-height: 1;
}

.summary-progress {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: #a88070;
  text-transform: uppercase;
}

.progress-track {
  width: 140px;
  height: 3px;
  background: rgba(107, 58, 42, 0.12);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 2px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #c4973b, #e0b84a);
  border-radius: 2px;
  transition: width 0.5s ease;
}

/* ── Year grid ── */
.year-grid {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px 4px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  -webkit-overflow-scrolling: touch;
}

/* ── Individual year card ── */
.year-card {
  background: #f0e8de;
  border: 1.5px solid transparent;
  border-radius: 10px;
  padding: 10px 6px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
  text-align: center;
}

.year-card:active {
  transform: scale(0.95);
}

.year-card.is-unlocked {
  background: #fffdf5;
  border-color: rgba(196, 151, 59, 0.35);
}

.year-card.is-current {
  border-color: #c4973b;
  box-shadow: 0 0 0 2px rgba(196, 151, 59, 0.2);
}

.card-status {
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon {
  font-size: 10px;
}

.status-icon.unlocked {
  color: #c4973b;
}

.status-icon.locked {
  color: rgba(107, 58, 42, 0.25);
  font-size: 16px;
  line-height: 1;
}

.card-year {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  font-weight: 700;
  color: #6b3a2a;
  line-height: 1;
}

.year-card:not(.is-unlocked) .card-year {
  color: rgba(107, 58, 42, 0.4);
}

.card-title {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  font-size: 8px;
  color: #a88070;
  letter-spacing: 0.3px;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.year-card:not(.is-unlocked) .card-title {
  opacity: 0.4;
}

.card-photo-count {
  font-family: 'Lato', sans-serif;
  font-size: 9px;
  font-weight: 400;
  color: rgba(107, 58, 42, 0.5);
  letter-spacing: 0.5px;
  margin-top: 1px;
}

.card-photo-count.complete {
  color: #c4973b;
}

/* ── Close button ── */
.close-btn {
  margin-top: 8px;
  padding: 8px 24px;
  background: none;
  border: 1.5px solid rgba(107, 58, 42, 0.2);
  border-radius: 20px;
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  font-size: 11px;
  letter-spacing: 2px;
  color: #a88070;
  text-transform: uppercase;
  cursor: pointer;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}

.close-btn:active {
  background: rgba(107, 58, 42, 0.06);
}
</style>
