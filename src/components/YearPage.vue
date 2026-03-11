<script setup lang="ts">
import type { YearPage } from '../data/album'
import PhotoSlot from './PhotoSlot.vue'

defineProps<{
  page: YearPage
  pageIndex: number
  total: number
}>()

defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()
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
          <PhotoSlot v-for="(photo, i) in page.photos" :key="photo.id" :photo="photo" :index="i" />
        </div>
      </template>

      <!-- Layout: 3 photos -->
      <template v-else-if="page.photos.length === 3">
        <div class="row center">
          <PhotoSlot :photo="page.photos[0]!" :index="0" />
          <PhotoSlot :photo="page.photos[1]!" :index="1" />
        </div>
        <div class="row center solo">
          <PhotoSlot :photo="page.photos[2]!" :index="2" />
        </div>
      </template>

      <!-- Layout: 4 photos -->
      <template v-else-if="page.photos.length === 4">
        <div class="row center">
          <PhotoSlot :photo="page.photos[0]!" :index="0" />
          <PhotoSlot :photo="page.photos[1]!" :index="1" />
        </div>
        <div class="row center">
          <PhotoSlot :photo="page.photos[2]!" :index="2" />
          <PhotoSlot :photo="page.photos[3]!" :index="3" />
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
.bg-cream {
  background: #fef9f0;
}
.bg-blush {
  background: #fdf3f2;
}

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
.bg-blush .deco-item {
  color: #9e5e6a;
}

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
.bg-blush .year-number {
  color: #7a2d3d;
}

.year-title {
  font-family: 'Dancing Script', cursive;
  font-size: 18px;
  color: #8b5e52;
  text-align: center;
}
.bg-blush .year-title {
  color: #9e5e6a;
}

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
.layout-2 .polaroid {
  width: 146px;
}
.layout-3 .row:first-child .polaroid {
  width: 138px;
}
.layout-3 .solo .polaroid {
  width: 155px;
}
.layout-4 .polaroid {
  width: 138px;
}

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
</style>
