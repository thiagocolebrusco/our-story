<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Photo } from '../data/album'

const props = defineProps<{
  photo: Photo
  index: number
  revealed: boolean
}>()

const emit = defineEmits<{ (e: 'expand'): void }>()

const animate = ref(false)

watch(() => props.revealed, (val) => {
  if (val) {
    animate.value = true
    setTimeout(() => { animate.value = false }, 700)
  }
})

function getImageUrl(id: string) {
  return `/photos/${id}.jpg`
}
</script>

<template>
  <div
    class="polaroid"
    :class="{ 'is-revealed': revealed, 'is-animating': animate }"
    :style="{ '--rot': `${photo.rotation}deg` }"
    @click="revealed && $emit('expand')"
  >
    <div class="photo-area">
      <img v-if="revealed" :src="getImageUrl(photo.id)" :alt="photo.caption" class="photo-img" />
      <div v-else class="placeholder">
        <span class="placeholder-icon">✦</span>
      </div>
    </div>
    <div class="caption">{{ revealed ? photo.caption : '· · ·' }}</div>
  </div>
</template>

<style scoped>
.polaroid {
  background: #e0d5c8;
  padding: 8px 8px 28px 8px;
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.18), 0 1px 3px rgba(0, 0, 0, 0.1);
  transform: rotate(var(--rot));
  flex-shrink: 0;
  transition: background 0.5s ease, filter 0.5s ease;
  filter: grayscale(0.7) brightness(0.8);
  position: relative;
}

.polaroid.is-revealed {
  background: #fffef8;
  filter: none;
  cursor: zoom-in;
}

.polaroid.is-revealed:active {
  transform: rotate(var(--rot)) scale(0.96);
}

.polaroid.is-animating {
  animation: photo-pop 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes photo-pop {
  0% {
    transform: rotate(var(--rot)) scale(0.1) translateY(-50px);
    opacity: 0;
    filter: brightness(2) saturate(0);
  }
  55% {
    transform: rotate(var(--rot)) scale(1.12) translateY(5px);
    opacity: 1;
    filter: brightness(1.15) saturate(1.3);
  }
  78% {
    transform: rotate(var(--rot)) scale(0.95) translateY(-2px);
    filter: brightness(1);
  }
  100% {
    transform: rotate(var(--rot)) scale(1) translateY(0);
    opacity: 1;
    filter: none;
  }
}

/* Locked shimmer effect */
.polaroid:not(.is-revealed)::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.12) 50%,
    transparent 60%
  );
  background-size: 200% 100%;
  animation: shimmer 2.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}

.photo-area {
  width: 100%;
  aspect-ratio: 1 / 0.85;
  background: linear-gradient(135deg, #cdc3b8 0%, #bfb5a8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.polaroid.is-revealed .photo-area {
  background: linear-gradient(135deg, #f0e6d3 0%, #e8d5c4 50%, #dfc9b8 100%);
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 20px;
  opacity: 0.25;
  color: #7a6a5a;
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
  opacity: 0.3;
  transition: opacity 0.5s ease 0.2s;
}

.polaroid.is-revealed .caption {
  opacity: 1;
}
</style>
