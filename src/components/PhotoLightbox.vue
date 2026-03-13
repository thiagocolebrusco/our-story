<script setup lang="ts">
import { ref } from 'vue'
import type { Photo } from '../data/album'

const props = defineProps<{
  photos: Photo[]
  startIndex: number
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const idx = ref(props.startIndex)
const slideDir = ref<'left' | 'right'>('left')

function getLargeUrl(id: string) {
  return `/photos/${id}.jpg`
}

function prev() {
  if (idx.value > 0) {
    slideDir.value = 'right'
    idx.value--
  }
}

function next() {
  if (idx.value < props.photos.length - 1) {
    slideDir.value = 'left'
    idx.value++
  }
}

let touchX = 0
function onTouchStart(e: TouchEvent) { touchX = e.touches[0]!.clientX }
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0]!.clientX - touchX
  if (Math.abs(dx) < 40) return
  if (dx < 0) next()
  else prev()
}
</script>

<template>
  <div
    class="lightbox"
    @click.self="$emit('close')"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <!-- Close -->
    <button class="lb-close" @click="$emit('close')">✕</button>

    <!-- Photo -->
    <Transition :name="`lb-${slideDir}`" mode="out-in">
      <div :key="idx" class="lb-polaroid" :style="{ '--rot': `${photos[idx]!.rotation * 0.4}deg` }">
        <div class="lb-photo-area">
          <img
            :src="getLargeUrl(photos[idx]!.id)"
            :alt="photos[idx]!.caption"
            class="lb-img"
          />
        </div>
        <div class="lb-caption">{{ photos[idx]!.caption }}</div>
      </div>
    </Transition>

    <!-- Navigation -->
    <div v-if="photos.length > 1" class="lb-nav">
      <button class="lb-arrow" :disabled="idx === 0" @click="prev">‹</button>
      <span class="lb-counter">{{ idx + 1 }} / {{ photos.length }}</span>
      <button class="lb-arrow" :disabled="idx === photos.length - 1" @click="next">›</button>
    </div>
  </div>
</template>

<style scoped>
.lightbox {
  position: absolute;
  inset: 0;
  background: rgba(8, 3, 6, 0.93);
  z-index: 300;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  backdrop-filter: blur(4px);
}

/* ── Close button ── */
.lb-close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}
.lb-close:active { background: rgba(255, 255, 255, 0.15); }

/* ── Polaroid ── */
.lb-polaroid {
  background: #fffef8;
  padding: 10px 10px 36px 10px;
  width: 88%;
  max-width: 340px;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 20px 60px rgba(0, 0, 0, 0.7),
    0 4px 16px rgba(0, 0, 0, 0.4);
  transform: rotate(var(--rot));
  animation: lb-enter 0.4s cubic-bezier(0.34, 1.4, 0.64, 1) both;
}

@keyframes lb-enter {
  0% { transform: rotate(var(--rot)) scale(0.85); opacity: 0; }
  100% { transform: rotate(var(--rot)) scale(1); opacity: 1; }
}

.lb-photo-area {
  width: 100%;
  aspect-ratio: 1 / 0.85;
  overflow: hidden;
  background: #e8d5c4;
}

.lb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.lb-caption {
  font-family: 'Dancing Script', cursive;
  font-size: 14px;
  color: #5a3e35;
  text-align: center;
  padding: 6px 4px 0;
  line-height: 1.3;
}

/* ── Slide transitions for lightbox nav ── */
.lb-left-enter-active,
.lb-left-leave-active,
.lb-right-enter-active,
.lb-right-leave-active {
  transition: transform 0.22s ease, opacity 0.18s ease;
}
.lb-left-enter-from  { transform: rotate(var(--rot)) translateX(60px); opacity: 0; }
.lb-left-leave-to    { transform: rotate(var(--rot)) translateX(-60px); opacity: 0; }
.lb-right-enter-from { transform: rotate(var(--rot)) translateX(-60px); opacity: 0; }
.lb-right-leave-to   { transform: rotate(var(--rot)) translateX(60px); opacity: 0; }

/* ── Navigation ── */
.lb-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.lb-arrow {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  font-size: 24px;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s, opacity 0.15s;
  line-height: 1;
}
.lb-arrow:disabled { opacity: 0.2; pointer-events: none; }
.lb-arrow:active { background: rgba(255, 255, 255, 0.14); }

.lb-counter {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  font-size: 11px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.4);
}
</style>
