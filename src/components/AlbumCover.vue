<script setup lang="ts">
import { ref, computed } from 'vue'
import { coverData } from '../data/album'

const props = defineProps<{
  unlockedCount: number
  totalCount: number
}>()

const emit = defineEmits<{ (e: 'next'): void; (e: 'summary'): void; (e: 'admin'): void }>()

const percentage = computed(() =>
  props.totalCount > 0 ? Math.round(props.unlockedCount / props.totalCount * 100) : 0
)

// Secret tap counter on the title — 5 taps within 3s opens admin
const tapCount = ref(0)
let tapTimer: ReturnType<typeof setTimeout> | null = null

function onTitleTap(e: Event) {
  e.stopPropagation()
  tapCount.value++
  if (tapTimer) clearTimeout(tapTimer)
  if (tapCount.value >= 5) {
    tapCount.value = 0
    emit('admin')
    return
  }
  tapTimer = setTimeout(() => { tapCount.value = 0 }, 3000)
}
</script>

<template>
  <div class="cover" @click="$emit('next')">
    <!-- Map button -->
    <button class="map-btn" @click.stop="$emit('summary')" aria-label="Ver todos os anos">⊞</button>

    <!-- Decorative border -->
    <div class="border-outer">
      <div class="border-inner">

        <!-- Top ornament -->
        <div class="ornament top">✦ ♡ ✦</div>

        <!-- Main content -->
        <div class="content">
          <div class="names">{{ coverData.names }}</div>

          <h1 class="title" @click="onTitleTap">{{ coverData.title }}</h1>

          <div class="divider">
            <span class="line"></span>
            <span class="diamond">◆</span>
            <span class="line"></span>
          </div>

          <div class="years">{{ coverData.years }}</div>

          <div class="tagline">{{ coverData.tagline }}</div>

          <!-- Decorative photos mockup -->
          <div class="mini-photos">
            <div class="mini-photo" style="transform: rotate(-4deg) translateY(4px)"></div>
            <div class="mini-photo featured" style="transform: rotate(0deg)"></div>
            <div class="mini-photo" style="transform: rotate(3.5deg) translateY(4px)"></div>
          </div>
        </div>

        <!-- Bottom ornament -->
        <div class="ornament bottom">✦ ♡ ✦</div>

        <!-- Reveal progress -->
        <div class="reveal-progress">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: percentage + '%' }"></div>
          </div>
          <span class="progress-label">{{ percentage }}% revelado</span>
        </div>

        <div class="tap-hint">toque para começar</div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.cover {
  width: 100%;
  height: 100%;
  background: linear-gradient(160deg, #2c1810 0%, #4a2020 35%, #3d1a2e 70%, #1e1020 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/* Map button */
.map-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(196, 151, 59, 0.3);
  border-radius: 8px;
  font-size: 15px;
  color: rgba(196, 151, 59, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}
.map-btn:active { background: rgba(255, 255, 255, 0.12); }

/* Subtle texture overlay */
.cover::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(ellipse at 30% 20%, rgba(201, 151, 107, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 80%, rgba(139, 74, 107, 0.1) 0%, transparent 60%);
  pointer-events: none;
}

.border-outer {
  width: calc(100% - 28px);
  height: calc(100% - 28px);
  border: 1.5px solid rgba(201, 160, 90, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.border-inner {
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  border: 1px solid rgba(201, 160, 90, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px 14px;
}

.ornament {
  font-family: 'Dancing Script', cursive;
  color: #c4973b;
  font-size: 13px;
  letter-spacing: 6px;
  opacity: 0.85;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
  justify-content: center;
}

.names {
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-style: italic;
  color: rgba(232, 180, 184, 0.85);
  letter-spacing: 1.5px;
  text-align: center;
}

.title {
  font-family: 'Dancing Script', cursive;
  font-size: 42px;
  font-weight: 700;
  color: #e8c87a;
  margin: 0;
  line-height: 1.1;
  text-align: center;
  text-shadow: 0 2px 20px rgba(232, 200, 122, 0.3);
}

.divider {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 70%;
}

.line {
  flex: 1;
  height: 1px;
  background: rgba(201, 160, 90, 0.45);
}

.diamond {
  color: #c4973b;
  font-size: 8px;
}

.years {
  font-family: 'Playfair Display', serif;
  font-size: 15px;
  color: rgba(232, 200, 122, 0.85);
  letter-spacing: 3px;
}

.tagline {
  font-family: 'Dancing Script', cursive;
  font-size: 19px;
  color: rgba(232, 180, 184, 0.9);
  font-style: italic;
  text-align: center;
}

.mini-photos {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.mini-photo {
  width: 58px;
  height: 66px;
  background: linear-gradient(135deg, rgba(255,254,248,0.12), rgba(255,254,248,0.06));
  border: 1px solid rgba(255, 254, 248, 0.2);
  box-shadow: 2px 3px 10px rgba(0,0,0,0.4);
}

.mini-photo.featured {
  width: 68px;
  height: 76px;
  background: linear-gradient(135deg, rgba(255,254,248,0.16), rgba(255,254,248,0.08));
  border-color: rgba(201, 160, 90, 0.35);
}

.reveal-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 60%;
  margin-bottom: 2px;
}

.progress-track {
  width: 100%;
  height: 2px;
  background: rgba(201, 160, 90, 0.18);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, rgba(196, 151, 59, 0.6), rgba(232, 200, 122, 0.9));
  border-radius: 2px;
  transition: width 0.6s ease;
}

.progress-label {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  font-size: 9px;
  color: rgba(220, 185, 140, 0.45);
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.tap-hint {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  font-size: 10px;
  color: rgba(220, 185, 140, 0.4);
  letter-spacing: 2px;
  text-transform: uppercase;
}
</style>
