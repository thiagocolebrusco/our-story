<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import jsQR from 'jsqr'

const emit = defineEmits<{
  (e: 'token', token: string): void
  (e: 'close'): void
}>()

const videoRef  = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const error     = ref<string | null>(null)
const detected  = ref(false)

let stream:    MediaStream | null = null
let animFrame: number = 0

async function start() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
      audio: false,
    })
    const video = videoRef.value!
    video.srcObject = stream
    await video.play()
    animFrame = requestAnimationFrame(scan)
  } catch {
    error.value = 'Câmera não disponível.\nVerifique as permissões e tente novamente.'
  }
}

function scan() {
  if (detected.value) return
  const video  = videoRef.value
  const canvas = canvasRef.value
  if (!video || !canvas) return

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(video, 0, 0)
    const img  = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' })
    if (code) {
      const match = code.data.match(/#unlock-([a-z0-9]+)/)
      if (match) {
        detected.value = true
        stop()
        emit('token', match[1]!)
        return
      }
    }
  }
  animFrame = requestAnimationFrame(scan)
}

function stop() {
  cancelAnimationFrame(animFrame)
  stream?.getTracks().forEach(t => t.stop())
  stream = null
}

onMounted(start)
onUnmounted(stop)
</script>

<template>
  <div class="scanner-overlay">

    <!-- Header -->
    <div class="scanner-header">
      <div class="header-ornament">✦ ♡ ✦</div>
      <div class="header-title">Escanear código</div>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <!-- Camera stage -->
    <div class="camera-stage">

      <!-- Live camera feed -->
      <video ref="videoRef" class="camera-feed" playsinline muted></video>

      <!-- Off-screen canvas for QR decoding -->
      <canvas ref="canvasRef" class="camera-canvas" aria-hidden="true"></canvas>

      <!-- Dark vignette panels around the target zone -->
      <div class="vignette-top"    aria-hidden="true"></div>
      <div class="vignette-bottom" aria-hidden="true"></div>
      <div class="vignette-left"   aria-hidden="true"></div>
      <div class="vignette-right"  aria-hidden="true"></div>

      <!-- Targeting frame -->
      <div class="target-frame" :class="{ detected }">
        <div class="corner tl"></div>
        <div class="corner tr"></div>
        <div class="corner bl"></div>
        <div class="corner br"></div>
        <div v-if="!detected" class="scan-line"></div>
        <div v-else class="detected-check">✓</div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="error-msg">{{ error }}</div>

    </div>

    <!-- Hint text -->
    <div class="hint-text">
      {{ detected ? 'Código encontrado! ♡' : 'Aponte a câmera para o código QR do pacote' }}
    </div>

  </div>
</template>

<style scoped>
/* ── Shell ── */
.scanner-overlay {
  position: absolute;
  inset: 0;
  z-index: 500;
  background: #0c0410;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Header ── */
.scanner-header {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 20px 16px;
  position: relative;
}

.header-ornament {
  font-family: 'Dancing Script', cursive;
  font-size: 13px;
  color: rgba(196, 151, 59, 0.5);
  letter-spacing: 5px;
  margin-bottom: 6px;
}

.header-title {
  font-family: 'Dancing Script', cursive;
  font-size: 26px;
  font-weight: 600;
  color: #e8c87a;
  text-shadow: 0 0 20px rgba(232, 200, 122, 0.35);
}

.close-btn {
  position: absolute;
  top: 24px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  color: rgba(245, 230, 200, 0.55);
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
}
.close-btn:active { background: rgba(255, 255, 255, 0.12); }

/* ── Camera stage ── */
.camera-stage {
  width: 100%;
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #000;
}

.camera-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.camera-canvas {
  display: none;
}

/* Vignette panels darken around the target frame */
.vignette-top,
.vignette-bottom,
.vignette-left,
.vignette-right {
  position: absolute;
  background: rgba(8, 2, 12, 0.62);
  pointer-events: none;
}
.vignette-top    { top: 0;    left: 0;   right: 0;  height: calc(50% - 110px); }
.vignette-bottom { bottom: 0; left: 0;   right: 0;  height: calc(50% - 110px); }
.vignette-left   { top: calc(50% - 110px); bottom: calc(50% - 110px); left: 0;   width: calc(50% - 110px); }
.vignette-right  { top: calc(50% - 110px); bottom: calc(50% - 110px); right: 0;  width: calc(50% - 110px); }

/* ── Targeting frame ── */
.target-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 220px;
  height: 220px;
  transition: box-shadow 0.3s ease;
}

.target-frame.detected {
  animation: frame-success 0.4s ease forwards;
}

@keyframes frame-success {
  0%   { transform: translate(-50%, -50%) scale(1); }
  50%  { transform: translate(-50%, -50%) scale(1.06); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

/* Corner marks */
.corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: rgba(232, 200, 122, 0.95);
  border-style: solid;
  transition: border-color 0.25s;
}
.target-frame.detected .corner { border-color: rgba(120, 220, 140, 0.95); }

.corner.tl { top: 0;    left: 0;  border-width: 3px 0 0 3px; border-radius: 4px 0 0 0; }
.corner.tr { top: 0;    right: 0; border-width: 3px 3px 0 0; border-radius: 0 4px 0 0; }
.corner.bl { bottom: 0; left: 0;  border-width: 0 0 3px 3px; border-radius: 0 0 0 4px; }
.corner.br { bottom: 0; right: 0; border-width: 0 3px 3px 0; border-radius: 0 0 4px 0; }

/* Scanning line */
.scan-line {
  position: absolute;
  left: 6px;
  right: 6px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(196, 151, 59, 0.85), transparent);
  box-shadow: 0 0 8px rgba(196, 151, 59, 0.5);
  animation: scan-sweep 2.2s ease-in-out infinite;
}

@keyframes scan-sweep {
  0%   { top: 6px;  opacity: 0.7; }
  50%  { top: calc(100% - 8px); opacity: 1; }
  100% { top: 6px;  opacity: 0.7; }
}

/* Detected checkmark */
.detected-check {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: rgba(120, 220, 140, 0.95);
  animation: check-pop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

@keyframes check-pop {
  from { transform: scale(0) rotate(-15deg); opacity: 0; }
  to   { transform: scale(1) rotate(0deg);   opacity: 1; }
}

/* ── Error state ── */
.error-msg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 32px;
  font-family: 'Lato', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: rgba(245, 230, 200, 0.65);
  line-height: 1.6;
  white-space: pre-line;
  background: rgba(8, 2, 12, 0.85);
}

/* ── Hint text ── */
.hint-text {
  flex-shrink: 0;
  padding: 18px 24px 32px;
  font-family: 'Lato', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: rgba(245, 230, 200, 0.55);
  letter-spacing: 0.3px;
  text-align: center;
  transition: color 0.3s;
}
</style>
