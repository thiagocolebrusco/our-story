<script setup lang="ts">
import type { Photo } from '../data/album'

defineProps<{
  photo: Photo
  index: number
}>()
</script>

<template>
  <div class="polaroid" :style="{ '--rot': `${photo.rotation}deg` }">
    <div class="photo-area">
      <div class="placeholder">
        <span class="placeholder-icon">♡</span>
      </div>
    </div>
    <div class="caption">{{ photo.caption }}</div>
  </div>
</template>

<style scoped>
.polaroid {
  background: #fffef8;
  padding: 8px 8px 28px 8px;
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.18), 0 1px 3px rgba(0, 0, 0, 0.1);
  transform: rotate(var(--rot));
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.polaroid:active {
  transform: rotate(var(--rot)) scale(1.04);
}

.photo-area {
  width: 100%;
  aspect-ratio: 1 / 0.85;
  background: linear-gradient(135deg, #f0e6d3 0%, #e8d5c4 50%, #dfc9b8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.placeholder-icon {
  font-size: 28px;
  opacity: 0.45;
  color: #8b5e52;
}

.caption {
  font-family: 'Dancing Script', cursive;
  font-size: 11px;
  color: #5a3e35;
  text-align: center;
  line-height: 1.3;
  margin-top: 4px;
  padding: 0 2px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>
